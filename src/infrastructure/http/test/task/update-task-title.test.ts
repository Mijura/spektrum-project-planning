import { APIGatewayProxyEvent } from "aws-lambda"
import { describe, it, expect, beforeEach } from "@rstest/core"
import { UpdateTaskTitleUseCase } from "@app/ports/use-cases/task/update-title"
import { createUpdateTaskTitleHandler } from "@infra/http/factories/task/update-task-title"
import { Task } from "@domain/task/task"
import { TaskStatus } from "@jigjoy-io/task-contracts"

describe("Update Task Title Handler", () => {
	let handler: (event: APIGatewayProxyEvent) => Promise<any>

	beforeEach(() => {
		// Reset handler before each test
		handler = undefined as any
	})

	it("returns 200 and updated task data when task DTO with id and title is provided", async () => {
		const mockTask = Task.rehydrate({
			id: "test-task-id",
			created: "2024-01-01T00:00:00.000Z",
			projectId: "test-project-id",
			title: "Updated Title",
			description: "Test Description",
			status: TaskStatus.TODO,
			updated: "2024-01-02T00:00:00.000Z",
			activities: [],
		})

		const mockUseCase: UpdateTaskTitleUseCase = {
			execute: async () => mockTask,
		}

		handler = createUpdateTaskTitleHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				id: "test-task-id",
				title: "Updated Title",
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(200)

		const body = JSON.parse(result.body)

		expect(body.id).toBe("test-task-id")
		expect(body.projectId).toBe("test-project-id")
		expect(body.title).toBe("Updated Title")
		expect(body.description).toBe("Test Description")
		expect(body.status).toBe(TaskStatus.TODO)
	})

	it("returns 400 when body is missing", async () => {
		const mockUseCase: UpdateTaskTitleUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createUpdateTaskTitleHandler(mockUseCase)

		const event = {} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("No page body")
	})

	it("returns 500 when an unexpected error is thrown", async () => {
		const mockUseCase: UpdateTaskTitleUseCase = {
			execute: async () => {
				throw new Error("Unexpected error")
			},
		}

		handler = createUpdateTaskTitleHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				id: "test-task-id",
				title: "Updated Title",
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(500)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Something went wrong")
	})
})
