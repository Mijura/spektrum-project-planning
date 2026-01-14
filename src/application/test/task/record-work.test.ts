import { describe, it, expect, beforeEach } from "@rstest/core"
import { RecordWork } from "@app/use-cases/task/record-work"
import { InMemoryTaskRepository } from "@app/test/mocks/in-memory-task-repository"
import { TaskRepository } from "@app/ports/repositories/task-repository"
import { Task } from "@domain/task/task"
import { TaskStatus, ActivityType, StartedWorkMetadata, FinishedWorkMetadata, Activity } from "@jigjoy-io/task-contracts"
import { StartedWork } from "@domain/task/activity/activities/started-work"
import { FinishedWork } from "@domain/task/activity/activities/finished-work"

describe("Record Work", () => {
	let recordWorkUseCase: RecordWork
	let repository: TaskRepository

	beforeEach(() => {
		repository = new InMemoryTaskRepository()
		recordWorkUseCase = new RecordWork(repository)
	})

	it("should successfully record STARTED_WORK", async () => {
		// Arrange
		const task = Task.create("User", "project-123", "Test Task", "Test Description")
		expect(task.status).toBe(TaskStatus.TODO)
		await repository.save(task)
		const workerId = "worker-123"
		const message = "Starting work on this task"

		// Act
		const result = await recordWorkUseCase.execute(task.id, workerId, message, ActivityType.STARTED_WORK)

		// Assert
		expect(result).toBeDefined()
		expect(result.id).toBe(task.id)
		expect(result.status).toBe(TaskStatus.WORK_IN_PROGRESS)
		const activities = result.getActivityLog()
		const startedWorkActivity = activities.find((a) => a.type === ActivityType.STARTED_WORK) as StartedWork
		expect(startedWorkActivity).toBeDefined()
		if (startedWorkActivity) {
			const metadata = startedWorkActivity.metadata as StartedWorkMetadata
			expect(metadata.workerId).toBe(workerId)
			expect(metadata.message).toBe(message)
		}
	})

	it("should successfully record FINISHED_WORK", async () => {
		// Arrange
		const task = Task.create("User", "project-123", "Test Task", "Test Description")
		task.startedWork("worker-123", "Started work")
		expect(task.status).toBe(TaskStatus.WORK_IN_PROGRESS)
		await repository.save(task)
		const workerId = "worker-123"
		const message = "Finished work on this task"

		// Act
		const result = await recordWorkUseCase.execute(task.id, workerId, message, ActivityType.FINISHED_WORK)

		// Assert
		expect(result).toBeDefined()
		expect(result.id).toBe(task.id)
		expect(result.status).toBe(TaskStatus.DONE)
		const activities = result.getActivityLog()
		const finishedWorkActivity = activities.find((a) => a.type === ActivityType.FINISHED_WORK) as FinishedWork
		expect(finishedWorkActivity).toBeDefined()
		if (finishedWorkActivity) {
			const metadata = finishedWorkActivity.metadata as FinishedWorkMetadata
			expect(metadata.workerId).toBe(workerId)
			expect(metadata.message).toBe(message)
		}
	})

	it("should change task status to WORK_IN_PROGRESS when recording STARTED_WORK", async () => {
		// Arrange
		const task = Task.create("User", "project-123", "Test Task", "Test Description")
		expect(task.status).toBe(TaskStatus.TODO)
		await repository.save(task)

		// Act
		const result = await recordWorkUseCase.execute(task.id, "worker-123", "Starting", ActivityType.STARTED_WORK)

		// Assert
		expect(result.status).toBe(TaskStatus.WORK_IN_PROGRESS)
	})

	it("should change task status to DONE when recording FINISHED_WORK", async () => {
		// Arrange
		const task = Task.create("User", "project-123", "Test Task", "Test Description")
		task.startedWork("worker-123", "Started")
		expect(task.status).toBe(TaskStatus.WORK_IN_PROGRESS)
		await repository.save(task)

		// Act
		const result = await recordWorkUseCase.execute(task.id, "worker-123", "Finished", ActivityType.FINISHED_WORK)

		// Assert
		expect(result.status).toBe(TaskStatus.DONE)
	})

	it("should update the task's updated timestamp", async () => {
		// Arrange
		const task = Task.create("User", "project-123", "Test Task", "Test Description")
		await repository.save(task)
		const originalUpdated = task.updated

		// Act
		const result = await recordWorkUseCase.execute(task.id, "worker-123", "Starting work", ActivityType.STARTED_WORK)

		// Assert
		expect(result.updated).not.toBeNull()
		expect(result.updated).not.toBe(originalUpdated)
	})

	it("should preserve all other task properties when recording work", async () => {
		// Arrange
		const task = Task.create("User", "project-123", "Original Title", "Original Description")
		task.updateTitle("User", "Updated Title")
		const originalId = task.id
		const originalProjectId = task.projectId
		const originalTitle = task.title
		const originalDescription = task.description
		await repository.save(task)

		// Act
		const result = await recordWorkUseCase.execute(task.id, "worker-123", "Starting", ActivityType.STARTED_WORK)

		// Assert
		expect(result.id).toBe(originalId)
		expect(result.projectId).toBe(originalProjectId)
		expect(result.title).toBe(originalTitle)
		expect(result.description).toBe(originalDescription)
		expect(result.status).toBe(TaskStatus.WORK_IN_PROGRESS)
	})

	it("should allow multiple STARTED_WORK recordings", async () => {
		// Arrange
		const task = Task.create("User", "project-123", "Test Task", "Test Description")
		await repository.save(task)

		// Act
		const result1 = await recordWorkUseCase.execute(task.id, "worker-123", "First start", ActivityType.STARTED_WORK)
		const result2 = await recordWorkUseCase.execute(task.id, "worker-456", "Second start", ActivityType.STARTED_WORK)

		// Assert
		expect(result2.status).toBe(TaskStatus.WORK_IN_PROGRESS)
		const activities = result2.getActivityLog()
		const startedWorkActivities = activities.filter((a) => a.type === ActivityType.STARTED_WORK)
		expect(startedWorkActivities).toHaveLength(2)
	})

	it("should replace StartedWork with FinishedWork when recording FINISHED_WORK", async () => {
		// Arrange
		const task = Task.create("User", "project-123", "Test Task", "Test Description")
		task.startedWork("worker-123", "Started work")
		await repository.save(task)
		const initialActivityCount = task.getActivityLog().length

		// Act
		const result = await recordWorkUseCase.execute(task.id, "worker-123", "Finished work", ActivityType.FINISHED_WORK)

		// Assert
		const activities = result.getActivityLog()
		expect(activities).toHaveLength(initialActivityCount) // Should replace, not add
		const startedWorkActivities = activities.filter((a) => a.type === ActivityType.STARTED_WORK)
		const finishedWorkActivities = activities.filter((a) => a.type === ActivityType.FINISHED_WORK)
		expect(startedWorkActivities).toHaveLength(0)
		expect(finishedWorkActivities).toHaveLength(1)
	})

	it("should handle FINISHED_WORK even when no StartedWork exists", async () => {
		// Arrange
		const task = Task.create("User", "project-123", "Test Task", "Test Description")
		expect(task.status).toBe(TaskStatus.TODO)
		await repository.save(task)

		// Act
		const result = await recordWorkUseCase.execute(task.id, "worker-123", "Finished", ActivityType.FINISHED_WORK)

		// Assert
		expect(result.status).toBe(TaskStatus.DONE)
		// Note: finishedWork only replaces StartedWork if it exists, otherwise it doesn't add FinishedWork
		// The status is still updated to DONE
		const activities = result.getActivityLog()
		const finishedWorkActivity = activities.find((a) => a.type === ActivityType.FINISHED_WORK)
		// finishedWork doesn't add activity if no StartedWork exists, it only replaces
		expect(result.status).toBe(TaskStatus.DONE)
	})

	it("should create StartedWork activity with correct metadata", async () => {
		// Arrange
		const task = Task.create("User", "project-123", "Test Task", "Test Description")
		await repository.save(task)
		const workerId = "worker-789"
		const message = "Starting work on this task"

		// Act
		const result = await recordWorkUseCase.execute(task.id, workerId, message, ActivityType.STARTED_WORK)

		// Assert
		const activities = result.getActivityLog()
		const startedWorkActivity = activities.find((a) => a.type === ActivityType.STARTED_WORK) as StartedWork
		expect(startedWorkActivity).toBeDefined()
		expect(startedWorkActivity!.taskId).toBe(task.id)
		expect(startedWorkActivity!.projectId).toBe(task.projectId)
		expect(startedWorkActivity!.userId).toBe(workerId)
		if (startedWorkActivity) {
			const metadata = startedWorkActivity.metadata as StartedWorkMetadata
			expect(metadata.workerId).toBe(workerId)
			expect(metadata.message).toBe(message)
		}
	})

	it("should create FinishedWork activity with correct metadata", async () => {
		// Arrange
		const task = Task.create("User", "project-123", "Test Task", "Test Description")
		task.startedWork("worker-123", "Started")
		await repository.save(task)
		const workerId = "worker-456"
		const message = "Finished work on this task"

		// Act
		const result = await recordWorkUseCase.execute(task.id, workerId, message, ActivityType.FINISHED_WORK)

		// Assert
		const activities = result.getActivityLog()
		const finishedWorkActivity = activities.find((a) => a.type === ActivityType.FINISHED_WORK) as FinishedWork
		expect(finishedWorkActivity).toBeDefined()
		expect(finishedWorkActivity!.taskId).toBe(task.id)
		expect(finishedWorkActivity!.projectId).toBe(task.projectId)
		expect(finishedWorkActivity!.userId).toBe(workerId)
		if (finishedWorkActivity) {
			const metadata = finishedWorkActivity.metadata as FinishedWorkMetadata
			expect(metadata.workerId).toBe(workerId)
			expect(metadata.message).toBe(message)
		}
	})

	it("should throw an error when task does not exist", async () => {
		// Arrange
		const nonExistentId = "non-existent-id"
		const workerId = "worker-123"
		const message = "Starting work"

		// Act & Assert
		await expect(
			recordWorkUseCase.execute(nonExistentId, workerId, message, ActivityType.STARTED_WORK),
		).rejects.toThrow("Task not found")
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
		const nullUseCase = new RecordWork(nullReturningRepository)

		// Act & Assert
		// This covers the if (!task) branch on line 17-18
		await expect(nullUseCase.execute("some-id", "worker-123", "Message", ActivityType.STARTED_WORK)).rejects.toThrow(
			"Task not found",
		)
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
		const errorUseCase = new RecordWork(errorThrowingRepository)

		// Act & Assert
		await expect(errorUseCase.execute("some-id", "worker-123", "Message", ActivityType.STARTED_WORK)).rejects.toThrow(
			errorMessage,
		)
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
		const errorUseCase = new RecordWork(errorThrowingRepository)

		// Act & Assert
		await expect(
			errorUseCase.execute(task.id, "worker-123", "Message", ActivityType.STARTED_WORK),
		).rejects.toThrow(errorMessage)
	})

	it("should persist the work record to repository", async () => {
		// Arrange
		const task = Task.create("User", "project-123", "Test Task", "Test Description")
		await repository.save(task)

		// Act
		await recordWorkUseCase.execute(task.id, "worker-123", "Persisted work", ActivityType.STARTED_WORK)

		// Assert
		const savedTask = await repository.get(task.id)
		expect(savedTask).toBeDefined()
		expect(savedTask!.status).toBe(TaskStatus.WORK_IN_PROGRESS)
		const activities = savedTask!.getActivityLog()
		const startedWorkActivity = activities.find((a) => a.type === ActivityType.STARTED_WORK)
		expect(startedWorkActivity).toBeDefined()
	})

	it("should handle workflow: TODO -> STARTED_WORK -> FINISHED_WORK", async () => {
		// Arrange
		const task = Task.create("User", "project-123", "Test Task", "Test Description")
		expect(task.status).toBe(TaskStatus.TODO)
		await repository.save(task)

		// Act - Start work
		const startedResult = await recordWorkUseCase.execute(
			task.id,
			"worker-123",
			"Starting work",
			ActivityType.STARTED_WORK,
		)
		expect(startedResult.status).toBe(TaskStatus.WORK_IN_PROGRESS)

		// Act - Finish work
		const finishedResult = await recordWorkUseCase.execute(
			task.id,
			"worker-123",
			"Finished work",
			ActivityType.FINISHED_WORK,
		)

		// Assert
		expect(finishedResult.status).toBe(TaskStatus.DONE)
		const activities = finishedResult.getActivityLog()
		const startedWorkActivities = activities.filter((a) => a.type === ActivityType.STARTED_WORK)
		const finishedWorkActivities = activities.filter((a) => a.type === ActivityType.FINISHED_WORK)
		expect(startedWorkActivities).toHaveLength(0) // Should be replaced
		expect(finishedWorkActivities).toHaveLength(1)
	})

	it("should handle else-if branch when type is FINISHED_WORK (covers else-if false branch)", async () => {
		// Arrange
		const task = Task.create("User", "project-123", "Test Task", "Test Description")
		await repository.save(task)

		// Create a use case instance that we can call with type assertion to test the else-if false branch
		// This tests the implicit else branch when the else-if condition is false
		// Note: This branch should never be reached in practice due to TypeScript's type system,
		// but we test it to achieve 100% branch coverage
		const useCase = recordWorkUseCase as any

		// Act - This will test the else-if false branch (implicit else)
		// We use a type assertion to bypass TypeScript's type checking
		const invalidType = "INVALID_TYPE" as ActivityType.STARTED_WORK | ActivityType.FINISHED_WORK
		const result = await useCase.execute(task.id, "worker-123", "Message", invalidType)

		// Assert - The task should be saved without any work activity (neither branch executed)
		expect(result).toBeDefined()
		expect(result.id).toBe(task.id)
		// No work activity should be added when neither condition is true
		const activities = result.getActivityLog()
		const workActivities = activities.filter(
			(a: Activity) => a.type === ActivityType.STARTED_WORK || a.type === ActivityType.FINISHED_WORK,
		)
		expect(workActivities).toHaveLength(0)
	})
})
