import { describe, it, expect, beforeEach } from "@rstest/core"
import { UpdateProjectDetails } from "@app/use-cases/project/update-details"
import { InMemoryProjectRepository } from "@app/test/mocks/in-memory-project-repository"
import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { Project } from "@domain/project/project"
import { ProjectStatus } from "@domain/project/project-status"

describe("Update Project Details", () => {
	let updateProjectDetailsUseCase: UpdateProjectDetails
	let repository: ProjectRepository

	beforeEach(() => {
		repository = new InMemoryProjectRepository()
		updateProjectDetailsUseCase = new UpdateProjectDetails(repository)
	})

	it("should successfully update project name and description", async () => {
		// Arrange
		const project = Project.create("Original Name", "Original Description", "owner-123")
		await repository.save(project)
		const newName = "Updated Name"
		const newDescription = "Updated Description"

		// Act
		const result = await updateProjectDetailsUseCase.execute(project.id, newName, newDescription)

		// Assert
		expect(result).toBeDefined()
		expect(result.id).toBe(project.id)
		expect(result.name).toBe(newName)
		expect(result.description).toBe(newDescription)
		expect(result.ownerId).toBe(project.ownerId)
		expect(result.status).toBe(project.status)
	})

	it("should update the project's updated timestamp", async () => {
		// Arrange
		const project = Project.create("Original Name", "Original Description", "owner-123")
		await repository.save(project)
		const originalUpdated = project.updated

		// Act
		const result = await updateProjectDetailsUseCase.execute(project.id, "New Name", "New Description")

		// Assert
		expect(result.updated).not.toBeNull()
		expect(result.updated).not.toBe(originalUpdated)
	})

	it("should preserve all other project properties", async () => {
		// Arrange
		const project = Project.create("Original Name", "Original Description", "owner-456")
		project.archive()
		const originalId = project.id
		const originalOwnerId = project.ownerId
		const originalCreated = project.created
		const originalStatus = project.status
		await repository.save(project)

		// Act
		const result = await updateProjectDetailsUseCase.execute(project.id, "New Name", "New Description")

		// Assert
		expect(result.id).toBe(originalId)
		expect(result.ownerId).toBe(originalOwnerId)
		expect(result.created).toBe(originalCreated)
		expect(result.status).toBe(originalStatus)
		expect(result.name).toBe("New Name")
		expect(result.description).toBe("New Description")
	})

	it("should allow updating to empty description", async () => {
		// Arrange
		const project = Project.create("Project Name", "Original Description", "owner-123")
		await repository.save(project)

		// Act
		const result = await updateProjectDetailsUseCase.execute(project.id, "New Name", "")

		// Assert
		expect(result.name).toBe("New Name")
		expect(result.description).toBe("")
	})

	it("should persist changes to repository", async () => {
		// Arrange
		const project = Project.create("Original Name", "Original Description", "owner-123")
		await repository.save(project)

		// Act
		const result = await updateProjectDetailsUseCase.execute(project.id, "New Name", "New Description")

		// Assert
		const savedProject = await repository.get(project.id)
		expect(savedProject.name).toBe("New Name")
		expect(savedProject.description).toBe("New Description")
		expect(savedProject.id).toBe(result.id)
	})

	it("should update both name and description in a single call", async () => {
		// Arrange
		const project = Project.create("Name 1", "Description 1", "owner-123")
		await repository.save(project)

		// Act
		const result = await updateProjectDetailsUseCase.execute(project.id, "Name 2", "Description 2")

		// Assert
		expect(result.name).toBe("Name 2")
		expect(result.description).toBe("Description 2")
		expect(result.name).not.toBe("Name 1")
		expect(result.description).not.toBe("Description 1")
	})

	it("should handle updating archived projects", async () => {
		// Arrange
		const project = Project.create("Original Name", "Original Description", "owner-123")
		project.archive()
		await repository.save(project)

		// Act
		const result = await updateProjectDetailsUseCase.execute(project.id, "New Name", "New Description")

		// Assert
		expect(result.name).toBe("New Name")
		expect(result.description).toBe("New Description")
		expect(result.status).toBe(ProjectStatus.ARCHIVED)
	})

	it("should throw an error when project is null", async () => {
		// Arrange
		const nullReturningRepository: ProjectRepository = {
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
		const nullUseCase = new UpdateProjectDetails(nullReturningRepository)

		// Act & Assert
		// This covers the if (!project) branch on line 12-13
		await expect(nullUseCase.execute("some-id", "New Name", "New Description")).rejects.toThrow(
			"Project not found.",
		)
	})

	it("should throw an error when project does not exist (repository throws)", async () => {
		// Arrange
		const nonExistentId = "non-existent-id"
		const newName = "New Name"
		const newDescription = "New Description"

		// Act & Assert
		// InMemoryProjectRepository.get() throws an error when project doesn't exist
		await expect(
			updateProjectDetailsUseCase.execute(nonExistentId, newName, newDescription),
		).rejects.toThrow(`Project not found: ${nonExistentId}`)
	})
})
