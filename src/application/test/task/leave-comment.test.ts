import { describe, it, expect, beforeEach } from "@rstest/core"
import { LeaveComment } from "@app/use-cases/task/leave-comment"
import { InMemoryTaskRepository } from "@app/test/mocks/in-memory-task-repository"
import { TaskRepository } from "@app/ports/repositories/task-repository"
import { Task } from "@domain/task/task"
import { ActivityType, CommentLeftMetadata } from "@jigjoy-ai/task-contracts"
import { CommentLeft } from "@domain/task/activity/activities/comment-left"

describe("Leave Comment", () => {
	let leaveCommentUseCase: LeaveComment
	let repository: TaskRepository

	beforeEach(() => {
		repository = new InMemoryTaskRepository()
		leaveCommentUseCase = new LeaveComment(repository)
	})

	it("should successfully leave a comment on a task", async () => {
		// Arrange
		const task = Task.create("User", "project-123", "Test Task", "Test Description")
		await repository.save(task)
		const commentText = "This is a test comment"
		const authorId = "user-456"

		// Act
		const result = await leaveCommentUseCase.execute(task.id, commentText, authorId)

		// Assert
		expect(result).toBeDefined()
		expect(result.id).toBe(task.id)
		const activities = result.getActivityLog()
		const commentActivity = activities.find((a) => a.type === ActivityType.COMMENT_LEFT) as CommentLeft
		expect(commentActivity).toBeDefined()
		if (commentActivity) {
			const metadata = commentActivity.metadata as CommentLeftMetadata
			expect(metadata.commentText).toBe(commentText)
			expect(metadata.authorId).toBe(authorId)
		}
	})

	it("should add CommentLeft activity to activity log", async () => {
		// Arrange
		const task = Task.create("User", "project-123", "Test Task", "Test Description")
		await repository.save(task)
		const initialActivityCount = task.getActivityLog().length

		// Act
		const result = await leaveCommentUseCase.execute(task.id, "Comment text", "user-789")

		// Assert
		const activities = result.getActivityLog()
		expect(activities).toHaveLength(initialActivityCount + 1)
		const lastActivity = activities[activities.length - 1]
		expect(lastActivity.type).toBe(ActivityType.COMMENT_LEFT)
		expect(lastActivity.userId).toBe("user-789")
	})

	it("should update the task's updated timestamp", async () => {
		// Arrange
		const task = Task.create("User", "project-123", "Test Task", "Test Description")
		await repository.save(task)
		const originalUpdated = task.updated

		// Act
		const result = await leaveCommentUseCase.execute(task.id, "Comment", "user-123")

		// Assert
		expect(result.updated).not.toBeNull()
		expect(result.updated).not.toBe(originalUpdated)
	})

	it("should preserve all other task properties", async () => {
		// Arrange
		const task = Task.create("User", "project-123", "Original Title", "Original Description")
		task.updateTitle("User", "Updated Title")
		const originalId = task.id
		const originalProjectId = task.projectId
		const originalTitle = task.title
		const originalDescription = task.description
		const originalStatus = task.status
		await repository.save(task)

		// Act
		const result = await leaveCommentUseCase.execute(task.id, "Comment", "user-123")

		// Assert
		expect(result.id).toBe(originalId)
		expect(result.projectId).toBe(originalProjectId)
		expect(result.title).toBe(originalTitle)
		expect(result.description).toBe(originalDescription)
		expect(result.status).toBe(originalStatus)
	})

	it("should allow leaving multiple comments", async () => {
		// Arrange
		const task = Task.create("User", "project-123", "Test Task", "Test Description")
		await repository.save(task)

		// Act
		const result1 = await leaveCommentUseCase.execute(task.id, "First comment", "user-123")
		const result2 = await leaveCommentUseCase.execute(task.id, "Second comment", "user-456")
		const result3 = await leaveCommentUseCase.execute(task.id, "Third comment", "user-789")

		// Assert
		const activities = result3.getActivityLog()
		const commentActivities = activities.filter((a) => a.type === ActivityType.COMMENT_LEFT)
		expect(commentActivities).toHaveLength(3)
		expect(commentActivities[0].userId).toBe("user-123")
		expect(commentActivities[1].userId).toBe("user-456")
		expect(commentActivities[2].userId).toBe("user-789")
	})

	it("should allow empty comment text", async () => {
		// Arrange
		const task = Task.create("User", "project-123", "Test Task", "Test Description")
		await repository.save(task)

		// Act
		const result = await leaveCommentUseCase.execute(task.id, "", "user-123")

		// Assert
		const activities = result.getActivityLog()
		const commentActivity = activities.find((a) => a.type === ActivityType.COMMENT_LEFT) as CommentLeft
		expect(commentActivity).toBeDefined()
		if (commentActivity) {
			const metadata = commentActivity.metadata as CommentLeftMetadata
			expect(metadata.commentText).toBe("")
		}
	})

	it("should throw an error when task does not exist", async () => {
		// Arrange
		const nonExistentId = "non-existent-id"
		const commentText = "Comment"
		const authorId = "user-123"

		// Act & Assert
		await expect(leaveCommentUseCase.execute(nonExistentId, commentText, authorId)).rejects.toThrow(
			"Task not found",
		)
	})

	it("should throw an error when task is null", async () => {
		// Arrange
		const nullReturningRepository: TaskRepository = {
			save: async () => {
				throw new Error("Should not be called")
			},
			get: async () => {
				return null
			},
			getAll: async () => {
				throw new Error("Should not be called")
			},
		}
		const nullUseCase = new LeaveComment(nullReturningRepository)

		// Act & Assert
		// This covers the if (!task) branch on line 10-11
		await expect(nullUseCase.execute("some-id", "Comment", "user-123")).rejects.toThrow("Task not found")
	})

	it("should throw an error when repository get fails", async () => {
		// Arrange
		const errorMessage = "Repository connection failed"
		const errorThrowingRepository: TaskRepository = {
			save: async () => {
				throw new Error("Should not be called")
			},
			get: async () => {
				throw new Error(errorMessage)
			},
			getAll: async () => {
				throw new Error("Should not be called")
			},
		}
		const errorUseCase = new LeaveComment(errorThrowingRepository)

		// Act & Assert
		await expect(errorUseCase.execute("some-id", "Comment", "user-123")).rejects.toThrow(errorMessage)
	})

	it("should throw an error when repository save fails", async () => {
		// Arrange
		const task = Task.create("User", "project-123", "Test Task", "Test Description")
		await repository.save(task)

		const errorMessage = "Repository save failed"
		const errorThrowingRepository: TaskRepository = {
			save: async () => {
				throw new Error(errorMessage)
			},
			get: async (taskId: string) => {
				return repository.get(taskId)
			},
			getAll: async () => {
				throw new Error("Should not be called")
			},
		}
		const errorUseCase = new LeaveComment(errorThrowingRepository)

		// Act & Assert
		await expect(errorUseCase.execute(task.id, "Comment", "user-123")).rejects.toThrow(errorMessage)
	})

	it("should persist the comment to repository", async () => {
		// Arrange
		const task = Task.create("User", "project-123", "Test Task", "Test Description")
		await repository.save(task)

		// Act
		const result = await leaveCommentUseCase.execute(task.id, "Persisted comment", "user-123")

		// Assert
		const savedTask = await repository.get(task.id)
		expect(savedTask).toBeDefined()
		const activities = savedTask!.getActivityLog()
		const commentActivity = activities.find((a) => a.type === ActivityType.COMMENT_LEFT) as CommentLeft
		expect(commentActivity).toBeDefined()
		if (commentActivity) {
			const metadata = commentActivity.metadata as CommentLeftMetadata
			expect(metadata.commentText).toBe("Persisted comment")
			expect(metadata.authorId).toBe("user-123")
		}
	})

	it("should create CommentLeft activity with correct metadata", async () => {
		// Arrange
		const task = Task.create("User", "project-123", "Test Task", "Test Description")
		await repository.save(task)
		const commentText = "This is a detailed comment with multiple words"
		const authorId = "author-789"

		// Act
		const result = await leaveCommentUseCase.execute(task.id, commentText, authorId)

		// Assert
		const activities = result.getActivityLog()
		const commentActivity = activities.find((a) => a.type === ActivityType.COMMENT_LEFT) as CommentLeft
		expect(commentActivity).toBeDefined()
		expect(commentActivity!.taskId).toBe(task.id)
		expect(commentActivity!.projectId).toBe(task.projectId)
		expect(commentActivity!.userId).toBe(authorId)
		if (commentActivity) {
			const metadata = commentActivity.metadata as CommentLeftMetadata
			expect(metadata.commentText).toBe(commentText)
			expect(metadata.authorId).toBe(authorId)
		}
	})
})
