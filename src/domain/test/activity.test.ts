import { describe, it, expect } from "@rstest/core"
import { Activity } from "@domain/task/activity/activity"
import { ActivityType, ActivityMetadata } from "@jigjoy-io/task-contracts"

describe("Activity", () => {
	describe("rehydrate", () => {
		it("should rehydrate Activity with all provided data", () => {
			// Arrange
			const data = {
				id: "test-activity-id-123",
				type: ActivityType.TASK_CREATED,
				projectId: "project-456",
				taskId: "task-789",
				userId: "user-123",
				metadata: {
					message: "user-123 created task",
					title: "Test Task",
					description: "Test Description",
				} as ActivityMetadata,
				occurredAt: "2024-01-01T00:00:00.000Z",
			}

			// Act
			const rehydrated = Activity.rehydrate(data)

			// Assert
			expect(rehydrated).toBeInstanceOf(Activity)
			expect(rehydrated.id).toBe(data.id)
			expect(rehydrated.type).toBe(data.type)
			expect(rehydrated.projectId).toBe(data.projectId)
			expect(rehydrated.taskId).toBe(data.taskId)
			expect(rehydrated.userId).toBe(data.userId)
			expect(rehydrated.metadata).toBe(data.metadata)
			expect(rehydrated.occurredAt).toBe(data.occurredAt)
		})

		it("should rehydrate Activity with COMMENT_LEFT type", () => {
			// Arrange
			const data = {
				id: "test-activity-id-456",
				type: ActivityType.COMMENT_LEFT,
				projectId: "project-123",
				taskId: "task-456",
				userId: "user-789",
				metadata: {
					commentText: "This is a comment",
					authorId: "user-789",
				} as ActivityMetadata,
				occurredAt: "2024-01-02T00:00:00.000Z",
			}

			// Act
			const rehydrated = Activity.rehydrate(data)

			// Assert
			expect(rehydrated.type).toBe(ActivityType.COMMENT_LEFT)
			expect(rehydrated.id).toBe(data.id)
			expect(rehydrated.projectId).toBe(data.projectId)
			expect(rehydrated.taskId).toBe(data.taskId)
			expect(rehydrated.userId).toBe(data.userId)
		})

		it("should rehydrate Activity with TITLE_UPDATED type", () => {
			// Arrange
			const data = {
				id: "test-activity-id-789",
				type: ActivityType.TITLE_UPDATED,
				projectId: "project-456",
				taskId: "task-123",
				userId: "user-456",
				metadata: {
					message: 'user-456 changed title to "New Title"',
					oldTitle: "Old Title",
					newTitle: "New Title",
				} as ActivityMetadata,
				occurredAt: "2024-01-03T00:00:00.000Z",
			}

			// Act
			const rehydrated = Activity.rehydrate(data)

			// Assert
			expect(rehydrated.type).toBe(ActivityType.TITLE_UPDATED)
			expect(rehydrated.id).toBe(data.id)
			expect(rehydrated.metadata).toBe(data.metadata)
		})

		it("should rehydrate Activity with DESCRIPTION_UPDATED type", () => {
			// Arrange
			const data = {
				id: "test-activity-id-abc",
				type: ActivityType.DESCRIPTION_UPDATED,
				projectId: "project-789",
				taskId: "task-456",
				userId: "user-123",
				metadata: {
					message: "user-123 updated description",
					oldDescription: "Old Description",
					newDescription: "New Description",
				} as ActivityMetadata,
				occurredAt: "2024-01-04T00:00:00.000Z",
			}

			// Act
			const rehydrated = Activity.rehydrate(data)

			// Assert
			expect(rehydrated.type).toBe(ActivityType.DESCRIPTION_UPDATED)
			expect(rehydrated.id).toBe(data.id)
			expect(rehydrated.metadata).toBe(data.metadata)
		})

		it("should rehydrate Activity with STARTED_WORK type", () => {
			// Arrange
			const data = {
				id: "test-activity-id-def",
				type: ActivityType.STARTED_WORK,
				projectId: "project-123",
				taskId: "task-789",
				userId: "worker-123",
				metadata: {
					workerId: "worker-123",
					message: "Starting work",
				} as ActivityMetadata,
				occurredAt: "2024-01-05T00:00:00.000Z",
			}

			// Act
			const rehydrated = Activity.rehydrate(data)

			// Assert
			expect(rehydrated.type).toBe(ActivityType.STARTED_WORK)
			expect(rehydrated.id).toBe(data.id)
			expect(rehydrated.userId).toBe("worker-123")
			expect(rehydrated.metadata).toBe(data.metadata)
		})

		it("should rehydrate Activity with FINISHED_WORK type", () => {
			// Arrange
			const data = {
				id: "test-activity-id-ghi",
				type: ActivityType.FINISHED_WORK,
				projectId: "project-456",
				taskId: "task-123",
				userId: "worker-456",
				metadata: {
					workerId: "worker-456",
					message: "Finished work",
				} as ActivityMetadata,
				occurredAt: "2024-01-06T00:00:00.000Z",
			}

			// Act
			const rehydrated = Activity.rehydrate(data)

			// Assert
			expect(rehydrated.type).toBe(ActivityType.FINISHED_WORK)
			expect(rehydrated.id).toBe(data.id)
			expect(rehydrated.userId).toBe("worker-456")
			expect(rehydrated.metadata).toBe(data.metadata)
		})

		it("should preserve all fields exactly as provided", () => {
			// Arrange
			const data = {
				id: "preserved-id",
				type: ActivityType.TASK_CREATED,
				projectId: "preserved-project",
				taskId: "preserved-task",
				userId: "preserved-user",
				metadata: {
					message: "Preserved message",
					title: "Preserved Title",
					description: "Preserved Description",
				} as ActivityMetadata,
				occurredAt: "2023-12-31T23:59:59.999Z",
			}

			// Act
			const rehydrated = Activity.rehydrate(data)

			// Assert
			expect(rehydrated.id).toBe("preserved-id")
			expect(rehydrated.type).toBe(ActivityType.TASK_CREATED)
			expect(rehydrated.projectId).toBe("preserved-project")
			expect(rehydrated.taskId).toBe("preserved-task")
			expect(rehydrated.userId).toBe("preserved-user")
			expect(rehydrated.occurredAt).toBe("2023-12-31T23:59:59.999Z")
			expect(rehydrated.metadata).toBe(data.metadata)
		})

		it("should create a rehydrated Activity with correct structure", () => {
			// Arrange
			const data = {
				id: "test-id",
				type: ActivityType.COMMENT_LEFT,
				projectId: "project-123",
				taskId: "task-456",
				userId: "user-789",
				metadata: {
					commentText: "Test comment",
					authorId: "user-789",
				} as ActivityMetadata,
				occurredAt: "2024-01-01T00:00:00.000Z",
			}

			// Act
			const rehydrated = Activity.rehydrate(data)

			// Assert
			expect(rehydrated.id).toBe(data.id)
			expect(rehydrated.type).toBe(data.type)
			expect(rehydrated.projectId).toBe(data.projectId)
			expect(rehydrated.taskId).toBe(data.taskId)
			expect(rehydrated.userId).toBe(data.userId)
			expect(rehydrated.occurredAt).toBe(data.occurredAt)
			expect(rehydrated.metadata).toBe(data.metadata)
		})
	})
})
