import { APIGatewayProxyEvent } from "aws-lambda"
import { describe, it, expect, beforeEach } from "@rstest/core"
import { CreateTaskUseCase } from "@app/ports/use-cases/task/create-task"
import { createCreateTaskHandler } from "@infra/http/factories/task/create-task"
import { Task } from "@domain/task/task"
import { TaskStatus } from "@jigjoy-ai/task-contracts"

describe("Create Task Handler", () => {
	let handler: (event: APIGatewayProxyEvent) => Promise<any>

	beforeEach(() => {
		// Reset handler before each test
		handler = undefined as any
	})

	it("returns 201 and task data when projectId, title, and description are provided", async () => {
		const mockTask = Task.rehydrate({
			id: "test-task-id",
			created: "2024-01-01T00:00:00.000Z",
			projectId: "test-project-id",
			title: "Test Task",
			description: "Test Description",
			status: TaskStatus.TODO,
			updated: null,
			activities: [],
		})

		const mockUseCase: CreateTaskUseCase = {
			execute: async () => mockTask,
		}

		handler = createCreateTaskHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				projectId: "test-project-id",
				title: "Test Task",
				description: "Test Description",
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(201)

		const body = JSON.parse(result.body)

		expect(body.id).toBe("test-task-id")
		expect(body.projectId).toBe("test-project-id")
		expect(body.title).toBe("Test Task")
		expect(body.description).toBe("Test Description")
		expect(body.status).toBe(TaskStatus.TODO)
	})

	it("returns 400 when body is missing", async () => {
		const mockUseCase: CreateTaskUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createCreateTaskHandler(mockUseCase)

		const event = {} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("No page body")
	})

	it("returns 500 when an unexpected error is thrown", async () => {
		const mockUseCase: CreateTaskUseCase = {
			execute: async () => {
				throw new Error("Unexpected error")
			},
		}

		handler = createCreateTaskHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				projectId: "test-project-id",
				title: "Test Task",
				description: "Test Description",
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(500)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Something went wrong")
	})
})
