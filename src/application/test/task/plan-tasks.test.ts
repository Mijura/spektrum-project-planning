import { describe, it, expect, beforeEach } from "@rstest/core"
import { PlanTasks } from "@app/use-cases/task/plan-tasks"
import { InMemoryTaskRepository } from "@app/test/mocks/in-memory-task-repository"
import { InMemoryProjectRepository } from "@app/test/mocks/in-memory-project-repository"
import { InMemoryProjectDetailsGenerator } from "@app/test/mocks/in-memory-project-details-generator"
import { InMemoryTaskGenerator } from "@app/test/mocks/in-memory-task-generator"
import { ProjectDetailsService } from "@app/services/project-details-service"
import { TaskRepository } from "@app/ports/repositories/task-repository"
import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { TaskGenerator } from "@app/ports/generators/task-generator"
import { Task } from "@domain/task/task"
import { TaskStatus } from "@jigjoy-ai/task-contracts"
import { Project } from "@domain/project/project"

describe("Plan Tasks", () => {
	let planTasksUseCase: PlanTasks
	let taskRepository: TaskRepository
	let taskGenerator: TaskGenerator
	let projectDetailsService: ProjectDetailsService
	let projectRepository: InMemoryProjectRepository
	let projectDetailsGenerator: InMemoryProjectDetailsGenerator

	beforeEach(() => {
		taskRepository = new InMemoryTaskRepository()
		projectRepository = new InMemoryProjectRepository()
		projectDetailsGenerator = new InMemoryProjectDetailsGenerator()
		taskGenerator = new InMemoryTaskGenerator()
		projectDetailsService = new ProjectDetailsService(projectRepository, projectDetailsGenerator)
		planTasksUseCase = new PlanTasks(projectDetailsService, taskRepository, taskGenerator)
	})

	it("should successfully plan and save tasks", async () => {
		// Arrange
		const project = Project.create("Test Project", "Test Description", "owner-123")
		await projectRepository.save(project)
		const projectDescription = "Build a note-taking app"
		const generatedTasks = [
			Task.create("Product Owner", project.id, "Task 1", "Description 1"),
			Task.create("Product Owner", project.id, "Task 2", "Description 2"),
			Task.create("Product Owner", project.id, "Task 3", "Description 3"),
		]
		;(taskGenerator as InMemoryTaskGenerator).setDefault(generatedTasks)

		// Act
		const result = await planTasksUseCase.execute(project.id, projectDescription)

		// Assert
		expect(result).toBeDefined()
		expect(result).toHaveLength(3)
		expect(result.every((t) => t.projectId === project.id)).toBe(true)
		expect(result.every((t) => t.status === TaskStatus.TODO)).toBe(true)
	})

	it("should save all generated tasks to repository", async () => {
		// Arrange
		const project = Project.create("Test Project", "Test Description", "owner-123")
		await projectRepository.save(project)
		const projectDescription = "Build a todo app"
		const generatedTasks = [
			Task.create("Product Owner", project.id, "Task A", "Description A"),
			Task.create("Product Owner", project.id, "Task B", "Description B"),
		]
		;(taskGenerator as InMemoryTaskGenerator).setDefault(generatedTasks)

		// Act
		const result = await planTasksUseCase.execute(project.id, projectDescription)

		// Assert
		const allTasks = await taskRepository.getAll(project.id)
		expect(allTasks).toHaveLength(2)
		expect(allTasks.map((t) => t.id).sort()).toEqual(result.map((t) => t.id).sort())
	})

	it("should ensure project details are updated when not set", async () => {
		// Arrange
		const project = Project.create("Original Name", "Original Description", "owner-123")
		expect(project.detailsUpdated).toBe(false)
		await projectRepository.save(project)
		const projectDescription = "Build a chat app"

		const projectDetails = {
			name: "Generated Project Name",
			description: "Generated project description.",
		}
		projectDetailsGenerator.setDefault(projectDetails)

		const generatedTasks = [Task.create("Product Owner", project.id, "Task 1", "Description 1")]
		;(taskGenerator as InMemoryTaskGenerator).setDefault(generatedTasks)

		// Act
		const result = await planTasksUseCase.execute(project.id, projectDescription)

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
		const projectDescription = "Build a calendar app"

		const projectDetails = {
			name: "Should Not Be Used",
			description: "Should not be used.",
		}
		projectDetailsGenerator.setDefault(projectDetails)

		const generatedTasks = [Task.create("Product Owner", project.id, "Task 1", "Description 1")]
		;(taskGenerator as InMemoryTaskGenerator).setDefault(generatedTasks)

		// Act
		const result = await planTasksUseCase.execute(project.id, projectDescription)

		// Assert
		const savedProject = await projectRepository.get(project.id)
		expect(savedProject.detailsUpdated).toBe(true)
		expect(savedProject.name).toBe("Updated Name")
		expect(savedProject.description).toBe("Updated Description")
		expect(result).toBeDefined()
	})

	it("should use project-specific tasks when seeded", async () => {
		// Arrange
		const project = Project.create("Test Project", "Test Description", "owner-123")
		await projectRepository.save(project)
		const projectDescription = "Build a blog platform"

		const customTasks = [
			Task.create("Product Owner", project.id, "Custom Task 1", "Custom Description 1"),
			Task.create("Product Owner", project.id, "Custom Task 2", "Custom Description 2"),
		]
		;(taskGenerator as InMemoryTaskGenerator).seed(project.id, customTasks)

		// Act
		const result = await planTasksUseCase.execute(project.id, projectDescription)

		// Assert
		expect(result).toHaveLength(2)
		expect(result.map((t) => t.title).sort()).toEqual(customTasks.map((t) => t.title).sort())
	})

	it("should handle empty task list from generator", async () => {
		// Arrange
		const project = Project.create("Test Project", "Test Description", "owner-123")
		await projectRepository.save(project)
		const projectDescription = "Build a simple app"
		;(taskGenerator as InMemoryTaskGenerator).setDefault([])

		// Act
		const result = await planTasksUseCase.execute(project.id, projectDescription)

		// Assert
		expect(result).toBeDefined()
		expect(result).toHaveLength(0)
		expect(Array.isArray(result)).toBe(true)
	})

	it("should handle multiple tasks from generator", async () => {
		// Arrange
		const project = Project.create("Test Project", "Test Description", "owner-123")
		await projectRepository.save(project)
		const projectDescription = "Build a complex app"
		const generatedTasks = Array.from({ length: 7 }, (_, i) =>
			Task.create("Product Owner", project.id, `Task ${i + 1}`, `Description ${i + 1}`),
		)
		;(taskGenerator as InMemoryTaskGenerator).setDefault(generatedTasks)

		// Act
		const result = await planTasksUseCase.execute(project.id, projectDescription)

		// Assert
		expect(result).toHaveLength(7)
		expect(result.every((t) => t.projectId === project.id)).toBe(true)
		const allTasks = await taskRepository.getAll(project.id)
		expect(allTasks).toHaveLength(7)
	})

	it("should throw an error when project does not exist", async () => {
		// Arrange
		const nonExistentProjectId = "non-existent-project-id"
		const projectDescription = "Build an app"

		const generatedTasks = [Task.create("Product Owner", nonExistentProjectId, "Task 1", "Description 1")]
		;(taskGenerator as InMemoryTaskGenerator).setDefault(generatedTasks)

		// Act & Assert
		await expect(planTasksUseCase.execute(nonExistentProjectId, projectDescription)).rejects.toThrow(
			"Project not found",
		)
	})

	it("should throw an error when task generator fails", async () => {
		// Arrange
		const project = Project.create("Test Project", "Test Description", "owner-123")
		await projectRepository.save(project)
		const projectDescription = "Build an app"
		const errorMessage = "Task generator failed"

		const errorThrowingTaskGenerator: TaskGenerator = {
			generateTaskList: async () => {
				throw new Error(errorMessage)
			},
		}
		const errorUseCase = new PlanTasks(projectDetailsService, taskRepository, errorThrowingTaskGenerator)

		// Act & Assert
		await expect(errorUseCase.execute(project.id, projectDescription)).rejects.toThrow(errorMessage)
	})

	it("should throw an error when task repository save fails", async () => {
		// Arrange
		const project = Project.create("Test Project", "Test Description", "owner-123")
		await projectRepository.save(project)
		const projectDescription = "Build an app"
		const generatedTasks = [Task.create("Product Owner", project.id, "Task 1", "Description 1")]
		;(taskGenerator as InMemoryTaskGenerator).setDefault(generatedTasks)

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
		const errorUseCase = new PlanTasks(projectDetailsService, errorThrowingTaskRepository, taskGenerator)

		// Act & Assert
		await expect(errorUseCase.execute(project.id, projectDescription)).rejects.toThrow(errorMessage)
	})

	it("should save all tasks even if some fail (partial failure)", async () => {
		// Arrange
		const project = Project.create("Test Project", "Test Description", "owner-123")
		await projectRepository.save(project)
		const projectDescription = "Build an app"
		const generatedTasks = [
			Task.create("Product Owner", project.id, "Task 1", "Description 1"),
			Task.create("Product Owner", project.id, "Task 2", "Description 2"),
			Task.create("Product Owner", project.id, "Task 3", "Description 3"),
		]
		;(taskGenerator as InMemoryTaskGenerator).setDefault(generatedTasks)

		let saveCount = 0
		const partialFailureRepository: TaskRepository = {
			save: async (task: Task) => {
				saveCount++
				if (saveCount === 2) {
					throw new Error("Save failed for task 2")
				}
				return taskRepository.save(task)
			},
			get: async () => {
				throw new Error("Should not be called")
			},
			getAll: async () => {
				throw new Error("Should not be called")
			},
		}
		const partialFailureUseCase = new PlanTasks(
			projectDetailsService,
			partialFailureRepository,
			taskGenerator,
		)

		// Act & Assert
		await expect(partialFailureUseCase.execute(project.id, projectDescription)).rejects.toThrow(
			"Save failed for task 2",
		)
	})

	it("should create tasks with correct properties", async () => {
		// Arrange
		const project = Project.create("Test Project", "Test Description", "owner-123")
		await projectRepository.save(project)
		const projectDescription = "Build a shopping app"
		const generatedTasks = [
			Task.create("Product Owner", project.id, "Design UI", "Create user interface designs"),
			Task.create("Product Owner", project.id, "Implement Backend", "Build the API"),
		]
		;(taskGenerator as InMemoryTaskGenerator).setDefault(generatedTasks)

		// Act
		const result = await planTasksUseCase.execute(project.id, projectDescription)

		// Assert
		expect(result).toHaveLength(2)
		expect(result[0].title).toBe("Design UI")
		expect(result[0].description).toBe("Create user interface designs")
		expect(result[1].title).toBe("Implement Backend")
		expect(result[1].description).toBe("Build the API")
		expect(result.every((t) => t.projectId === project.id)).toBe(true)
		expect(result.every((t) => t.status === TaskStatus.TODO)).toBe(true)
	})

	it("should throw an error when project repository returns null", async () => {
		// Arrange
		const projectId = "project-123"
		const projectDescription = "Build an app"
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
		const nullUseCase = new PlanTasks(nullProjectDetailsService, taskRepository, taskGenerator)

		// Act & Assert
		// This covers the if (!project) branch on line 14-15 of project-details-service.ts
		await expect(nullUseCase.execute(projectId, projectDescription)).rejects.toThrow("Project not found")
	})
})
