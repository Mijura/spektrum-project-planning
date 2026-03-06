import { describe, it, expect, beforeEach } from "@rstest/core"
import { ArchiveProject } from "@app/use-cases/project/archive-project"
import { InMemoryProjectRepository } from "@app/test/mocks/in-memory-project-repository"
import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { Project } from "@domain/project/project"
import { ProjectStatus } from "@domain/project/project-status"

describe("Archive Project", () => {
	let archiveProjectUseCase: ArchiveProject
	let repository: ProjectRepository

	beforeEach(() => {
		repository = new InMemoryProjectRepository()
		archiveProjectUseCase = new ArchiveProject(repository)
	})

	it("should successfully archive a project", async () => {
		// Arrange
		const project = Project.create("Test Project", "Test Description", "owner-123")
		expect(project.status).toBe(ProjectStatus.ACTIVE)
		await repository.save(project)

		// Act
		const result = await archiveProjectUseCase.execute(project.id)

		// Assert
		expect(result).toBeDefined()
		expect(result.id).toBe(project.id)
		expect(result.status).toBe(ProjectStatus.ARCHIVED)
		expect(result.name).toBe(project.name)
		expect(result.description).toBe(project.description)
		expect(result.ownerId).toBe(project.ownerId)
	})

	it("should throw an error when project does not exist", async () => {
		// Arrange
		const nonExistentId = "non-existent-id"

		// Act & Assert
		await expect(archiveProjectUseCase.execute(nonExistentId)).rejects.toThrow(
			`Project not found: ${nonExistentId}`,
		)
	})

	it("should preserve all project properties when archiving", async () => {
		// Arrange
		const project = Project.create("My Project", "My Description", "owner-456")
		project.setName("Updated Name")
		project.setDescription("Updated Description")
		const originalId = project.id
		const originalOwnerId = project.ownerId
		const originalCreated = project.created
		const originalUpdated = project.updated
		await repository.save(project)

		// Act
		const result = await archiveProjectUseCase.execute(project.id)

		// Assert
		expect(result.id).toBe(originalId)
		expect(result.ownerId).toBe(originalOwnerId)
		expect(result.name).toBe("Updated Name")
		expect(result.description).toBe("Updated Description")
		expect(result.created).toBe(originalCreated)
		expect(result.updated).toBe(originalUpdated)
		expect(result.status).toBe(ProjectStatus.ARCHIVED)
	})

	it("should throw an error when repository get fails", async () => {
		// Arrange
		const errorMessage = "Repository connection failed"
		const errorThrowingRepository: ProjectRepository = {
			save: async () => {
				throw new Error("Should not be called")
			},
			get: async () => {
				throw new Error(errorMessage)
			},
			getAll: async () => {
				throw new Error("Should not be called")
			},
			getAllByStatus: async () => {
				throw new Error("Should not be called")
			},
		}
		const errorUseCase = new ArchiveProject(errorThrowingRepository)

		// Act & Assert
		await expect(errorUseCase.execute("some-id")).rejects.toThrow(errorMessage)
	})

	it("should throw an error when repository save fails", async () => {
		// Arrange
		const project = Project.create("Test Project", "Test Description", "owner-123")
		await repository.save(project)

		const errorMessage = "Repository save failed"
		const errorThrowingRepository: ProjectRepository = {
			save: async () => {
				throw new Error(errorMessage)
			},
			get: async (projectId: string) => {
				return repository.get(projectId)
			},
			getAll: async () => {
				throw new Error("Should not be called")
			},
			getAllByStatus: async () => {
				throw new Error("Should not be called")
			},
		}
		const errorUseCase = new ArchiveProject(errorThrowingRepository)

		// Act & Assert
		await expect(errorUseCase.execute(project.id)).rejects.toThrow(errorMessage)
	})

	it("should archive a project that is already archived", async () => {
		// Arrange
		const project = Project.create("Test Project", "Test Description", "owner-123")
		project.archive()
		expect(project.status).toBe(ProjectStatus.ARCHIVED)
		await repository.save(project)

		// Act
		const result = await archiveProjectUseCase.execute(project.id)

		// Assert
		expect(result.status).toBe(ProjectStatus.ARCHIVED)
	})

	it("should return the archived project from repository", async () => {
		// Arrange
		const project = Project.create("Test Project", "Test Description", "owner-123")
		await repository.save(project)

		// Act
		const result = await archiveProjectUseCase.execute(project.id)

		// Assert
		const savedProject = await repository.get(project.id)
		expect(savedProject.status).toBe(ProjectStatus.ARCHIVED)
		expect(result).toBe(savedProject)
	})
})
