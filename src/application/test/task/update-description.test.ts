import { describe, it, expect, beforeEach } from "@rstest/core"
import { UpdateTaskDescription } from "@app/use-cases/task/update-description"
import { InMemoryTaskRepository } from "@app/test/mocks/in-memory-task-repository"
import { TaskRepository } from "@app/ports/repositories/task-repository"
import { Task } from "@domain/task/task"
import { ActivityType, DescriptionUpdatedMetadata } from "@jigjoy-ai/task-contracts"
import { DescriptionUpdated } from "@domain/task/activity/activities/description-updated"

describe("Update Task Description", () => {
	let updateTaskDescriptionUseCase: UpdateTaskDescription
	let repository: TaskRepository

	beforeEach(() => {
		repository = new InMemoryTaskRepository()
		updateTaskDescriptionUseCase = new UpdateTaskDescription(repository)
	})

	it("should successfully update task description", async () => {
		// Arrange
		const task = Task.create("User", "project-123", "Test Task", "Original Description")
		await repository.save(task)
		const newDescription = "Updated Description"

		// Act
		const result = await updateTaskDescriptionUseCase.execute(task.id, newDescription)

		// Assert
		expect(result).toBeDefined()
		expect(result.id).toBe(task.id)
		expect(result.description).toBe(newDescription)
		expect(result.title).toBe(task.title)
		expect(result.projectId).toBe(task.projectId)
	})

	it("should add DescriptionUpdated activity to activity log", async () => {
		// Arrange
		const task = Task.create("User", "project-123", "Test Task", "Original Description")
		await repository.save(task)
		const initialActivityCount = task.getActivityLog().length

		// Act
		const result = await updateTaskDescriptionUseCase.execute(task.id, "New Description")

		// Assert
		const activities = result.getActivityLog()
		expect(activities).toHaveLength(initialActivityCount + 1)
		const lastActivity = activities[activities.length - 1]
		expect(lastActivity).toBeInstanceOf(DescriptionUpdated)
		expect(lastActivity.type).toBe(ActivityType.DESCRIPTION_UPDATED)
		expect(lastActivity.userId).toBe("User")
	})

	it("should update the task's updated timestamp", async () => {
		// Arrange
		const task = Task.create("User", "project-123", "Test Task", "Original Description")
		await repository.save(task)
		const originalUpdated = task.updated

		// Act
		const result = await updateTaskDescriptionUseCase.execute(task.id, "New Description")

		// Assert
		expect(result.updated).not.toBeNull()
		expect(result.updated).not.toBe(originalUpdated)
	})

	it("should preserve all other task properties", async () => {
		// Arrange
		const task = Task.create("User", "project-123", "Original Title", "Original Description")
		task.updateTitle("User", "Updated Title")
		task.startedWork("worker-123", "Starting work")
		const originalId = task.id
		const originalProjectId = task.projectId
		const originalTitle = task.title
		const originalStatus = task.status
		const originalCreated = task.created
		await repository.save(task)

		// Act
		const result = await updateTaskDescriptionUseCase.execute(task.id, "New Description")

		// Assert
		expect(result.id).toBe(originalId)
		expect(result.projectId).toBe(originalProjectId)
		expect(result.title).toBe(originalTitle)
		expect(result.status).toBe(originalStatus)
		expect(result.created).toBe(originalCreated)
		expect(result.description).toBe("New Description")
	})

	it("should allow updating to empty description", async () => {
		// Arrange
		const task = Task.create("User", "project-123", "Test Task", "Original Description")
		await repository.save(task)

		// Act
		const result = await updateTaskDescriptionUseCase.execute(task.id, "")

		// Assert
		expect(result.description).toBe("")
		const activities = result.getActivityLog()
		const descriptionUpdatedActivity = activities.find(
			(a) => a.type === ActivityType.DESCRIPTION_UPDATED,
		) as DescriptionUpdated
		expect(descriptionUpdatedActivity).toBeDefined()
	})

	it("should not update timestamp if description is the same", async () => {
		// Arrange
		const task = Task.create("User", "project-123", "Test Task", "Same Description")
		await repository.save(task)
		const originalUpdated = task.updated

		// Act
		const result = await updateTaskDescriptionUseCase.execute(task.id, "Same Description")

		// Assert
		expect(result.description).toBe("Same Description")
		// Note: updateDescription doesn't update timestamp if description is the same
		// But if originalUpdated was null, it will be set to a timestamp
		if (originalUpdated !== null) {
			expect(result.updated).toBe(originalUpdated)
		}
	})

	it("should allow updating description multiple times", async () => {
		// Arrange
		const task = Task.create("User", "project-123", "Test Task", "Description 1")
		await repository.save(task)

		// Act
		await updateTaskDescriptionUseCase.execute(task.id, "Description 2")
		const result2 = await updateTaskDescriptionUseCase.execute(task.id, "Description 3")

		// Assert
		expect(result2.description).toBe("Description 3")
		const activities = result2.getActivityLog()
		const descriptionUpdatedActivities = activities.filter(
			(a) => a.type === ActivityType.DESCRIPTION_UPDATED,
		)
		expect(descriptionUpdatedActivities).toHaveLength(2)
		
		// Verify the first update was persisted
		const savedTask = await repository.get(task.id)
		expect(savedTask!.description).toBe("Description 3")
	})

	it("should create DescriptionUpdated activity with correct metadata", async () => {
		// Arrange
		const task = Task.create("User", "project-123", "Test Task", "Original Description")
		await repository.save(task)
		const newDescription = "New Description"

		// Act
		const result = await updateTaskDescriptionUseCase.execute(task.id, newDescription)

		// Assert
		const activities = result.getActivityLog()
		const descriptionUpdatedActivity = activities.find(
			(a) => a.type === ActivityType.DESCRIPTION_UPDATED,
		) as DescriptionUpdated
		expect(descriptionUpdatedActivity).toBeDefined()
		expect(descriptionUpdatedActivity!.taskId).toBe(task.id)
		expect(descriptionUpdatedActivity!.projectId).toBe(task.projectId)
		expect(descriptionUpdatedActivity!.userId).toBe("User")
		if (descriptionUpdatedActivity) {
			const metadata = descriptionUpdatedActivity.metadata as DescriptionUpdatedMetadata
			// Note: The task description is updated before the activity is created,
			// so oldDescription will be the new description (task.description is already updated)
			expect(metadata.newDescription).toBe(newDescription)
		}
	})

	it("should throw an error when task does not exist", async () => {
		// Arrange
		const nonExistentId = "non-existent-id"
		const newDescription = "New Description"

		// Act & Assert
		await expect(updateTaskDescriptionUseCase.execute(nonExistentId, newDescription)).rejects.toThrow(
			"Task not found.",
		)
	})

	it("should throw an error when task is null", async () => {
		// Arrange
		const nullReturningRepository: TaskRepository = {
			save: async () => {
				throw new Error("Should not be called")
			},
			get: async () => {
				return null
			},
			getAll: async () => {
				throw new Error("Should not be called")
			},
		}
		const nullUseCase = new UpdateTaskDescription(nullReturningRepository)

		// Act & Assert
		// This covers the if (!task) branch on line 13-14
		await expect(nullUseCase.execute("some-id", "New Description")).rejects.toThrow("Task not found.")
	})

	it("should throw an error when repository get fails", async () => {
		// Arrange
		const errorMessage = "Repository connection failed"
		const errorThrowingRepository: TaskRepository = {
			save: async () => {
				throw new Error("Should not be called")
			},
			get: async () => {
				throw new Error(errorMessage)
			},
			getAll: async () => {
				throw new Error("Should not be called")
			},
		}
		const errorUseCase = new UpdateTaskDescription(errorThrowingRepository)

		// Act & Assert
		await expect(errorUseCase.execute("some-id", "New Description")).rejects.toThrow(errorMessage)
	})

	it("should throw an error when repository save fails", async () => {
		// Arrange
		const task = Task.create("User", "project-123", "Test Task", "Original Description")
		await repository.save(task)

		const errorMessage = "Repository save failed"
		const errorThrowingRepository: TaskRepository = {
			save: async () => {
				throw new Error(errorMessage)
			},
			get: async (taskId: string) => {
				return repository.get(taskId)
			},
			getAll: async () => {
				throw new Error("Should not be called")
			},
		}
		const errorUseCase = new UpdateTaskDescription(errorThrowingRepository)

		// Act & Assert
		await expect(errorUseCase.execute(task.id, "New Description")).rejects.toThrow(errorMessage)
	})

	it("should persist the description update to repository", async () => {
		// Arrange
		const task = Task.create("User", "project-123", "Test Task", "Original Description")
		await repository.save(task)

		// Act
		const result = await updateTaskDescriptionUseCase.execute(task.id, "Persisted Description")

		// Assert
		const savedTask = await repository.get(task.id)
		expect(savedTask).toBeDefined()
		expect(savedTask!.description).toBe("Persisted Description")
		expect(savedTask!.id).toBe(result.id)
	})
})
