import { APIGatewayProxyEvent } from "aws-lambda"
import { describe, it, expect, beforeEach } from "@rstest/core"
import { FetchTasksUseCase } from "@app/ports/use-cases/task/fetch-tasks"
import { createFetchTasksHandler } from "@infra/http/factories/task/fetch-tasks"
import { Task } from "@domain/task/task"
import { TaskStatus } from "@jigjoy-io/task-contracts"

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
})
