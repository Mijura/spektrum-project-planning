import { APIGatewayProxyEvent } from "aws-lambda"
import { describe, it, expect, beforeEach } from "@rstest/core"
import { UpdateTaskDescriptionUseCase } from "@app/ports/use-cases/task/update-description"
import { createUpdateTaskDescriptionHandler } from "@infra/http/factories/task/update-task-description"
import { Task } from "@domain/task/task"
import { TaskStatus } from "@jigjoy-ai/task-contracts"

describe("Update Task Description Handler", () => {
	let handler: (event: APIGatewayProxyEvent) => Promise<any>

	beforeEach(() => {
		// Reset handler before each test
		handler = undefined as any
	})

	it("returns 200 and updated task data when task DTO with id and description is provided", async () => {
		const mockTask = Task.rehydrate({
			id: "test-task-id",
			created: "2024-01-01T00:00:00.000Z",
			projectId: "test-project-id",
			title: "Test Task",
			description: "Updated Description",
			status: TaskStatus.TODO,
			updated: "2024-01-02T00:00:00.000Z",
			activities: [],
		})

		const mockUseCase: UpdateTaskDescriptionUseCase = {
			execute: async () => mockTask,
		}

		handler = createUpdateTaskDescriptionHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				id: "test-task-id",
				description: "Updated Description",
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(200)

		const body = JSON.parse(result.body)

		expect(body.id).toBe("test-task-id")
		expect(body.projectId).toBe("test-project-id")
		expect(body.title).toBe("Test Task")
		expect(body.description).toBe("Updated Description")
		expect(body.status).toBe(TaskStatus.TODO)
	})

	it("returns 400 when body is missing", async () => {
		const mockUseCase: UpdateTaskDescriptionUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createUpdateTaskDescriptionHandler(mockUseCase)

		const event = {} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("No page body")
	})

	it("returns 500 when an unexpected error is thrown", async () => {
		const mockUseCase: UpdateTaskDescriptionUseCase = {
			execute: async () => {
				throw new Error("Unexpected error")
			},
		}

		handler = createUpdateTaskDescriptionHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				id: "test-task-id",
				description: "Updated Description",
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(500)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Something went wrong")
	})
})
