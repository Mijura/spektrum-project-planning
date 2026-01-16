import { APIGatewayProxyEvent } from "aws-lambda"
import { describe, it, expect, beforeEach } from "@rstest/core"
import { FetchTasksUseCase } from "@app/ports/use-cases/task/fetch-tasks"
import { createFetchTasksHandler } from "@infra/http/factories/task/fetch-tasks"
import { Task } from "@domain/task/task"
import { TaskStatus, ActivityType } from "@jigjoy-io/task-contracts"
import { Activity } from "@domain/task/activity/activity"

describe("Fetch Tasks Handler", () => {
	let handler: (event: APIGatewayProxyEvent) => Promise<any>

	beforeEach(() => {
		// Reset handler before each test
		handler = undefined as any
	})

	it("returns 200 and array of tasks when projectId is provided", async () => {
		const mockTasks = [
			Task.rehydrate({
				id: "task-1",
				created: "2024-01-01T00:00:00.000Z",
				projectId: "test-project-id",
				title: "Task 1",
				description: "Description 1",
				status: TaskStatus.TODO,
				updated: null,
				activities: [],
			}),
			Task.rehydrate({
				id: "task-2",
				created: "2024-01-02T00:00:00.000Z",
				projectId: "test-project-id",
				title: "Task 2",
				description: "Description 2",
				status: TaskStatus.WORK_IN_PROGRESS,
				updated: null,
				activities: [],
			}),
		]

		const mockUseCase: FetchTasksUseCase = {
			execute: async () => mockTasks,
		}

		handler = createFetchTasksHandler(mockUseCase)

		const event = {
			pathParameters: {
				projectId: "test-project-id",
			},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(200)

		const body = JSON.parse(result.body)

		expect(Array.isArray(body)).toBe(true)
		expect(body.length).toBe(2)
		expect(body[0].id).toBe("task-1")
		expect(body[0].projectId).toBe("test-project-id")
		expect(body[0].title).toBe("Task 1")
		expect(body[0].status).toBe(TaskStatus.TODO)
		expect(body[1].id).toBe("task-2")
		expect(body[1].title).toBe("Task 2")
		expect(body[1].status).toBe(TaskStatus.WORK_IN_PROGRESS)
	})

	it("returns 200 and empty array when project has no tasks", async () => {
		const mockUseCase: FetchTasksUseCase = {
			execute: async () => [],
		}

		handler = createFetchTasksHandler(mockUseCase)

		const event = {
			pathParameters: {
				projectId: "test-project-id",
			},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(200)

		const body = JSON.parse(result.body)

		expect(Array.isArray(body)).toBe(true)
		expect(body.length).toBe(0)
	})

	it("returns 400 when projectId is missing", async () => {
		const mockUseCase: FetchTasksUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createFetchTasksHandler(mockUseCase)

		const event = {
			pathParameters: {},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Missing path parameter: projectId")
	})

	it("returns 400 when pathParameters is undefined", async () => {
		const mockUseCase: FetchTasksUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createFetchTasksHandler(mockUseCase)

		const event = {} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Missing path parameter: projectId")
	})

	it("returns 500 when an unexpected error is thrown", async () => {
		const mockUseCase: FetchTasksUseCase = {
			execute: async () => {
				throw new Error("Unexpected error")
			},
		}

		handler = createFetchTasksHandler(mockUseCase)

		const event = {
			pathParameters: {
				projectId: "test-project-id",
			},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(500)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Something went wrong")
	})

	it("returns tasks with updated timestamp", async () => {
		const mockTasks = [
			Task.rehydrate({
				id: "task-1",
				created: "2024-01-01T00:00:00.000Z",
				projectId: "test-project-id",
				title: "Task 1",
				description: "Description 1",
				status: TaskStatus.TODO,
				updated: "2024-01-02T00:00:00.000Z",
				activities: [],
			}),
		]

		const mockUseCase: FetchTasksUseCase = {
			execute: async () => mockTasks,
		}

		handler = createFetchTasksHandler(mockUseCase)

		const event = {
			pathParameters: {
				projectId: "test-project-id",
			},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(200)

		const body = JSON.parse(result.body)

		expect(body[0].updated).toBe("2024-01-02T00:00:00.000Z")
	})

	it("returns tasks with COMMENT_LEFT activity", async () => {
		const commentActivity = Activity.rehydrate({
			id: "activity-1",
			type: ActivityType.COMMENT_LEFT,
			projectId: "test-project-id",
			taskId: "task-1",
			userId: "user-123",
			metadata: {
				commentText: "This is a comment",
				authorId: "user-123",
			},
			occurredAt: "2024-01-01T00:00:00.000Z",
		})

		const mockTasks = [
			Task.rehydrate({
				id: "task-1",
				created: "2024-01-01T00:00:00.000Z",
				projectId: "test-project-id",
				title: "Task 1",
				description: "Description 1",
				status: TaskStatus.TODO,
				updated: "2024-01-01T00:00:00.000Z",
				activities: [commentActivity],
			}),
		]

		const mockUseCase: FetchTasksUseCase = {
			execute: async () => mockTasks,
		}

		handler = createFetchTasksHandler(mockUseCase)

		const event = {
			pathParameters: {
				projectId: "test-project-id",
			},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(200)

		const body = JSON.parse(result.body)

		expect(body[0].activities).toHaveLength(1)
		expect(body[0].activities[0].type).toBe(ActivityType.COMMENT_LEFT)
		expect(body[0].activities[0].metadata.commentText).toBe("This is a comment")
		expect(body[0].activities[0].metadata.authorId).toBe("user-123")
	})

	it("returns tasks with TITLE_UPDATED activity", async () => {
		const titleUpdatedActivity = Activity.rehydrate({
			id: "activity-1",
			type: ActivityType.TITLE_UPDATED,
			projectId: "test-project-id",
			taskId: "task-1",
			userId: "user-123",
			metadata: {
				message: "user-123 changed title to \"New Title\"",
				oldTitle: "Old Title",
				newTitle: "New Title",
			},
			occurredAt: "2024-01-01T00:00:00.000Z",
		})

		const mockTasks = [
			Task.rehydrate({
				id: "task-1",
				created: "2024-01-01T00:00:00.000Z",
				projectId: "test-project-id",
				title: "New Title",
				description: "Description 1",
				status: TaskStatus.TODO,
				updated: "2024-01-01T00:00:00.000Z",
				activities: [titleUpdatedActivity],
			}),
		]

		const mockUseCase: FetchTasksUseCase = {
			execute: async () => mockTasks,
		}

		handler = createFetchTasksHandler(mockUseCase)

		const event = {
			pathParameters: {
				projectId: "test-project-id",
			},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(200)

		const body = JSON.parse(result.body)

		expect(body[0].activities).toHaveLength(1)
		expect(body[0].activities[0].type).toBe(ActivityType.TITLE_UPDATED)
		expect(body[0].activities[0].metadata.message).toBe("user-123 changed title to \"New Title\"")
		expect(body[0].activities[0].metadata.oldTitle).toBe("Old Title")
		expect(body[0].activities[0].metadata.newTitle).toBe("New Title")
	})

	it("returns tasks with DESCRIPTION_UPDATED activity", async () => {
		const descriptionUpdatedActivity = Activity.rehydrate({
			id: "activity-1",
			type: ActivityType.DESCRIPTION_UPDATED,
			projectId: "test-project-id",
			taskId: "task-1",
			userId: "user-123",
			metadata: {
				message: "user-123 updated description",
				oldDescription: "Old Description",
				newDescription: "New Description",
			},
			occurredAt: "2024-01-01T00:00:00.000Z",
		})

		const mockTasks = [
			Task.rehydrate({
				id: "task-1",
				created: "2024-01-01T00:00:00.000Z",
				projectId: "test-project-id",
				title: "Task 1",
				description: "New Description",
				status: TaskStatus.TODO,
				updated: "2024-01-01T00:00:00.000Z",
				activities: [descriptionUpdatedActivity],
			}),
		]

		const mockUseCase: FetchTasksUseCase = {
			execute: async () => mockTasks,
		}

		handler = createFetchTasksHandler(mockUseCase)

		const event = {
			pathParameters: {
				projectId: "test-project-id",
			},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(200)

		const body = JSON.parse(result.body)

		expect(body[0].activities).toHaveLength(1)
		expect(body[0].activities[0].type).toBe(ActivityType.DESCRIPTION_UPDATED)
		expect(body[0].activities[0].metadata.message).toBe("user-123 updated description")
		expect(body[0].activities[0].metadata.oldDescription).toBe("Old Description")
		expect(body[0].activities[0].metadata.newDescription).toBe("New Description")
	})

	it("returns tasks with STARTED_WORK activity", async () => {
		const startedWorkActivity = Activity.rehydrate({
			id: "activity-1",
			type: ActivityType.STARTED_WORK,
			projectId: "test-project-id",
			taskId: "task-1",
			userId: "worker-123",
			metadata: {
				workerId: "worker-123",
				message: "Starting work",
			},
			occurredAt: "2024-01-01T00:00:00.000Z",
		})

		const mockTasks = [
			Task.rehydrate({
				id: "task-1",
				created: "2024-01-01T00:00:00.000Z",
				projectId: "test-project-id",
				title: "Task 1",
				description: "Description 1",
				status: TaskStatus.WORK_IN_PROGRESS,
				updated: "2024-01-01T00:00:00.000Z",
				activities: [startedWorkActivity],
			}),
		]

		const mockUseCase: FetchTasksUseCase = {
			execute: async () => mockTasks,
		}

		handler = createFetchTasksHandler(mockUseCase)

		const event = {
			pathParameters: {
				projectId: "test-project-id",
			},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(200)

		const body = JSON.parse(result.body)

		expect(body[0].activities).toHaveLength(1)
		expect(body[0].activities[0].type).toBe(ActivityType.STARTED_WORK)
		expect(body[0].activities[0].metadata.workerId).toBe("worker-123")
		expect(body[0].activities[0].metadata.message).toBe("Starting work")
	})

	it("returns tasks with FINISHED_WORK activity", async () => {
		const finishedWorkActivity = Activity.rehydrate({
			id: "activity-1",
			type: ActivityType.FINISHED_WORK,
			projectId: "test-project-id",
			taskId: "task-1",
			userId: "worker-123",
			metadata: {
				workerId: "worker-123",
				message: "Finished work",
			},
			occurredAt: "2024-01-01T00:00:00.000Z",
		})

		const mockTasks = [
			Task.rehydrate({
				id: "task-1",
				created: "2024-01-01T00:00:00.000Z",
				projectId: "test-project-id",
				title: "Task 1",
				description: "Description 1",
				status: TaskStatus.DONE,
				updated: "2024-01-01T00:00:00.000Z",
				activities: [finishedWorkActivity],
			}),
		]

		const mockUseCase: FetchTasksUseCase = {
			execute: async () => mockTasks,
		}

		handler = createFetchTasksHandler(mockUseCase)

		const event = {
			pathParameters: {
				projectId: "test-project-id",
			},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(200)

		const body = JSON.parse(result.body)

		expect(body[0].activities).toHaveLength(1)
		expect(body[0].activities[0].type).toBe(ActivityType.FINISHED_WORK)
		expect(body[0].activities[0].metadata.workerId).toBe("worker-123")
		expect(body[0].activities[0].metadata.message).toBe("Finished work")
	})

	it("returns tasks with TASK_CREATED activity", async () => {
		const taskCreatedActivity = Activity.rehydrate({
			id: "activity-1",
			type: ActivityType.TASK_CREATED,
			projectId: "test-project-id",
			taskId: "task-1",
			userId: "user-123",
			metadata: {
				message: "user-123 created task",
				title: "Task 1",
				description: "Description 1",
			},
			occurredAt: "2024-01-01T00:00:00.000Z",
		})

		const mockTasks = [
			Task.rehydrate({
				id: "task-1",
				created: "2024-01-01T00:00:00.000Z",
				projectId: "test-project-id",
				title: "Task 1",
				description: "Description 1",
				status: TaskStatus.TODO,
				updated: null,
				activities: [taskCreatedActivity],
			}),
		]

		const mockUseCase: FetchTasksUseCase = {
			execute: async () => mockTasks,
		}

		handler = createFetchTasksHandler(mockUseCase)

		const event = {
			pathParameters: {
				projectId: "test-project-id",
			},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(200)

		const body = JSON.parse(result.body)

		expect(body[0].activities).toHaveLength(1)
		expect(body[0].activities[0].type).toBe(ActivityType.TASK_CREATED)
		expect(body[0].activities[0].metadata.message).toBe("user-123 created task")
		expect(body[0].activities[0].metadata.title).toBe("Task 1")
		expect(body[0].activities[0].metadata.description).toBe("Description 1")
	})

	it("returns tasks with multiple activities of different types", async () => {
		const taskCreatedActivity = Activity.rehydrate({
			id: "activity-1",
			type: ActivityType.TASK_CREATED,
			projectId: "test-project-id",
			taskId: "task-1",
			userId: "user-123",
			metadata: {
				message: "user-123 created task",
				title: "Task 1",
				description: "Description 1",
			},
			occurredAt: "2024-01-01T00:00:00.000Z",
		})

		const titleUpdatedActivity = Activity.rehydrate({
			id: "activity-2",
			type: ActivityType.TITLE_UPDATED,
			projectId: "test-project-id",
			taskId: "task-1",
			userId: "user-123",
			metadata: {
				message: "user-123 changed title to \"New Title\"",
				oldTitle: "Task 1",
				newTitle: "New Title",
			},
			occurredAt: "2024-01-02T00:00:00.000Z",
		})

		const commentActivity = Activity.rehydrate({
			id: "activity-3",
			type: ActivityType.COMMENT_LEFT,
			projectId: "test-project-id",
			taskId: "task-1",
			userId: "user-456",
			metadata: {
				commentText: "Great progress!",
				authorId: "user-456",
			},
			occurredAt: "2024-01-03T00:00:00.000Z",
		})

		const startedWorkActivity = Activity.rehydrate({
			id: "activity-4",
			type: ActivityType.STARTED_WORK,
			projectId: "test-project-id",
			taskId: "task-1",
			userId: "worker-123",
			metadata: {
				workerId: "worker-123",
				message: "Starting work",
			},
			occurredAt: "2024-01-04T00:00:00.000Z",
		})

		const mockTasks = [
			Task.rehydrate({
				id: "task-1",
				created: "2024-01-01T00:00:00.000Z",
				projectId: "test-project-id",
				title: "New Title",
				description: "Description 1",
				status: TaskStatus.WORK_IN_PROGRESS,
				updated: "2024-01-04T00:00:00.000Z",
				activities: [taskCreatedActivity, titleUpdatedActivity, commentActivity, startedWorkActivity],
			}),
		]

		const mockUseCase: FetchTasksUseCase = {
			execute: async () => mockTasks,
		}

		handler = createFetchTasksHandler(mockUseCase)

		const event = {
			pathParameters: {
				projectId: "test-project-id",
			},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(200)

		const body = JSON.parse(result.body)

		expect(body[0].activities).toHaveLength(4)
		expect(body[0].activities[0].type).toBe(ActivityType.TASK_CREATED)
		expect(body[0].activities[1].type).toBe(ActivityType.TITLE_UPDATED)
		expect(body[0].activities[2].type).toBe(ActivityType.COMMENT_LEFT)
		expect(body[0].activities[3].type).toBe(ActivityType.STARTED_WORK)
	})
})
