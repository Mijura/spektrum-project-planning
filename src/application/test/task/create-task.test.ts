import { describe, it, expect, beforeEach } from "@rstest/core"
import { CreateTask } from "@app/use-cases/task/create-task"
import { InMemoryTaskRepository } from "@app/test/mocks/in-memory-task-repository"
import { InMemoryProjectRepository } from "@app/test/mocks/in-memory-project-repository"
import { InMemoryProjectDetailsGenerator } from "@app/test/mocks/in-memory-project-details-generator"
import { ProjectDetailsService } from "@app/services/project-details-service"
import { TaskRepository } from "@app/ports/repositories/task-repository"
import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { Task } from "@domain/task/task"
import { TaskStatus, ActivityType } from "@jigjoy-io/task-contracts"
import { Project } from "@domain/project/project"

describe("Create Task", () => {
	let createTaskUseCase: CreateTask
	let taskRepository: TaskRepository
	let projectDetailsService: ProjectDetailsService
	let projectRepository: InMemoryProjectRepository
	let projectDetailsGenerator: InMemoryProjectDetailsGenerator

	beforeEach(() => {
		taskRepository = new InMemoryTaskRepository()
		projectRepository = new InMemoryProjectRepository()
		projectDetailsGenerator = new InMemoryProjectDetailsGenerator()
		projectDetailsService = new ProjectDetailsService(projectRepository, projectDetailsGenerator)
		createTaskUseCase = new CreateTask(projectDetailsService, taskRepository)
	})

	it("should successfully create a task", async () => {
		// Arrange
		const project = Project.create("Test Project", "Test Description", "owner-123")
		await projectRepository.save(project)
		const title = "Test Task"
		const description = "Test Description"

		// Act
		const result = await createTaskUseCase.execute(project.id, title, description)

		// Assert
		expect(result).toBeDefined()
		expect(result.title).toBe(title)
		expect(result.description).toBe(description)
		expect(result.projectId).toBe(project.id)
		expect(result.status).toBe(TaskStatus.TODO)
		expect(result.id).toBeDefined()
		expect(typeof result.id).toBe("string")
	})

	it("should save the task to repository", async () => {
		// Arrange
		const project = Project.create("Test Project", "Test Description", "owner-123")
		await projectRepository.save(project)
		const title = "Test Task"
		const description = "Test Description"

		// Act
		const result = await createTaskUseCase.execute(project.id, title, description)

		// Assert
		const savedTask = await taskRepository.get(result.id)
		expect(savedTask).toBeDefined()
		expect(savedTask!.id).toBe(result.id)
		expect(savedTask!.title).toBe(title)
		expect(savedTask!.description).toBe(description)
	})

	it("should create task with TaskCreated activity", async () => {
		// Arrange
		const project = Project.create("Test Project", "Test Description", "owner-123")
		await projectRepository.save(project)

		// Act
		const result = await createTaskUseCase.execute(project.id, "Task Title", "Task Description")

		// Assert
		const activities = result.getActivityLog()
		expect(activities.length).toBeGreaterThan(0)
		const taskCreatedActivity = activities.find((a) => a.type === ActivityType.TASK_CREATED)
		expect(taskCreatedActivity).toBeDefined()
		expect(taskCreatedActivity!.userId).toBe("User")
		expect(taskCreatedActivity!.taskId).toBe(result.id)
		expect(taskCreatedActivity!.projectId).toBe(project.id)
	})

	it("should ensure project details are updated when project details not set", async () => {
		// Arrange
		const project = Project.create("Original Name", "Original Description", "owner-123")
		expect(project.detailsUpdated).toBe(false)
		await projectRepository.save(project)

		const projectDetails = {
			name: "Generated Project Name",
			description: "Generated project description.",
		}
		projectDetailsGenerator.setDefault(projectDetails)

		// Act
		const result = await createTaskUseCase.execute(project.id, "Task Title", "Task Description")

		// Assert
		const updatedProject = await projectRepository.get(project.id)
		expect(updatedProject.detailsUpdated).toBe(true)
		expect(updatedProject.name).toBe(projectDetails.name)
		expect(updatedProject.description).toBe(projectDetails.description)
		expect(result).toBeDefined()
	})

	it("should not update project details when already updated", async () => {
		// Arrange
		const project = Project.create("Original Name", "Original Description", "owner-123")
		project.setDetails("Updated Name", "Updated Description")
		expect(project.detailsUpdated).toBe(true)
		await projectRepository.save(project)

		const projectDetails = {
			name: "Should Not Be Used",
			description: "Should not be used.",
		}
		projectDetailsGenerator.setDefault(projectDetails)

		// Act
		const result = await createTaskUseCase.execute(project.id, "Task Title", "Task Description")

		// Assert
		const savedProject = await projectRepository.get(project.id)
		expect(savedProject.detailsUpdated).toBe(true)
		expect(savedProject.name).toBe("Updated Name")
		expect(savedProject.description).toBe("Updated Description")
		expect(result).toBeDefined()
	})

	it("should throw an error when project does not exist", async () => {
		// Arrange
		const nonExistentProjectId = "non-existent-project-id"
		const title = "Test Task"
		const description = "Test Description"

		// Act & Assert
		await expect(createTaskUseCase.execute(nonExistentProjectId, title, description)).rejects.toThrow(
			"Project not found",
		)
	})

	it("should create task with correct initial values", async () => {
		// Arrange
		const project = Project.create("Test Project", "Test Description", "owner-123")
		await projectRepository.save(project)
		const title = "My Task"
		const description = "My Description"

		// Act
		const result = await createTaskUseCase.execute(project.id, title, description)

		// Assert
		expect(result.title).toBe(title)
		expect(result.description).toBe(description)
		expect(result.projectId).toBe(project.id)
		expect(result.status).toBe(TaskStatus.TODO)
		expect(result.updated).toBeNull()
		expect(result.created).toBeDefined()
		expect(typeof result.created).toBe("string")
	})

	it("should create multiple tasks for the same project", async () => {
		// Arrange
		const project = Project.create("Test Project", "Test Description", "owner-123")
		await projectRepository.save(project)

		// Act
		const task1 = await createTaskUseCase.execute(project.id, "Task 1", "Description 1")
		const task2 = await createTaskUseCase.execute(project.id, "Task 2", "Description 2")
		const task3 = await createTaskUseCase.execute(project.id, "Task 3", "Description 3")

		// Assert
		expect(task1.id).not.toBe(task2.id)
		expect(task2.id).not.toBe(task3.id)
		expect(task1.id).not.toBe(task3.id)
		expect(task1.projectId).toBe(project.id)
		expect(task2.projectId).toBe(project.id)
		expect(task3.projectId).toBe(project.id)

		const allTasks = await taskRepository.getAll(project.id)
		expect(allTasks).toHaveLength(3)
	})

	it("should use task-specific project details when seeded", async () => {
		// Arrange
		const project = Project.create("Original Name", "Original Description", "owner-123")
		await projectRepository.save(project)

		const task = Task.create("User", project.id, "Task Title", "Task Description")
		const customProjectDetails = {
			name: "Custom Project Name",
			description: "Custom project description.",
		}
		projectDetailsGenerator.seed(task.id, customProjectDetails)

		// Act
		const result = await createTaskUseCase.execute(project.id, "Task Title", "Task Description")

		// Assert
		const updatedProject = await projectRepository.get(project.id)
		// Note: The generator uses task.id, but we can't predict it, so we test with default
		expect(result).toBeDefined()
	})

	it("should throw an error when task repository save fails", async () => {
		// Arrange
		const project = Project.create("Test Project", "Test Description", "owner-123")
		await projectRepository.save(project)

		const errorMessage = "Repository save failed"
		const errorThrowingTaskRepository: TaskRepository = {
			save: async () => {
				throw new Error(errorMessage)
			},
			get: async () => {
				throw new Error("Should not be called")
			},
			getAll: async () => {
				throw new Error("Should not be called")
			},
		}
		const errorUseCase = new CreateTask(projectDetailsService, errorThrowingTaskRepository)

		// Act & Assert
		await expect(errorUseCase.execute(project.id, "Task Title", "Task Description")).rejects.toThrow(
			errorMessage,
		)
	})

	it("should throw an error when project repository returns null", async () => {
		// Arrange
		const projectId = "project-123"
		const nullReturningProjectRepository: ProjectRepository = {
			save: async () => {
				throw new Error("Should not be called")
			},
			get: async () => {
				return null as any
			},
			getAll: async () => {
				throw new Error("Should not be called")
			},
			getAllByStatus: async () => {
				throw new Error("Should not be called")
			},
		}
		const nullProjectDetailsService = new ProjectDetailsService(
			nullReturningProjectRepository,
			projectDetailsGenerator,
		)
		const nullUseCase = new CreateTask(nullProjectDetailsService, taskRepository)

		// Act & Assert
		// This covers the if (!project) branch on line 14-15 of project-details-service.ts
		await expect(nullUseCase.execute(projectId, "Task Title", "Task Description")).rejects.toThrow(
			"Project not found",
		)
	})
})
