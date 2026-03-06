import { describe, it, expect, beforeEach, afterEach } from "@rstest/core"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb"
import { DynamoDBTaskRepository } from "@infra/repositories/task-repository/task-repository"
import { Task } from "@domain/task/task"
import { TaskStatus, ActivityType } from "@jigjoy-ai/task-contracts"

describe("DynamoDB Task Repository", () => {
	let repository: DynamoDBTaskRepository
	let ddbDocClient: DynamoDBDocumentClient
	const testTaskIds: string[] = []

	const client = new DynamoDBClient({
		region: process.env.AWS_REGION,
		profile: process.env.AWS_PROFILE,
	})

	beforeEach(() => {
		ddbDocClient = DynamoDBDocumentClient.from(client)
		repository = new DynamoDBTaskRepository()
	})

	afterEach(async () => {
		// Clean up test data from DynamoDB
		const tableName = process.env.TASK_TABLE
		if (!tableName) return

		for (const id of testTaskIds) {
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
		testTaskIds.length = 0
	})

	it("should save a task to DynamoDB", async () => {
		const task = Task.create("user-123", "project-456", "Test Task", "Test Description")
		testTaskIds.push(task.id)

		const saved = await repository.save(task)

		expect(saved).toBeDefined()
		expect(saved.id).toEqual(task.id)
		expect(saved.title).toEqual(task.title)
		expect(saved.description).toEqual(task.description)
		expect(saved.projectId).toEqual(task.projectId)
		expect(saved.status).toEqual(TaskStatus.TODO)
		expect(saved.updated).toBeNull()
		expect(saved.getActivityLog().length).toBeGreaterThan(0)
	})

	it("should save a task with updated title to DynamoDB", async () => {
		const task = Task.create("user-123", "project-456", "Initial Task", "Description")
		task.updateTitle("user-123", "Updated Task")
		testTaskIds.push(task.id)

		const saved = await repository.save(task)

		expect(saved).toBeDefined()
		expect(saved.id).toEqual(task.id)
		expect(saved.title).toEqual("Updated Task")
		expect(saved.updated).not.toBeNull()
		expect(saved.getActivityLog().length).toBeGreaterThan(1)
	})

	it("should retrieve a previously saved task from DynamoDB", async () => {
		const task = Task.create("user-123", "project-456", "Test Task", "Test Description")
		testTaskIds.push(task.id)

		await repository.save(task)
		const retrieved = await repository.get(task.id)

		expect(retrieved).toBeDefined()
		expect(retrieved?.id).toEqual(task.id)
		expect(retrieved?.title).toEqual(task.title)
		expect(retrieved?.description).toEqual(task.description)
		expect(retrieved?.projectId).toEqual(task.projectId)
		expect(retrieved?.status).toEqual(task.status)
		expect(retrieved?.created).toEqual(task.created)

		const activityLog = retrieved?.getActivityLog() || []
		expect(activityLog.length).toBeGreaterThan(0)
		expect(activityLog[0].type).toEqual(ActivityType.TASK_CREATED)
	})

	it("should save and retrieve task with updated timestamp", async () => {
		const task = Task.create("user-123", "project-456", "Test Task", "Test Description")
		task.updateTitle("user-123", "Updated Title")
		testTaskIds.push(task.id)

		const saved = await repository.save(task)
		expect(saved.updated).not.toBeNull()

		const retrieved = await repository.get(task.id)
		expect(retrieved?.updated).not.toBeNull()
		expect(retrieved?.updated).toEqual(saved.updated)
	})

	it("should throw an error when retrieving a non-existent task", async () => {
		const nonExistentId = "non-existent-id"

		await expect(repository.get(nonExistentId)).rejects.toThrow("Task not found!")
	})

	it("should retrieve all tasks for a project", async () => {
		const projectId = "project-456"
		const task1 = Task.create("user-123", projectId, "Task 1", "Description 1")
		const task2 = Task.create("user-123", projectId, "Task 2", "Description 2")
		const task3 = Task.create("user-123", "project-789", "Task 3", "Description 3") // Different project

		testTaskIds.push(task1.id, task2.id, task3.id)

		await repository.save(task1)
		await repository.save(task2)
		await repository.save(task3)

		const retrieved = await repository.getAll(projectId)

		expect(retrieved).toBeDefined()
		expect(retrieved.length).toBeGreaterThanOrEqual(2)
		expect(retrieved.map((t) => t.id)).toContain(task1.id)
		expect(retrieved.map((t) => t.id)).toContain(task2.id)
		expect(retrieved.every((t) => t.projectId === projectId)).toBe(true)
	})

	it("should retrieve single task for a project using getAll", async () => {
		const projectId = "project-single"
		const task = Task.create("user-123", projectId, "Single Task", "Description")
		testTaskIds.push(task.id)

		await repository.save(task)

		const retrieved = await repository.getAll(projectId)

		expect(retrieved).toBeDefined()
		expect(retrieved.length).toBe(1)
		expect(retrieved[0].id).toBe(task.id)
		expect(retrieved[0].projectId).toBe(projectId)
	})

	it("should return empty array when no tasks exist for project", async () => {
		const projectId = "project-with-no-tasks"

		const retrieved = await repository.getAll(projectId)

		expect(retrieved).toBeDefined()
		expect(Array.isArray(retrieved)).toBe(true)
		expect(retrieved.length).toBe(0)
	})

	it("should save and retrieve a task with activities correctly", async () => {
		const task = Task.create("user-123", "project-456", "My Task", "My Description")
		task.updateTitle("user-123", "Updated Title")
		task.updateDescription("user-123", "Updated Description")
		task.leaveComment("user-123", "This is a comment")
		testTaskIds.push(task.id)

		await repository.save(task)
		const retrieved = await repository.get(task.id)

		expect(retrieved).toBeDefined()
		expect(retrieved?.id).toEqual(task.id)
		expect(retrieved?.title).toEqual("Updated Title")
		expect(retrieved?.description).toEqual("Updated Description")

		const activityLog = retrieved?.getActivityLog() || []
		expect(activityLog.length).toBeGreaterThanOrEqual(4)
		expect(activityLog.some((a) => a.type === ActivityType.TASK_CREATED)).toBe(true)
		expect(activityLog.some((a) => a.type === ActivityType.TITLE_UPDATED)).toBe(true)
		expect(activityLog.some((a) => a.type === ActivityType.DESCRIPTION_UPDATED)).toBe(true)
		expect(activityLog.some((a) => a.type === ActivityType.COMMENT_LEFT)).toBe(true)
	})

	it("should save and retrieve a task with work activities correctly", async () => {
		const task = Task.create("user-123", "project-456", "Work Task", "Description")
		task.startedWork("worker-123", "Starting work")
		testTaskIds.push(task.id)

		await repository.save(task)
		const retrieved = await repository.get(task.id)

		expect(retrieved).toBeDefined()
		expect(retrieved?.status).toEqual(TaskStatus.WORK_IN_PROGRESS)

		const activityLog = retrieved?.getActivityLog() || []
		expect(activityLog.some((a) => a.type === ActivityType.STARTED_WORK)).toBe(true)
	})

	it("should save and retrieve a task with finished work correctly", async () => {
		const task = Task.create("user-123", "project-456", "Work Task", "Description")
		task.startedWork("worker-123", "Starting work")
		task.finishedWork("worker-123", "Finished work")
		testTaskIds.push(task.id)

		await repository.save(task)
		const retrieved = await repository.get(task.id)

		expect(retrieved).toBeDefined()
		expect(retrieved?.status).toEqual(TaskStatus.DONE)

		const activityLog = retrieved?.getActivityLog() || []
		expect(activityLog.some((a) => a.type === ActivityType.FINISHED_WORK)).toBe(true)
		expect(activityLog.filter((a) => a.type === ActivityType.STARTED_WORK).length).toBe(0)
	})

	it("should save and retrieve task with all activity types through mapper", async () => {
		const task = Task.create("user-123", "project-456", "Test Task", "Test Description")
		task.updateTitle("user-123", "Updated Title")
		task.updateDescription("user-123", "Updated Description")
		task.leaveComment("user-123", "A comment")
		task.startedWork("worker-123", "Starting")
		task.finishedWork("worker-123", "Finished")
		testTaskIds.push(task.id)

		await repository.save(task)
		const retrieved = await repository.get(task.id)

		const activityLog = retrieved?.getActivityLog() || []
		expect(activityLog.some((a) => a.type === ActivityType.TASK_CREATED)).toBe(true)
		expect(activityLog.some((a) => a.type === ActivityType.TITLE_UPDATED)).toBe(true)
		expect(activityLog.some((a) => a.type === ActivityType.DESCRIPTION_UPDATED)).toBe(true)
		expect(activityLog.some((a) => a.type === ActivityType.COMMENT_LEFT)).toBe(true)
		expect(activityLog.some((a) => a.type === ActivityType.FINISHED_WORK)).toBe(true)
		// STARTED_WORK should be replaced by FINISHED_WORK
		expect(activityLog.filter((a) => a.type === ActivityType.STARTED_WORK).length).toBe(0)
	})

	it("should update an existing task when saving again", async () => {
		const task = Task.create("user-123", "project-456", "Initial Task", "Initial Description")
		testTaskIds.push(task.id)

		await repository.save(task)
		task.updateTitle("user-123", "Updated Title")
		task.updateDescription("user-123", "Updated Description")

		const updated = await repository.save(task)
		const retrieved = await repository.get(task.id)

		expect(updated.title).toEqual("Updated Title")
		expect(updated.description).toEqual("Updated Description")
		expect(retrieved?.title).toEqual("Updated Title")
		expect(retrieved?.description).toEqual("Updated Description")
	})

	it("should throw an error when DynamoDB get operation fails", async () => {
		// Temporarily set an empty table name to trigger a DynamoDB validation error
		const originalTableName = process.env.TASK_TABLE
		process.env.TASK_TABLE = ""

		try {
			await expect(repository.get("some-id")).rejects.toThrow()
		} finally {
			// Restore original table name
			if (originalTableName) {
				process.env.TASK_TABLE = originalTableName
			} else {
				delete process.env.TASK_TABLE
			}
		}
	})

	it("should throw an error when DynamoDB save operation fails", async () => {
		// Temporarily set an empty table name to trigger a DynamoDB validation error
		const originalTableName = process.env.TASK_TABLE
		process.env.TASK_TABLE = ""

		const task = Task.create("user-123", "project-456", "Test Task", "Test Description")
		// Note: Not tracking for cleanup since save will fail and nothing will be written to DynamoDB

		try {
			await expect(repository.save(task)).rejects.toThrow()
		} finally {
			// Restore original table name
			if (originalTableName) {
				process.env.TASK_TABLE = originalTableName
			} else {
				delete process.env.TASK_TABLE
			}
		}
	})

	it("should throw an error when DynamoDB getAll operation fails", async () => {
		// Temporarily set an empty table name to trigger a DynamoDB validation error
		const originalTableName = process.env.TASK_TABLE
		process.env.TASK_TABLE = ""

		try {
			await expect(repository.getAll("project-123")).rejects.toThrow()
		} finally {
			// Restore original table name
			if (originalTableName) {
				process.env.TASK_TABLE = originalTableName
			} else {
				delete process.env.TASK_TABLE
			}
		}
	})
})
