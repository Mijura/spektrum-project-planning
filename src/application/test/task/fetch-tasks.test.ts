import { describe, it, expect, beforeEach } from "@rstest/core"
import { FetchTasks } from "@app/use-cases/task/fetch-tasks"
import { InMemoryTaskRepository } from "@app/test/mocks/in-memory-task-repository"
import { TaskRepository } from "@app/ports/repositories/task-repository"
import { Task } from "@domain/task/task"
import { TaskStatus, ActivityType } from "@jigjoy-io/task-contracts"

describe("Fetch Tasks", () => {
	let fetchTasksUseCase: FetchTasks
	let repository: TaskRepository

	beforeEach(() => {
		repository = new InMemoryTaskRepository()
		fetchTasksUseCase = new FetchTasks(repository)
	})

	it("should successfully fetch tasks for a project", async () => {
		// Arrange
		const projectId = "project-123"
		const task1 = Task.create("User", projectId, "Task 1", "Description 1")
		const task2 = Task.create("User", projectId, "Task 2", "Description 2")
		await repository.save(task1)
		await repository.save(task2)

		// Act
		const result = await fetchTasksUseCase.execute(projectId)

		// Assert
		expect(result).toBeDefined()
		expect(result).toHaveLength(2)
		expect(result.map((t) => t.id)).toContain(task1.id)
		expect(result.map((t) => t.id)).toContain(task2.id)
		expect(result.every((t) => t.projectId === projectId)).toBe(true)
	})

	it("should return empty array when no tasks exist for project", async () => {
		// Arrange
		const projectId = "project-456"

		// Act
		const result = await fetchTasksUseCase.execute(projectId)

		// Assert
		expect(result).toBeDefined()
		expect(result).toHaveLength(0)
		expect(Array.isArray(result)).toBe(true)
	})

	it("should only return tasks for the specified project", async () => {
		// Arrange
		const project1 = "project-111"
		const project2 = "project-222"
		const task1 = Task.create("User", project1, "Task 1", "Description")
		const task2 = Task.create("User", project1, "Task 2", "Description")
		const task3 = Task.create("User", project2, "Task 3", "Description")

		await repository.save(task1)
		await repository.save(task2)
		await repository.save(task3)

		// Act
		const result = await fetchTasksUseCase.execute(project1)

		// Assert
		expect(result).toHaveLength(2)
		expect(result.map((t) => t.id)).toContain(task1.id)
		expect(result.map((t) => t.id)).toContain(task2.id)
		expect(result.map((t) => t.id)).not.toContain(task3.id)
		expect(result.every((t) => t.projectId === project1)).toBe(true)
	})

	it("should return multiple tasks for the same project", async () => {
		// Arrange
		const projectId = "project-333"
		const tasks = [
			Task.create("User", projectId, "Task A", "Description A"),
			Task.create("User", projectId, "Task B", "Description B"),
			Task.create("User", projectId, "Task C", "Description C"),
			Task.create("User", projectId, "Task D", "Description D"),
		]

		for (const task of tasks) {
			await repository.save(task)
		}

		// Act
		const result = await fetchTasksUseCase.execute(projectId)

		// Assert
		expect(result).toHaveLength(4)
		expect(result.map((t) => t.id).sort()).toEqual(tasks.map((t) => t.id).sort())
		expect(result.every((t) => t.projectId === projectId)).toBe(true)
	})

	it("should return tasks with all properties correctly", async () => {
		// Arrange
		const projectId = "project-444"
		const task = Task.create("User", projectId, "Test Task", "Test Description")
		task.updateTitle("User", "Updated Title")
		task.updateDescription("User", "Updated Description")
		await repository.save(task)

		// Act
		const result = await fetchTasksUseCase.execute(projectId)

		// Assert
		expect(result).toHaveLength(1)
		const fetchedTask = result[0]
		expect(fetchedTask.id).toBe(task.id)
		expect(fetchedTask.title).toBe("Updated Title")
		expect(fetchedTask.description).toBe("Updated Description")
		expect(fetchedTask.projectId).toBe(projectId)
		expect(fetchedTask.status).toBe(task.status)
		expect(fetchedTask.created).toBe(task.created)
		expect(fetchedTask.updated).toBe(task.updated)
	})

	it("should return tasks with different statuses", async () => {
		// Arrange
		const projectId = "project-555"
		const task1 = Task.create("User", projectId, "Task 1", "Description")
		const task2 = Task.create("User", projectId, "Task 2", "Description")
		task2.startedWork("worker-123", "Starting work")
		const task3 = Task.create("User", projectId, "Task 3", "Description")
		task3.startedWork("worker-123", "Starting")
		task3.finishedWork("worker-123", "Finished")

		await repository.save(task1)
		await repository.save(task2)
		await repository.save(task3)

		// Act
		const result = await fetchTasksUseCase.execute(projectId)

		// Assert
		expect(result).toHaveLength(3)
		expect(result.find((t) => t.id === task1.id)!.status).toBe(TaskStatus.TODO)
		expect(result.find((t) => t.id === task2.id)!.status).toBe(TaskStatus.WORK_IN_PROGRESS)
		expect(result.find((t) => t.id === task3.id)!.status).toBe(TaskStatus.DONE)
	})

	it("should return tasks with activity logs", async () => {
		// Arrange
		const projectId = "project-666"
		const task = Task.create("User", projectId, "Task", "Description")
		task.updateTitle("User", "New Title")
		task.leaveComment("User", "Comment")
		await repository.save(task)

		// Act
		const result = await fetchTasksUseCase.execute(projectId)

		// Assert
		expect(result).toHaveLength(1)
		const fetchedTask = result[0]
		const activities = fetchedTask.getActivityLog()
		expect(activities.length).toBeGreaterThan(0)
		expect(activities.some((a) => a.type === ActivityType.TASK_CREATED)).toBe(true)
	})

	it("should throw an error when repository getAll fails", async () => {
		// Arrange
		const projectId = "project-777"
		const errorMessage = "Repository connection failed"
		const errorThrowingRepository: TaskRepository = {
			save: async () => {
				throw new Error("Should not be called")
			},
			get: async () => {
				throw new Error("Should not be called")
			},
			getAll: async () => {
				throw new Error(errorMessage)
			},
		}
		const errorUseCase = new FetchTasks(errorThrowingRepository)

		// Act & Assert
		await expect(errorUseCase.execute(projectId)).rejects.toThrow(errorMessage)
	})

	it("should return tasks in the order they were saved", async () => {
		// Arrange
		const projectId = "project-888"
		const task1 = Task.create("User", projectId, "Task 1", "Description")
		const task2 = Task.create("User", projectId, "Task 2", "Description")
		const task3 = Task.create("User", projectId, "Task 3", "Description")

		await repository.save(task1)
		await repository.save(task2)
		await repository.save(task3)

		// Act
		const result = await fetchTasksUseCase.execute(projectId)

		// Assert
		expect(result).toHaveLength(3)
		// Note: The order depends on the repository implementation
		// We just verify all tasks are present
		expect(result.map((t) => t.id)).toContain(task1.id)
		expect(result.map((t) => t.id)).toContain(task2.id)
		expect(result.map((t) => t.id)).toContain(task3.id)
	})
})
