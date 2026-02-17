import { describe, it, expect, beforeEach, afterEach } from "@rstest/core"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb"
import { DynamoDBProjectRepository } from "@infra/repositories/project-repository/project-repository"
import { Project } from "@domain/project/project"
import { ProjectStatus } from "@infra/repositories/records/project"

describe("DynamoDB Project Repository", () => {
	let repository: DynamoDBProjectRepository
	let ddbDocClient: DynamoDBDocumentClient
	const testProjectIds: string[] = []

	const client = new DynamoDBClient({
		region: process.env.AWS_REGION,
		profile: process.env.AWS_PROFILE,
	})

	beforeEach(() => {
		ddbDocClient = DynamoDBDocumentClient.from(client)
		repository = new DynamoDBProjectRepository()
	})

	afterEach(async () => {
		// Clean up test data from DynamoDB
		const tableName = process.env.PROJECT_TABLE
		if (!tableName) return

		for (const id of testProjectIds) {
			try {
				await ddbDocClient.send(
					new DeleteCommand({
						TableName: tableName,
						Key: {
							id: id,
						},
					}),
				)
			} catch (error) {
				console.error(`Failed to delete test data with id ${id}:`, error)
			}
		}
		testProjectIds.length = 0
	})

	it("should save a project to DynamoDB", async () => {
		const project = Project.create("Test Project", "Test Description", "owner-123")
		testProjectIds.push(project.id)

		const saved = await repository.save(project)

		expect(saved).toBeDefined()
		expect(saved.id).toEqual(project.id)
		expect(saved.name).toEqual(project.name)
		expect(saved.description).toEqual(project.description)
		expect(saved.ownerId).toEqual(project.ownerId)
		expect(saved.status).toEqual(ProjectStatus.ACTIVE)
		expect(saved.detailsUpdated).toBe(false)
		expect(saved.updated).toBeNull()
	})

	it("should save a project with updated details to DynamoDB", async () => {
		const project = Project.create("Initial Project", "Initial Description", "owner-123")
		project.setName("Updated Project")
		project.setDescription("Updated Description")
		testProjectIds.push(project.id)

		const saved = await repository.save(project)

		expect(saved).toBeDefined()
		expect(saved.id).toEqual(project.id)
		expect(saved.name).toEqual("Updated Project")
		expect(saved.description).toEqual("Updated Description")
		expect(saved.updated).not.toBeNull()
	})

	it("should retrieve a previously saved project from DynamoDB", async () => {
		const project = Project.create("Test Project", "Test Description", "owner-123")
		testProjectIds.push(project.id)

		await repository.save(project)
		const retrieved = await repository.get(project.id)

		expect(retrieved).toBeDefined()
		expect(retrieved.id).toEqual(project.id)
		expect(retrieved.name).toEqual(project.name)
		expect(retrieved.description).toEqual(project.description)
		expect(retrieved.ownerId).toEqual(project.ownerId)
		expect(retrieved.status).toEqual(project.status)
		expect(retrieved.detailsUpdated).toEqual(project.detailsUpdated)
		expect(retrieved.created).toEqual(project.created)
	})

	it("should throw an error when retrieving a non-existent project", async () => {
		const nonExistentId = "non-existent-id"

		await expect(repository.get(nonExistentId)).rejects.toThrow("Project not found!")
	})

	it("should retrieve all projects for an owner", async () => {
		const ownerId = "owner-123"
		const project1 = Project.create("Project 1", "Description 1", ownerId)
		const project2 = Project.create("Project 2", "Description 2", ownerId)
		const project3 = Project.create("Project 3", "Description 3", "owner-456") // Different owner

		testProjectIds.push(project1.id, project2.id, project3.id)

		await repository.save(project1)
		await repository.save(project2)
		await repository.save(project3)

		const retrieved = await repository.getAll(ownerId)

		expect(retrieved).toBeDefined()
		expect(retrieved.length).toBeGreaterThanOrEqual(2)
		expect(retrieved.map((p) => p.id)).toContain(project1.id)
		expect(retrieved.map((p) => p.id)).toContain(project2.id)
		expect(retrieved.every((p) => p.ownerId === ownerId)).toBe(true)
	})

	it("should return empty array when no projects exist for owner", async () => {
		const ownerId = "owner-with-no-projects"

		const retrieved = await repository.getAll(ownerId)

		expect(retrieved).toBeDefined()
		expect(Array.isArray(retrieved)).toBe(true)
		expect(retrieved.length).toBe(0)
	})

	it("should retrieve projects by status for an owner", async () => {
		const ownerId = "owner-123"
		const activeProject1 = Project.create("Active Project 1", "Description 1", ownerId)
		const activeProject2 = Project.create("Active Project 2", "Description 2", ownerId)
		const archivedProject = Project.create("Archived Project", "Description 3", ownerId)
		archivedProject.archive()

		testProjectIds.push(activeProject1.id, activeProject2.id, archivedProject.id)

		await repository.save(activeProject1)
		await repository.save(activeProject2)
		await repository.save(archivedProject)

		const activeProjects = await repository.getAllByStatus(ownerId, ProjectStatus.ACTIVE)
		const archivedProjects = await repository.getAllByStatus(ownerId, ProjectStatus.ARCHIVED)

		expect(activeProjects).toBeDefined()
		expect(activeProjects.length).toBeGreaterThanOrEqual(2)
		expect(activeProjects.map((p) => p.id)).toContain(activeProject1.id)
		expect(activeProjects.map((p) => p.id)).toContain(activeProject2.id)
		expect(activeProjects.every((p) => p.status === ProjectStatus.ACTIVE)).toBe(true)
		expect(activeProjects.every((p) => p.ownerId === ownerId)).toBe(true)

		expect(archivedProjects).toBeDefined()
		expect(archivedProjects.length).toBeGreaterThanOrEqual(1)
		expect(archivedProjects.map((p) => p.id)).toContain(archivedProject.id)
		expect(archivedProjects.every((p) => p.status === ProjectStatus.ARCHIVED)).toBe(true)
		expect(archivedProjects.every((p) => p.ownerId === ownerId)).toBe(true)
	})

	it("should save and retrieve a project with all properties correctly", async () => {
		const project = Project.create("My Project", "My Description", "owner-456")
		project.setDetails("Updated Name", "Updated Description")
		project.archive()
		testProjectIds.push(project.id)

		await repository.save(project)
		const retrieved = await repository.get(project.id)

		expect(retrieved).toBeDefined()
		expect(retrieved.id).toEqual(project.id)
		expect(retrieved.name).toEqual("Updated Name")
		expect(retrieved.description).toEqual("Updated Description")
		expect(retrieved.ownerId).toEqual("owner-456")
		expect(retrieved.status).toEqual(ProjectStatus.ARCHIVED)
		expect(retrieved.detailsUpdated).toBe(true)
		expect(retrieved.created).toEqual(project.created)
		expect(retrieved.updated).not.toBeNull()
	})

	it("should update an existing project when saving again", async () => {
		const project = Project.create("Initial Project", "Initial Description", "owner-123")
		testProjectIds.push(project.id)

		await repository.save(project)
		project.setName("Updated Name")
		project.setDescription("Updated Description")

		const updated = await repository.save(project)
		const retrieved = await repository.get(project.id)

		expect(updated.name).toEqual("Updated Name")
		expect(updated.description).toEqual("Updated Description")
		expect(retrieved.name).toEqual("Updated Name")
		expect(retrieved.description).toEqual("Updated Description")
	})

	it("should return empty array when no projects match status for owner", async () => {
		const ownerId = "owner-with-no-archived-projects"

		const archivedProjects = await repository.getAllByStatus(ownerId, ProjectStatus.ARCHIVED)

		expect(archivedProjects).toBeDefined()
		expect(Array.isArray(archivedProjects)).toBe(true)
		expect(archivedProjects.length).toBe(0)
	})

	it("should throw an error when DynamoDB get operation fails", async () => {
		// Temporarily set an empty table name to trigger a DynamoDB validation error
		const originalTableName = process.env.PROJECT_TABLE
		process.env.PROJECT_TABLE = ""

		try {
			await expect(repository.get("some-id")).rejects.toThrow()
		} finally {
			// Restore original table name
			if (originalTableName) {
				process.env.PROJECT_TABLE = originalTableName
			} else {
				delete process.env.PROJECT_TABLE
			}
		}
	})

	it("should throw an error when DynamoDB save operation fails", async () => {
		// Temporarily set an empty table name to trigger a DynamoDB validation error
		const originalTableName = process.env.PROJECT_TABLE
		process.env.PROJECT_TABLE = ""

		const project = Project.create("Test Project", "Test Description", "owner-123")
		// Note: Not tracking for cleanup since save will fail and nothing will be written to DynamoDB

		try {
			await expect(repository.save(project)).rejects.toThrow()
		} finally {
			// Restore original table name
			if (originalTableName) {
				process.env.PROJECT_TABLE = originalTableName
			} else {
				delete process.env.PROJECT_TABLE
			}
		}
	})

	it("should throw an error when DynamoDB getAll operation fails", async () => {
		// Temporarily set an empty table name to trigger a DynamoDB validation error
		const originalTableName = process.env.PROJECT_TABLE
		process.env.PROJECT_TABLE = ""

		try {
			await expect(repository.getAll("owner-123")).rejects.toThrow()
		} finally {
			// Restore original table name
			if (originalTableName) {
				process.env.PROJECT_TABLE = originalTableName
			} else {
				delete process.env.PROJECT_TABLE
			}
		}
	})

	it("should throw an error when DynamoDB getAllByStatus operation fails", async () => {
		// Temporarily set an empty table name to trigger a DynamoDB validation error
		const originalTableName = process.env.PROJECT_TABLE
		process.env.PROJECT_TABLE = ""

		try {
			await expect(repository.getAllByStatus("owner-123", ProjectStatus.ACTIVE)).rejects.toThrow()
		} finally {
			// Restore original table name
			if (originalTableName) {
				process.env.PROJECT_TABLE = originalTableName
			} else {
				delete process.env.PROJECT_TABLE
			}
		}
	})
})
