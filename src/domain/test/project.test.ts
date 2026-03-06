import { describe, it, expect } from "@rstest/core"
import { Project } from "@domain/project/project"
import { ProjectStatus } from "@domain/project/project-status"

describe("Project", () => {
	describe("create", () => {
		it("should create a new Project instance", () => {
			// Act
			const project = Project.create("Test Project", "Test Description", "owner-123")

			// Assert
			expect(project).toBeInstanceOf(Project)
			expect(project.id).toBeDefined()
			expect(typeof project.id).toBe("string")
		})

		it("should create Project with a valid UUID v4 id", () => {
			// Act
			const project = Project.create("Test Project", "Test Description", "owner-123")

			// Assert
			const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
			expect(project.id).toMatch(uuidV4Regex)
		})

		it("should create Project with correct initial values", () => {
			// Act
			const project = Project.create("Test Project", "Test Description", "owner-123")

			// Assert
			expect(project.name).toBe("Test Project")
			expect(project.description).toBe("Test Description")
			expect(project.ownerId).toBe("owner-123")
			expect(project.status).toBe(ProjectStatus.ACTIVE)
			expect(project.detailsUpdated).toBe(false)
			expect(project.updated).toBeNull()
			expect(project.created).toBeDefined()
			expect(typeof project.created).toBe("string")
		})

		it("should create Project with ISO string created timestamp", () => {
			// Act
			const project = Project.create("Test Project", "Test Description", "owner-123")

			// Assert
			const createdDate = new Date(project.created)
			expect(createdDate.getTime()).not.toBeNaN()
			expect(project.created).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
		})

		it("should create different Project instances with different IDs", () => {
			// Act
			const project1 = Project.create("Project 1", "Description 1", "owner-123")
			const project2 = Project.create("Project 2", "Description 2", "owner-123")
			const project3 = Project.create("Project 3", "Description 3", "owner-123")

			// Assert
			expect(project1.id).not.toBe(project2.id)
			expect(project2.id).not.toBe(project3.id)
			expect(project1.id).not.toBe(project3.id)
		})

		it("should throw error when owner is empty", () => {
			// Act & Assert
			expect(() => {
				Project.create("Test Project", "Test Description", "")
			}).toThrow("Owner cannot be empty")
		})

		it("should create a Project that is ready to use", () => {
			// Arrange
			const project = Project.create("Test Project", "Test Description", "owner-123")

			// Act
			project.setName("Updated Name")

			// Assert
			expect(project.name).toBe("Updated Name")
			expect(project.updated).not.toBeNull()
		})
	})

	describe("setName", () => {
		it("should update the name", () => {
			// Arrange
			const project = Project.create("Original Name", "Description", "owner-123")
			const originalUpdated = project.updated

			// Act
			project.setName("New Name")

			// Assert
			expect(project.name).toBe("New Name")
			expect(project.updated).not.toBeNull()
			expect(project.updated).not.toBe(originalUpdated)
		})

		it("should update the updated timestamp", () => {
			// Arrange
			const project = Project.create("Original Name", "Description", "owner-123")

			// Act
			project.setName("New Name")

			// Assert
			expect(project.updated).not.toBeNull()
			if (project.updated) {
				const updatedDate = new Date(project.updated)
				expect(updatedDate.getTime()).not.toBeNaN()
				expect(project.updated).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
			}
		})

		it("should not update if name is the same", () => {
			// Arrange
			const project = Project.create("Test Name", "Description", "owner-123")
			const originalUpdated = project.updated

			// Act
			project.setName("Test Name")

			// Assert
			expect(project.name).toBe("Test Name")
			expect(project.updated).toBe(originalUpdated)
		})

		it("should throw error when name is empty", () => {
			// Arrange
			const project = Project.create("Test Name", "Description", "owner-123")

			// Act & Assert
			expect(() => {
				project.setName("")
			}).toThrow("Name cannot be empty")
		})

		it("should allow updating name multiple times", () => {
			// Arrange
			const project = Project.create("Name 1", "Description", "owner-123")

			// Act
			project.setName("Name 2")
			project.setName("Name 3")

			// Assert
			expect(project.name).toBe("Name 3")
			expect(project.updated).not.toBeNull()
		})
	})

	describe("setDescription", () => {
		it("should update the description", () => {
			// Arrange
			const project = Project.create("Name", "Original Description", "owner-123")
			const originalUpdated = project.updated

			// Act
			project.setDescription("New Description")

			// Assert
			expect(project.description).toBe("New Description")
			expect(project.updated).not.toBeNull()
			expect(project.updated).not.toBe(originalUpdated)
		})

		it("should update the updated timestamp", () => {
			// Arrange
			const project = Project.create("Name", "Original Description", "owner-123")

			// Act
			project.setDescription("New Description")

			// Assert
			expect(project.updated).not.toBeNull()
			if (project.updated) {
				const updatedDate = new Date(project.updated)
				expect(updatedDate.getTime()).not.toBeNaN()
				expect(project.updated).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
			}
		})

		it("should not update if description is the same", () => {
			// Arrange
			const project = Project.create("Name", "Test Description", "owner-123")
			const originalUpdated = project.updated

			// Act
			project.setDescription("Test Description")

			// Assert
			expect(project.description).toBe("Test Description")
			expect(project.updated).toBe(originalUpdated)
		})

		it("should allow updating description multiple times", () => {
			// Arrange
			const project = Project.create("Name", "Description 1", "owner-123")

			// Act
			project.setDescription("Description 2")
			project.setDescription("Description 3")

			// Assert
			expect(project.description).toBe("Description 3")
			expect(project.updated).not.toBeNull()
		})

		it("should allow empty description", () => {
			// Arrange
			const project = Project.create("Name", "Original Description", "owner-123")

			// Act
			project.setDescription("")

			// Assert
			expect(project.description).toBe("")
			expect(project.updated).not.toBeNull()
		})
	})

	describe("setDetails", () => {
		it("should update both name and description", () => {
			// Arrange
			const project = Project.create("Original Name", "Original Description", "owner-123")

			// Act
			project.setDetails("New Name", "New Description")

			// Assert
			expect(project.name).toBe("New Name")
			expect(project.description).toBe("New Description")
		})

		it("should set detailsUpdated to true", () => {
			// Arrange
			const project = Project.create("Name", "Description", "owner-123")
			expect(project.detailsUpdated).toBe(false)

			// Act
			project.setDetails("New Name", "New Description")

			// Assert
			expect(project.detailsUpdated).toBe(true)
		})

		it("should update the updated timestamp", () => {
			// Arrange
			const project = Project.create("Name", "Description", "owner-123")
			const originalUpdated = project.updated

			// Act
			project.setDetails("New Name", "New Description")

			// Assert
			expect(project.updated).not.toBeNull()
			expect(project.updated).not.toBe(originalUpdated)
			if (project.updated) {
				expect(project.updated).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
			}
		})

		it("should allow setting details multiple times", () => {
			// Arrange
			const project = Project.create("Name 1", "Description 1", "owner-123")

			// Act
			project.setDetails("Name 2", "Description 2")
			project.setDetails("Name 3", "Description 3")

			// Assert
			expect(project.name).toBe("Name 3")
			expect(project.description).toBe("Description 3")
			expect(project.detailsUpdated).toBe(true)
		})

		it("should set detailsUpdated to true even if values don't change", () => {
			// Arrange
			const project = Project.create("Name", "Description", "owner-123")

			// Act
			project.setDetails("Name", "Description")

			// Assert
			expect(project.detailsUpdated).toBe(true)
		})
	})

	describe("archive", () => {
		it("should change status to ARCHIVED", () => {
			// Arrange
			const project = Project.create("Name", "Description", "owner-123")
			expect(project.status).toBe(ProjectStatus.ACTIVE)

			// Act
			project.archive()

			// Assert
			expect(project.status).toBe(ProjectStatus.ARCHIVED)
		})

		it("should allow archiving an already archived project", () => {
			// Arrange
			const project = Project.create("Name", "Description", "owner-123")
			project.archive()

			// Act
			project.archive()

			// Assert
			expect(project.status).toBe(ProjectStatus.ARCHIVED)
		})

		it("should not affect other properties when archiving", () => {
			// Arrange
			const project = Project.create("Name", "Description", "owner-123")
			const originalId = project.id
			const originalName = project.name
			const originalDescription = project.description
			const originalOwnerId = project.ownerId

			// Act
			project.archive()

			// Assert
			expect(project.id).toBe(originalId)
			expect(project.name).toBe(originalName)
			expect(project.description).toBe(originalDescription)
			expect(project.ownerId).toBe(originalOwnerId)
			expect(project.status).toBe(ProjectStatus.ARCHIVED)
		})
	})

	describe("rehydrate", () => {
		it("should rehydrate Project with all provided data", () => {
			// Arrange
			const data = {
				id: "test-id-123",
				ownerId: "owner-456",
				name: "Rehydrated Project",
				description: "Rehydrated Description",
				created: "2024-01-01T00:00:00.000Z",
				updated: "2024-01-02T00:00:00.000Z",
				status: ProjectStatus.ACTIVE,
				detailsUpdated: true,
			}

			// Act
			const rehydrated = Project.rehydrate(data)

			// Assert
			expect(rehydrated.id).toBe(data.id)
			expect(rehydrated.ownerId).toBe(data.ownerId)
			expect(rehydrated.name).toBe(data.name)
			expect(rehydrated.description).toBe(data.description)
			expect(rehydrated.created).toBe(data.created)
			expect(rehydrated.updated).toBe(data.updated)
			expect(rehydrated.status).toBe(data.status)
			expect(rehydrated.detailsUpdated).toBe(data.detailsUpdated)
		})

		it("should rehydrate Project with null updated timestamp", () => {
			// Arrange
			const data = {
				id: "test-id-456",
				ownerId: "owner-789",
				name: "Project",
				description: "Description",
				created: "2024-01-01T00:00:00.000Z",
				updated: null,
				status: ProjectStatus.ACTIVE,
				detailsUpdated: false,
			}

			// Act
			const rehydrated = Project.rehydrate(data)

			// Assert
			expect(rehydrated.id).toBe(data.id)
			expect(rehydrated.updated).toBeNull()
			expect(rehydrated.status).toBe(ProjectStatus.ACTIVE)
			expect(rehydrated.detailsUpdated).toBe(false)
		})

		it("should rehydrate Project with ARCHIVED status", () => {
			// Arrange
			const data = {
				id: "test-id-789",
				ownerId: "owner-123",
				name: "Archived Project",
				description: "Description",
				created: "2024-01-01T00:00:00.000Z",
				updated: "2024-01-02T00:00:00.000Z",
				status: ProjectStatus.ARCHIVED,
				detailsUpdated: false,
			}

			// Act
			const rehydrated = Project.rehydrate(data)

			// Assert
			expect(rehydrated.status).toBe(ProjectStatus.ARCHIVED)
			expect(rehydrated.id).toBe(data.id)
			expect(rehydrated.name).toBe(data.name)
		})

		it("should rehydrate Project with detailsUpdated set to true", () => {
			// Arrange
			const data = {
				id: "test-id-abc",
				ownerId: "owner-456",
				name: "Project",
				description: "Description",
				created: "2024-01-01T00:00:00.000Z",
				updated: null,
				status: ProjectStatus.ACTIVE,
				detailsUpdated: true,
			}

			// Act
			const rehydrated = Project.rehydrate(data)

			// Assert
			expect(rehydrated.detailsUpdated).toBe(true)
			expect(rehydrated.id).toBe(data.id)
		})

		it("should create a rehydrated Project that can be modified", () => {
			// Arrange
			const data = {
				id: "test-id-xyz",
				ownerId: "owner-789",
				name: "Original Name",
				description: "Original Description",
				created: "2024-01-01T00:00:00.000Z",
				updated: null,
				status: ProjectStatus.ACTIVE,
				detailsUpdated: false,
			}
			const rehydrated = Project.rehydrate(data)

			// Act
			rehydrated.setName("Updated Name")
			rehydrated.archive()

			// Assert
			expect(rehydrated.name).toBe("Updated Name")
			expect(rehydrated.status).toBe(ProjectStatus.ARCHIVED)
			expect(rehydrated.updated).not.toBeNull()
		})

		it("should preserve all fields exactly as provided", () => {
			// Arrange
			const data = {
				id: "preserved-id",
				ownerId: "preserved-owner",
				name: "Preserved Name",
				description: "Preserved Description",
				created: "2023-12-31T23:59:59.999Z",
				updated: "2024-01-15T12:30:45.123Z",
				status: ProjectStatus.ARCHIVED,
				detailsUpdated: true,
			}

			// Act
			const rehydrated = Project.rehydrate(data)

			// Assert
			expect(rehydrated.id).toBe("preserved-id")
			expect(rehydrated.ownerId).toBe("preserved-owner")
			expect(rehydrated.name).toBe("Preserved Name")
			expect(rehydrated.description).toBe("Preserved Description")
			expect(rehydrated.created).toBe("2023-12-31T23:59:59.999Z")
			expect(rehydrated.updated).toBe("2024-01-15T12:30:45.123Z")
			expect(rehydrated.status).toBe(ProjectStatus.ARCHIVED)
			expect(rehydrated.detailsUpdated).toBe(true)
		})
	})
})
