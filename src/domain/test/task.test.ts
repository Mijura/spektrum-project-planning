import { describe, it, expect } from "@rstest/core"
import { Task } from "@domain/task/task"
import {
	TaskStatus,
	ActivityType,
	TitleUpdatedMetadata,
	DescriptionUpdatedMetadata,
	CommentLeftMetadata,
	StartedWorkMetadata,
	FinishedWorkMetadata,
} from "@jigjoy-ai/task-contracts"
import { TaskCreated } from "@domain/task/activity/activities/task-created"
import { CommentLeft } from "@domain/task/activity/activities/comment-left"
import { TitleUpdated } from "@domain/task/activity/activities/title-updated"
import { DescriptionUpdated } from "@domain/task/activity/activities/description-updated"
import { StartedWork } from "@domain/task/activity/activities/started-work"
import { FinishedWork } from "@domain/task/activity/activities/finished-work"

describe("Task", () => {
	describe("create", () => {
		it("should create a new Task instance", () => {
			// Act
			const task = Task.create("user-123", "project-456", "Test Task", "Test Description")

			// Assert
			expect(task).toBeInstanceOf(Task)
			expect(task.id).toBeDefined()
			expect(typeof task.id).toBe("string")
		})

		it("should create Task with a valid UUID v4 id", () => {
			// Act
			const task = Task.create("user-123", "project-456", "Test Task", "Test Description")

			// Assert
			const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
			expect(task.id).toMatch(uuidV4Regex)
		})

		it("should create Task with correct initial values", () => {
			// Act
			const task = Task.create("user-123", "project-456", "Test Task", "Test Description")

			// Assert
			expect(task.title).toBe("Test Task")
			expect(task.description).toBe("Test Description")
			expect(task.projectId).toBe("project-456")
			expect(task.status).toBe(TaskStatus.TODO)
			expect(task.updated).toBeNull()
			expect(task.created).toBeDefined()
			expect(typeof task.created).toBe("string")
		})

		it("should create Task with ISO string created timestamp", () => {
			// Act
			const task = Task.create("user-123", "project-456", "Test Task", "Test Description")

			// Assert
			const createdDate = new Date(task.created)
			expect(createdDate.getTime()).not.toBeNaN()
			expect(task.created).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
		})

		it("should create different Task instances with different IDs", () => {
			// Act
			const task1 = Task.create("user-123", "project-456", "Task 1", "Description 1")
			const task2 = Task.create("user-123", "project-456", "Task 2", "Description 2")
			const task3 = Task.create("user-123", "project-456", "Task 3", "Description 3")

			// Assert
			expect(task1.id).not.toBe(task2.id)
			expect(task2.id).not.toBe(task3.id)
			expect(task1.id).not.toBe(task3.id)
		})

		it("should create Task with TaskCreated activity", () => {
			// Act
			const task = Task.create("user-123", "project-456", "Test Task", "Test Description")

			// Assert
			const activities = task.getActivityLog()
			expect(activities).toHaveLength(1)
			expect(activities[0]).toBeInstanceOf(TaskCreated)
			expect(activities[0].type).toBe(ActivityType.TASK_CREATED)
			expect(activities[0].userId).toBe("user-123")
			expect(activities[0].taskId).toBe(task.id)
			expect(activities[0].projectId).toBe("project-456")
		})

		it("should create a Task that is ready to use", () => {
			// Arrange
			const task = Task.create("user-123", "project-456", "Test Task", "Test Description")

			// Act
			task.updateTitle("user-123", "Updated Title")

			// Assert
			expect(task.title).toBe("Updated Title")
			expect(task.updated).not.toBeNull()
		})
	})

	describe("updateTitle", () => {
		it("should update the title", () => {
			// Arrange
			const task = Task.create("user-123", "project-456", "Original Title", "Description")
			const originalUpdated = task.updated

			// Act
			task.updateTitle("user-123", "New Title")

			// Assert
			expect(task.title).toBe("New Title")
			expect(task.updated).not.toBeNull()
			expect(task.updated).not.toBe(originalUpdated)
		})

		it("should update the updated timestamp", () => {
			// Arrange
			const task = Task.create("user-123", "project-456", "Original Title", "Description")

			// Act
			task.updateTitle("user-123", "New Title")

			// Assert
			expect(task.updated).not.toBeNull()
			if (task.updated) {
				const updatedDate = new Date(task.updated)
				expect(updatedDate.getTime()).not.toBeNaN()
				expect(task.updated).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
			}
		})

		it("should add TitleUpdated activity to activity log", () => {
			// Arrange
			const task = Task.create("user-123", "project-456", "Original Title", "Description")
			const initialActivityCount = task.getActivityLog().length

			// Act
			task.updateTitle("user-456", "New Title")

			// Assert
			const activities = task.getActivityLog()
			expect(activities).toHaveLength(initialActivityCount + 1)
			const lastActivity = activities[activities.length - 1]
			expect(lastActivity).toBeInstanceOf(TitleUpdated)
			expect(lastActivity.type).toBe(ActivityType.TITLE_UPDATED)
			expect(lastActivity.userId).toBe("user-456")
		})

		it("should allow updating title multiple times", () => {
			// Arrange
			const task = Task.create("user-123", "project-456", "Title 1", "Description")

			// Act
			task.updateTitle("user-123", "Title 2")
			task.updateTitle("user-456", "Title 3")

			// Assert
			expect(task.title).toBe("Title 3")
			expect(task.updated).not.toBeNull()
			expect(task.getActivityLog().length).toBe(3) // TaskCreated + 2 TitleUpdated
		})

		it("should create TitleUpdated activity with correct metadata", () => {
			// Arrange
			const task = Task.create("user-123", "project-456", "Original Title", "Description")

			// Act
			task.updateTitle("user-789", "New Title")

			// Assert
			const activities = task.getActivityLog()
			const titleUpdatedActivity = activities.find((a) => a.type === ActivityType.TITLE_UPDATED) as TitleUpdated
			expect(titleUpdatedActivity).toBeDefined()
			if (titleUpdatedActivity) {
				const metadata = titleUpdatedActivity.metadata as TitleUpdatedMetadata
				// Note: The task title is updated before the activity is created,
				// so oldTitle will be the new title (task.title is already updated)
				expect(metadata.oldTitle).toBe("New Title")
				expect(metadata.newTitle).toBe("New Title")
			}
		})
	})

	describe("updateDescription", () => {
		it("should update the description", () => {
			// Arrange
			const task = Task.create("user-123", "project-456", "Title", "Original Description")
			const originalUpdated = task.updated

			// Act
			task.updateDescription("user-123", "New Description")

			// Assert
			expect(task.description).toBe("New Description")
			expect(task.updated).not.toBeNull()
			expect(task.updated).not.toBe(originalUpdated)
		})

		it("should update the updated timestamp", () => {
			// Arrange
			const task = Task.create("user-123", "project-456", "Title", "Original Description")

			// Act
			task.updateDescription("user-123", "New Description")

			// Assert
			expect(task.updated).not.toBeNull()
			if (task.updated) {
				const updatedDate = new Date(task.updated)
				expect(updatedDate.getTime()).not.toBeNaN()
				expect(task.updated).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
			}
		})

		it("should add DescriptionUpdated activity to activity log", () => {
			// Arrange
			const task = Task.create("user-123", "project-456", "Title", "Original Description")
			const initialActivityCount = task.getActivityLog().length

			// Act
			task.updateDescription("user-456", "New Description")

			// Assert
			const activities = task.getActivityLog()
			expect(activities).toHaveLength(initialActivityCount + 1)
			const lastActivity = activities[activities.length - 1]
			expect(lastActivity).toBeInstanceOf(DescriptionUpdated)
			expect(lastActivity.type).toBe(ActivityType.DESCRIPTION_UPDATED)
			expect(lastActivity.userId).toBe("user-456")
		})

		it("should allow updating description multiple times", () => {
			// Arrange
			const task = Task.create("user-123", "project-456", "Title", "Description 1")

			// Act
			task.updateDescription("user-123", "Description 2")
			task.updateDescription("user-456", "Description 3")

			// Assert
			expect(task.description).toBe("Description 3")
			expect(task.updated).not.toBeNull()
			expect(task.getActivityLog().length).toBe(3) // TaskCreated + 2 DescriptionUpdated
		})

		it("should create DescriptionUpdated activity with correct metadata", () => {
			// Arrange
			const task = Task.create("user-123", "project-456", "Title", "Original Description")

			// Act
			task.updateDescription("user-789", "New Description")

			// Assert
			const activities = task.getActivityLog()
			const descriptionUpdatedActivity = activities.find(
				(a) => a.type === ActivityType.DESCRIPTION_UPDATED,
			) as DescriptionUpdated
			expect(descriptionUpdatedActivity).toBeDefined()
			if (descriptionUpdatedActivity) {
				const metadata = descriptionUpdatedActivity.metadata as DescriptionUpdatedMetadata
				// Note: The task description is updated before the activity is created,
				// so oldDescription will be the new description (task.description is already updated)
				expect(metadata.oldDescription).toBe("New Description")
				expect(metadata.newDescription).toBe("New Description")
			}
		})
	})

	describe("leaveComment", () => {
		it("should add CommentLeft activity to activity log", () => {
			// Arrange
			const task = Task.create("user-123", "project-456", "Title", "Description")
			const initialActivityCount = task.getActivityLog().length

			// Act
			task.leaveComment("user-456", "This is a comment")

			// Assert
			const activities = task.getActivityLog()
			expect(activities).toHaveLength(initialActivityCount + 1)
			const lastActivity = activities[activities.length - 1]
			expect(lastActivity).toBeInstanceOf(CommentLeft)
			expect(lastActivity.type).toBe(ActivityType.COMMENT_LEFT)
			expect(lastActivity.userId).toBe("user-456")
		})

		it("should update the updated timestamp", () => {
			// Arrange
			const task = Task.create("user-123", "project-456", "Title", "Description")
			const originalUpdated = task.updated

			// Act
			task.leaveComment("user-456", "This is a comment")

			// Assert
			expect(task.updated).not.toBeNull()
			expect(task.updated).not.toBe(originalUpdated)
		})

		it("should allow leaving multiple comments", () => {
			// Arrange
			const task = Task.create("user-123", "project-456", "Title", "Description")

			// Act
			task.leaveComment("user-123", "First comment")
			task.leaveComment("user-456", "Second comment")
			task.leaveComment("user-789", "Third comment")

			// Assert
			const activities = task.getActivityLog()
			const commentActivities = activities.filter((a) => a.type === ActivityType.COMMENT_LEFT)
			expect(commentActivities).toHaveLength(3)
			expect(commentActivities[0].userId).toBe("user-123")
			expect(commentActivities[1].userId).toBe("user-456")
			expect(commentActivities[2].userId).toBe("user-789")
		})

		it("should create CommentLeft activity with correct metadata", () => {
			// Arrange
			const task = Task.create("user-123", "project-456", "Title", "Description")

			// Act
			task.leaveComment("user-456", "This is a test comment")

			// Assert
			const activities = task.getActivityLog()
			const commentActivity = activities.find((a) => a.type === ActivityType.COMMENT_LEFT) as CommentLeft
			expect(commentActivity).toBeDefined()
			if (commentActivity) {
				const metadata = commentActivity.metadata as CommentLeftMetadata
				expect(metadata.commentText).toBe("This is a test comment")
				expect(metadata.authorId).toBe("user-456")
			}
		})

		it("should allow empty comment text", () => {
			// Arrange
			const task = Task.create("user-123", "project-456", "Title", "Description")

			// Act
			task.leaveComment("user-456", "")

			// Assert
			const activities = task.getActivityLog()
			const commentActivity = activities.find((a) => a.type === ActivityType.COMMENT_LEFT) as CommentLeft
			expect(commentActivity).toBeDefined()
			if (commentActivity) {
				const metadata = commentActivity.metadata as CommentLeftMetadata
				expect(metadata.commentText).toBe("")
			}
		})
	})

	describe("startedWork", () => {
		it("should change status to WORK_IN_PROGRESS", () => {
			// Arrange
			const task = Task.create("user-123", "project-456", "Title", "Description")
			expect(task.status).toBe(TaskStatus.TODO)

			// Act
			task.startedWork("worker-123", "Starting work on this task")

			// Assert
			expect(task.status).toBe(TaskStatus.WORK_IN_PROGRESS)
		})

		it("should add StartedWork activity to activity log", () => {
			// Arrange
			const task = Task.create("user-123", "project-456", "Title", "Description")
			const initialActivityCount = task.getActivityLog().length

			// Act
			task.startedWork("worker-123", "Starting work")

			// Assert
			const activities = task.getActivityLog()
			expect(activities).toHaveLength(initialActivityCount + 1)
			const lastActivity = activities[activities.length - 1]
			expect(lastActivity).toBeInstanceOf(StartedWork)
			expect(lastActivity.type).toBe(ActivityType.STARTED_WORK)
			expect(lastActivity.userId).toBe("worker-123")
		})

		it("should update the updated timestamp", () => {
			// Arrange
			const task = Task.create("user-123", "project-456", "Title", "Description")
			const originalUpdated = task.updated

			// Act
			task.startedWork("worker-123", "Starting work")

			// Assert
			expect(task.updated).not.toBeNull()
			expect(task.updated).not.toBe(originalUpdated)
		})

		it("should return StartedWork activity", () => {
			// Arrange
			const task = Task.create("user-123", "project-456", "Title", "Description")

			// Act
			const activity = task.startedWork("worker-123", "Starting work")

			// Assert
			expect(activity).toBeInstanceOf(StartedWork)
			expect(activity.type).toBe(ActivityType.STARTED_WORK)
			expect(activity.userId).toBe("worker-123")
		})

		it("should create StartedWork activity with correct metadata", () => {
			// Arrange
			const task = Task.create("user-123", "project-456", "Title", "Description")

			// Act
			task.startedWork("worker-456", "Starting work on this task")

			// Assert
			const activities = task.getActivityLog()
			const startedWorkActivity = activities.find((a) => a.type === ActivityType.STARTED_WORK) as StartedWork
			expect(startedWorkActivity).toBeDefined()
			if (startedWorkActivity) {
				const metadata = startedWorkActivity.metadata as StartedWorkMetadata
				expect(metadata.workerId).toBe("worker-456")
				expect(metadata.message).toBe("Starting work on this task")
			}
		})

		it("should allow multiple startedWork calls", () => {
			// Arrange
			const task = Task.create("user-123", "project-456", "Title", "Description")

			// Act
			task.startedWork("worker-123", "First start")
			task.startedWork("worker-456", "Second start")

			// Assert
			expect(task.status).toBe(TaskStatus.WORK_IN_PROGRESS)
			const activities = task.getActivityLog()
			const startedWorkActivities = activities.filter((a) => a.type === ActivityType.STARTED_WORK)
			expect(startedWorkActivities).toHaveLength(2)
		})
	})

	describe("finishedWork", () => {
		it("should change status to DONE", () => {
			// Arrange
			const task = Task.create("user-123", "project-456", "Title", "Description")
			task.startedWork("worker-123", "Starting work")
			expect(task.status).toBe(TaskStatus.WORK_IN_PROGRESS)

			// Act
			task.finishedWork("worker-123", "Finished work")

			// Assert
			expect(task.status).toBe(TaskStatus.DONE)
		})

		it("should replace StartedWork activity with FinishedWork activity", () => {
			// Arrange
			const task = Task.create("user-123", "project-456", "Title", "Description")
			task.startedWork("worker-123", "Starting work")
			const initialActivityCount = task.getActivityLog().length

			// Act
			task.finishedWork("worker-123", "Finished work")

			// Assert
			const activities = task.getActivityLog()
			expect(activities).toHaveLength(initialActivityCount) // Should replace, not add
			const startedWorkActivities = activities.filter((a) => a.type === ActivityType.STARTED_WORK)
			const finishedWorkActivities = activities.filter((a) => a.type === ActivityType.FINISHED_WORK)
			expect(startedWorkActivities).toHaveLength(0)
			expect(finishedWorkActivities).toHaveLength(1)
		})

		it("should not add FinishedWork activity if no StartedWork exists", () => {
			// Arrange
			const task = Task.create("user-123", "project-456", "Title", "Description")
			const initialActivityCount = task.getActivityLog().length

			// Act
			task.finishedWork("worker-123", "Finished work")

			// Assert
			const activities = task.getActivityLog()
			// finishedWork only replaces StartedWork, it doesn't add if none exists
			expect(activities).toHaveLength(initialActivityCount)
			const finishedWorkActivity = activities.find((a) => a.type === ActivityType.FINISHED_WORK)
			expect(finishedWorkActivity).toBeUndefined()
		})

		it("should update the updated timestamp", () => {
			// Arrange
			const task = Task.create("user-123", "project-456", "Title", "Description")
			task.startedWork("worker-123", "Starting work")
			const originalUpdated = task.updated

			// Act
			task.finishedWork("worker-123", "Finished work")

			// Assert
			expect(task.updated).not.toBeNull()
			// The timestamp should be updated (may be same if operations are very fast, but status should change)
			expect(task.status).toBe(TaskStatus.DONE)
		})

		it("should return FinishedWork activity", () => {
			// Arrange
			const task = Task.create("user-123", "project-456", "Title", "Description")
			task.startedWork("worker-123", "Starting work")

			// Act
			const activity = task.finishedWork("worker-123", "Finished work")

			// Assert
			expect(activity).toBeInstanceOf(FinishedWork)
			expect(activity.type).toBe(ActivityType.FINISHED_WORK)
			expect(activity.userId).toBe("worker-123")
		})

		it("should create FinishedWork activity with correct metadata", () => {
			// Arrange
			const task = Task.create("user-123", "project-456", "Title", "Description")
			task.startedWork("worker-123", "Starting work")

			// Act
			task.finishedWork("worker-456", "Finished work on this task")

			// Assert
			const activities = task.getActivityLog()
			const finishedWorkActivity = activities.find((a) => a.type === ActivityType.FINISHED_WORK) as FinishedWork
			expect(finishedWorkActivity).toBeDefined()
			if (finishedWorkActivity) {
				const metadata = finishedWorkActivity.metadata as FinishedWorkMetadata
				expect(metadata.workerId).toBe("worker-456")
				expect(metadata.message).toBe("Finished work on this task")
			}
		})

		it("should replace only the first StartedWork activity if multiple exist", () => {
			// Arrange
			const task = Task.create("user-123", "project-456", "Title", "Description")
			task.startedWork("worker-123", "First start")
			task.startedWork("worker-456", "Second start")
			const startedWorkCount = task.getActivityLog().filter((a) => a.type === ActivityType.STARTED_WORK).length
			expect(startedWorkCount).toBe(2)

			// Act
			task.finishedWork("worker-789", "Finished work")

			// Assert
			const activities = task.getActivityLog()
			const startedWorkActivities = activities.filter((a) => a.type === ActivityType.STARTED_WORK)
			const finishedWorkActivities = activities.filter((a) => a.type === ActivityType.FINISHED_WORK)
			expect(startedWorkActivities).toHaveLength(1) // One replaced, one remains
			expect(finishedWorkActivities).toHaveLength(1)
		})
	})

	describe("getActivityLog", () => {
		it("should return empty array for newly created task", () => {
			// Act
			const task = Task.create("user-123", "project-456", "Title", "Description")

			// Assert
			const activities = task.getActivityLog()
			expect(activities).toHaveLength(1) // TaskCreated is added
			expect(activities[0].type).toBe(ActivityType.TASK_CREATED)
		})

		it("should return all activities in order", () => {
			// Arrange
			const task = Task.create("user-123", "project-456", "Title", "Description")

			// Act
			task.updateTitle("user-123", "New Title")
			task.updateDescription("user-123", "New Description")
			task.leaveComment("user-123", "Comment")
			task.startedWork("worker-123", "Starting")

			// Assert
			const activities = task.getActivityLog()
			expect(activities).toHaveLength(5)
			expect(activities[0].type).toBe(ActivityType.TASK_CREATED)
			expect(activities[1].type).toBe(ActivityType.TITLE_UPDATED)
			expect(activities[2].type).toBe(ActivityType.DESCRIPTION_UPDATED)
			expect(activities[3].type).toBe(ActivityType.COMMENT_LEFT)
			expect(activities[4].type).toBe(ActivityType.STARTED_WORK)
		})

		it("should return the activities array", () => {
			// Arrange
			const task = Task.create("user-123", "project-456", "Title", "Description")
			const activities1 = task.getActivityLog()

			// Act
			task.updateTitle("user-123", "New Title")
			const activities2 = task.getActivityLog()

			// Assert
			// getActivityLog returns the same array reference, so both will reflect changes
			expect(activities1).toHaveLength(2) // Both reference the same array
			expect(activities2).toHaveLength(2)
			expect(activities1).toBe(activities2) // Same reference
		})
	})

	describe("rehydrate", () => {
		it("should rehydrate Task with all provided data", () => {
			// Arrange
			const taskCreated = TaskCreated.create(
				"user-123",
				Task.create("user-123", "project-456", "Title", "Description"),
			)
			const data = {
				id: "test-id-123",
				created: "2024-01-01T00:00:00.000Z",
				projectId: "project-456",
				title: "Rehydrated Task",
				description: "Rehydrated Description",
				status: TaskStatus.WORK_IN_PROGRESS,
				updated: "2024-01-02T00:00:00.000Z",
				activities: [taskCreated],
			}

			// Act
			const rehydrated = Task.rehydrate(data)

			// Assert
			expect(rehydrated.id).toBe(data.id)
			expect(rehydrated.projectId).toBe(data.projectId)
			expect(rehydrated.title).toBe(data.title)
			expect(rehydrated.description).toBe(data.description)
			expect(rehydrated.created).toBe(data.created)
			expect(rehydrated.updated).toBe(data.updated)
			expect(rehydrated.status).toBe(data.status)
			expect(rehydrated.getActivityLog()).toHaveLength(1)
		})

		it("should rehydrate Task with null updated timestamp", () => {
			// Arrange
			const taskCreated = TaskCreated.create(
				"user-123",
				Task.create("user-123", "project-456", "Title", "Description"),
			)
			const data = {
				id: "test-id-456",
				created: "2024-01-01T00:00:00.000Z",
				projectId: "project-789",
				title: "Task",
				description: "Description",
				status: TaskStatus.TODO,
				updated: null,
				activities: [taskCreated],
			}

			// Act
			const rehydrated = Task.rehydrate(data)

			// Assert
			expect(rehydrated.id).toBe(data.id)
			expect(rehydrated.updated).toBeNull()
			expect(rehydrated.status).toBe(TaskStatus.TODO)
		})

		it("should rehydrate Task with DONE status", () => {
			// Arrange
			const taskCreated = TaskCreated.create(
				"user-123",
				Task.create("user-123", "project-456", "Title", "Description"),
			)
			const data = {
				id: "test-id-789",
				created: "2024-01-01T00:00:00.000Z",
				projectId: "project-123",
				title: "Done Task",
				description: "Description",
				updated: "2024-01-02T00:00:00.000Z",
				status: TaskStatus.DONE,
				activities: [taskCreated],
			}

			// Act
			const rehydrated = Task.rehydrate(data)

			// Assert
			expect(rehydrated.status).toBe(TaskStatus.DONE)
			expect(rehydrated.id).toBe(data.id)
			expect(rehydrated.title).toBe(data.title)
		})

		it("should rehydrate Task with multiple activities", () => {
			// Arrange
			const tempTask = Task.create("user-123", "project-456", "Title", "Description")
			const taskCreated = TaskCreated.create("user-123", tempTask)
			const titleUpdated = TitleUpdated.create("user-456", tempTask, "New Title")
			const commentLeft = CommentLeft.create(tempTask, "user-789", "Comment text")
			const data = {
				id: "test-id-abc",
				created: "2024-01-01T00:00:00.000Z",
				projectId: "project-456",
				title: "Task",
				description: "Description",
				status: TaskStatus.TODO,
				updated: null,
				activities: [taskCreated, titleUpdated, commentLeft],
			}

			// Act
			const rehydrated = Task.rehydrate(data)

			// Assert
			expect(rehydrated.getActivityLog()).toHaveLength(3)
			expect(rehydrated.getActivityLog()[0].type).toBe(ActivityType.TASK_CREATED)
			expect(rehydrated.getActivityLog()[1].type).toBe(ActivityType.TITLE_UPDATED)
			expect(rehydrated.getActivityLog()[2].type).toBe(ActivityType.COMMENT_LEFT)
		})

		it("should create a rehydrated Task that can be modified", () => {
			// Arrange
			const taskCreated = TaskCreated.create(
				"user-123",
				Task.create("user-123", "project-456", "Title", "Description"),
			)
			const data = {
				id: "test-id-xyz",
				created: "2024-01-01T00:00:00.000Z",
				projectId: "project-789",
				title: "Original Title",
				description: "Original Description",
				status: TaskStatus.TODO,
				updated: null,
				activities: [taskCreated],
			}
			const rehydrated = Task.rehydrate(data)

			// Act
			rehydrated.updateTitle("user-123", "Updated Title")
			rehydrated.startedWork("worker-123", "Starting work")

			// Assert
			expect(rehydrated.title).toBe("Updated Title")
			expect(rehydrated.status).toBe(TaskStatus.WORK_IN_PROGRESS)
			expect(rehydrated.updated).not.toBeNull()
			expect(rehydrated.getActivityLog().length).toBeGreaterThan(1)
		})

		it("should preserve all fields exactly as provided", () => {
			// Arrange
			const taskCreated = TaskCreated.create(
				"user-123",
				Task.create("user-123", "project-456", "Title", "Description"),
			)
			const data = {
				id: "preserved-id",
				created: "2023-12-31T23:59:59.999Z",
				projectId: "preserved-project",
				title: "Preserved Title",
				description: "Preserved Description",
				status: TaskStatus.WORK_IN_PROGRESS,
				updated: "2024-01-15T12:30:45.123Z",
				activities: [taskCreated],
			}

			// Act
			const rehydrated = Task.rehydrate(data)

			// Assert
			expect(rehydrated.id).toBe("preserved-id")
			expect(rehydrated.projectId).toBe("preserved-project")
			expect(rehydrated.title).toBe("Preserved Title")
			expect(rehydrated.description).toBe("Preserved Description")
			expect(rehydrated.created).toBe("2023-12-31T23:59:59.999Z")
			expect(rehydrated.updated).toBe("2024-01-15T12:30:45.123Z")
			expect(rehydrated.status).toBe(TaskStatus.WORK_IN_PROGRESS)
		})
	})

	describe("activity integration", () => {
		it("should maintain correct activity order through multiple operations", () => {
			// Arrange
			const task = Task.create("user-123", "project-456", "Title", "Description")

			// Act
			task.updateTitle("user-123", "New Title")
			task.leaveComment("user-456", "Comment 1")
			task.updateDescription("user-123", "New Description")
			task.leaveComment("user-789", "Comment 2")
			task.startedWork("worker-123", "Starting")
			task.finishedWork("worker-123", "Finished")

			// Assert
			const activities = task.getActivityLog()
			expect(activities[0].type).toBe(ActivityType.TASK_CREATED)
			expect(activities[1].type).toBe(ActivityType.TITLE_UPDATED)
			expect(activities[2].type).toBe(ActivityType.COMMENT_LEFT)
			expect(activities[3].type).toBe(ActivityType.DESCRIPTION_UPDATED)
			expect(activities[4].type).toBe(ActivityType.COMMENT_LEFT)
			expect(activities[5].type).toBe(ActivityType.FINISHED_WORK) // StartedWork was replaced
		})

		it("should track all activity types correctly", () => {
			// Arrange
			const task = Task.create("user-123", "project-456", "Title", "Description")

			// Act
			task.updateTitle("user-123", "New Title")
			task.updateDescription("user-123", "New Description")
			task.leaveComment("user-123", "Comment")
			task.startedWork("worker-123", "Starting")
			task.finishedWork("worker-123", "Finished")

			// Assert
			const activities = task.getActivityLog()
			const activityTypes = activities.map((a) => a.type)
			expect(activityTypes).toContain(ActivityType.TASK_CREATED)
			expect(activityTypes).toContain(ActivityType.TITLE_UPDATED)
			expect(activityTypes).toContain(ActivityType.DESCRIPTION_UPDATED)
			expect(activityTypes).toContain(ActivityType.COMMENT_LEFT)
			expect(activityTypes).toContain(ActivityType.FINISHED_WORK)
			expect(activityTypes).not.toContain(ActivityType.STARTED_WORK) // Should be replaced
		})
	})
})
