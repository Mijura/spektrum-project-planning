import { describe, it, expect, beforeEach } from "@rstest/core"
import { FetchProjects } from "@app/use-cases/project/fetch-projects"
import { InMemoryProjectRepository } from "@app/test/mocks/in-memory-project-repository"
import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { Project } from "@domain/project/project"
import { ProjectStatus } from "@domain/project/project-status"

describe("Fetch Projects", () => {
	let fetchProjectsUseCase: FetchProjects
	let repository: ProjectRepository

	beforeEach(() => {
		repository = new InMemoryProjectRepository()
		fetchProjectsUseCase = new FetchProjects(repository)
	})

	it("should successfully fetch active projects for an owner", async () => {
		// Arrange
		const ownerId = "owner-123"
		const project1 = Project.create("Project 1", "Description 1", ownerId)
		const project2 = Project.create("Project 2", "Description 2", ownerId)
		await repository.save(project1)
		await repository.save(project2)

		// Act
		const result = await fetchProjectsUseCase.execute(ownerId)

		// Assert
		expect(result).toBeDefined()
		expect(result).toHaveLength(2)
		expect(result.map((p) => p.id)).toContain(project1.id)
		expect(result.map((p) => p.id)).toContain(project2.id)
		expect(result.every((p) => p.status === ProjectStatus.ACTIVE)).toBe(true)
		expect(result.every((p) => p.ownerId === ownerId)).toBe(true)
	})

	it("should return empty array when no active projects exist for owner", async () => {
		// Arrange
		const ownerId = "owner-456"

		// Act
		const result = await fetchProjectsUseCase.execute(ownerId)

		// Assert
		expect(result).toBeDefined()
		expect(result).toHaveLength(0)
		expect(Array.isArray(result)).toBe(true)
	})

	it("should only return active projects, not archived ones", async () => {
		// Arrange
		const ownerId = "owner-789"
		const activeProject1 = Project.create("Active Project 1", "Description", ownerId)
		const activeProject2 = Project.create("Active Project 2", "Description", ownerId)
		const archivedProject = Project.create("Archived Project", "Description", ownerId)
		archivedProject.archive()

		await repository.save(activeProject1)
		await repository.save(activeProject2)
		await repository.save(archivedProject)

		// Act
		const result = await fetchProjectsUseCase.execute(ownerId)

		// Assert
		expect(result).toHaveLength(2)
		expect(result.map((p) => p.id)).toContain(activeProject1.id)
		expect(result.map((p) => p.id)).toContain(activeProject2.id)
		expect(result.map((p) => p.id)).not.toContain(archivedProject.id)
		expect(result.every((p) => p.status === ProjectStatus.ACTIVE)).toBe(true)
	})

	it("should only return projects for the specified owner", async () => {
		// Arrange
		const owner1 = "owner-111"
		const owner2 = "owner-222"
		const project1 = Project.create("Project 1", "Description", owner1)
		const project2 = Project.create("Project 2", "Description", owner1)
		const project3 = Project.create("Project 3", "Description", owner2)

		await repository.save(project1)
		await repository.save(project2)
		await repository.save(project3)

		// Act
		const result = await fetchProjectsUseCase.execute(owner1)

		// Assert
		expect(result).toHaveLength(2)
		expect(result.map((p) => p.id)).toContain(project1.id)
		expect(result.map((p) => p.id)).toContain(project2.id)
		expect(result.map((p) => p.id)).not.toContain(project3.id)
		expect(result.every((p) => p.ownerId === owner1)).toBe(true)
	})

	it("should return multiple active projects for the same owner", async () => {
		// Arrange
		const ownerId = "owner-333"
		const projects = [
			Project.create("Project A", "Description A", ownerId),
			Project.create("Project B", "Description B", ownerId),
			Project.create("Project C", "Description C", ownerId),
			Project.create("Project D", "Description D", ownerId),
		]

		for (const project of projects) {
			await repository.save(project)
		}

		// Act
		const result = await fetchProjectsUseCase.execute(ownerId)

		// Assert
		expect(result).toHaveLength(4)
		expect(result.map((p) => p.id).sort()).toEqual(projects.map((p) => p.id).sort())
		expect(result.every((p) => p.status === ProjectStatus.ACTIVE)).toBe(true)
		expect(result.every((p) => p.ownerId === ownerId)).toBe(true)
	})

	it("should return empty array when owner has only archived projects", async () => {
		// Arrange
		const ownerId = "owner-444"
		const archivedProject1 = Project.create("Archived 1", "Description", ownerId)
		const archivedProject2 = Project.create("Archived 2", "Description", ownerId)
		archivedProject1.archive()
		archivedProject2.archive()

		await repository.save(archivedProject1)
		await repository.save(archivedProject2)

		// Act
		const result = await fetchProjectsUseCase.execute(ownerId)

		// Assert
		expect(result).toBeDefined()
		expect(result).toHaveLength(0)
	})

	it("should throw an error when repository getAllByStatus fails", async () => {
		// Arrange
		const ownerId = "owner-555"
		const errorMessage = "Repository connection failed"
		const errorThrowingRepository: ProjectRepository = {
			save: async () => {
				throw new Error("Should not be called")
			},
			get: async () => {
				throw new Error("Should not be called")
			},
			getAll: async () => {
				throw new Error("Should not be called")
			},
			getAllByStatus: async () => {
				throw new Error(errorMessage)
			},
		}
		const errorUseCase = new FetchProjects(errorThrowingRepository)

		// Act & Assert
		await expect(errorUseCase.execute(ownerId)).rejects.toThrow(errorMessage)
	})

	it("should return projects with all properties correctly", async () => {
		// Arrange
		const ownerId = "owner-666"
		const project = Project.create("Test Project", "Test Description", ownerId)
		project.setName("Updated Name")
		project.setDescription("Updated Description")
		await repository.save(project)

		// Act
		const result = await fetchProjectsUseCase.execute(ownerId)

		// Assert
		expect(result).toHaveLength(1)
		const fetchedProject = result[0]
		expect(fetchedProject.id).toBe(project.id)
		expect(fetchedProject.name).toBe("Updated Name")
		expect(fetchedProject.description).toBe("Updated Description")
		expect(fetchedProject.ownerId).toBe(ownerId)
		expect(fetchedProject.status).toBe(ProjectStatus.ACTIVE)
		expect(fetchedProject.created).toBe(project.created)
		expect(fetchedProject.updated).toBe(project.updated)
	})

	it("should handle mixed active and archived projects correctly", async () => {
		// Arrange
		const ownerId = "owner-777"
		const active1 = Project.create("Active 1", "Description", ownerId)
		const active2 = Project.create("Active 2", "Description", ownerId)
		const archived1 = Project.create("Archived 1", "Description", ownerId)
		const archived2 = Project.create("Archived 2", "Description", ownerId)
		archived1.archive()
		archived2.archive()

		await repository.save(active1)
		await repository.save(active2)
		await repository.save(archived1)
		await repository.save(archived2)

		// Act
		const result = await fetchProjectsUseCase.execute(ownerId)

		// Assert
		expect(result).toHaveLength(2)
		expect(result.map((p) => p.id)).toContain(active1.id)
		expect(result.map((p) => p.id)).toContain(active2.id)
		expect(result.map((p) => p.id)).not.toContain(archived1.id)
		expect(result.map((p) => p.id)).not.toContain(archived2.id)
		expect(result.every((p) => p.status === ProjectStatus.ACTIVE)).toBe(true)
	})
})
