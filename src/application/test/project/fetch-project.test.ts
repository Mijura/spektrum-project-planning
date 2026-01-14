import { describe, it, expect, beforeEach } from "@rstest/core"
import { FetchProject } from "@app/use-cases/project/fetch-project"
import { InMemoryProjectRepository } from "@app/test/mocks/in-memory-project-repository"
import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { Project } from "@domain/project/project"
import { ProjectStatus } from "@domain/project/project-status"

describe("Fetch Project", () => {
	let fetchProjectUseCase: FetchProject
	let repository: ProjectRepository

	beforeEach(() => {
		repository = new InMemoryProjectRepository()
		fetchProjectUseCase = new FetchProject(repository)
	})

	it("should successfully fetch a project by ID", async () => {
		// Arrange
		const project = Project.create("Test Project", "Test Description", "owner-123")
		await repository.save(project)

		// Act
		const result = await fetchProjectUseCase.execute(project.id)

		// Assert
		expect(result).toBeDefined()
		expect(result.id).toBe(project.id)
		expect(result.name).toBe(project.name)
		expect(result.description).toBe(project.description)
		expect(result.ownerId).toBe(project.ownerId)
		expect(result.status).toBe(project.status)
	})

	it("should return all project properties correctly", async () => {
		// Arrange
		const project = Project.create("My Project", "My Description", "owner-456")
		project.setName("Updated Name")
		project.setDescription("Updated Description")
		project.archive()
		await repository.save(project)

		// Act
		const result = await fetchProjectUseCase.execute(project.id)

		// Assert
		expect(result.id).toBe(project.id)
		expect(result.name).toBe("Updated Name")
		expect(result.description).toBe("Updated Description")
		expect(result.ownerId).toBe("owner-456")
		expect(result.status).toBe(ProjectStatus.ARCHIVED)
		expect(result.created).toBe(project.created)
		expect(result.updated).toBe(project.updated)
		expect(result.detailsUpdated).toBe(project.detailsUpdated)
	})

	it("should throw an error when project does not exist", async () => {
		// Arrange
		const nonExistentId = "non-existent-id"

		// Act & Assert
		await expect(fetchProjectUseCase.execute(nonExistentId)).rejects.toThrow(`Project not found: ${nonExistentId}`)
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
		const errorUseCase = new FetchProject(errorThrowingRepository)

		// Act & Assert
		await expect(errorUseCase.execute("some-id")).rejects.toThrow(errorMessage)
	})

	it("should fetch an archived project", async () => {
		// Arrange
		const project = Project.create("Archived Project", "Description", "owner-789")
		project.archive()
		await repository.save(project)

		// Act
		const result = await fetchProjectUseCase.execute(project.id)

		// Assert
		expect(result.status).toBe(ProjectStatus.ARCHIVED)
		expect(result.id).toBe(project.id)
	})

	it("should fetch an active project", async () => {
		// Arrange
		const project = Project.create("Active Project", "Description", "owner-123")
		await repository.save(project)

		// Act
		const result = await fetchProjectUseCase.execute(project.id)

		// Assert
		expect(result.status).toBe(ProjectStatus.ACTIVE)
		expect(result.id).toBe(project.id)
	})

	it("should return the same project instance as stored in repository", async () => {
		// Arrange
		const project = Project.create("Test Project", "Test Description", "owner-123")
		await repository.save(project)

		// Act
		const result = await fetchProjectUseCase.execute(project.id)
		const directFetch = await repository.get(project.id)

		// Assert
		expect(result).toBe(directFetch)
		expect(result.id).toBe(directFetch.id)
	})
})
