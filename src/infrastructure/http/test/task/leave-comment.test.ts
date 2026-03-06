import { APIGatewayProxyEvent } from "aws-lambda"
import { describe, it, expect, beforeEach } from "@rstest/core"
import { LeaveCommentUseCase } from "@app/ports/use-cases/task/leave-comment"
import { createLeaveCommentHandler } from "@infra/http/factories/task/leave-comment"
import { Task } from "@domain/task/task"
import { TaskStatus } from "@jigjoy-ai/task-contracts"

describe("Leave Comment Handler", () => {
	let handler: (event: APIGatewayProxyEvent) => Promise<any>

	beforeEach(() => {
		// Reset handler before each test
		handler = undefined as any
	})

	it("returns 200 and task data with comment when taskId, commentText, and authorId are provided", async () => {
		const mockTask = Task.rehydrate({
			id: "test-task-id",
			created: "2024-01-01T00:00:00.000Z",
			projectId: "test-project-id",
			title: "Test Task",
			description: "Test Description",
			status: TaskStatus.TODO,
			updated: "2024-01-02T00:00:00.000Z",
			activities: [],
		})

		const mockUseCase: LeaveCommentUseCase = {
			execute: async () => mockTask,
		}

		handler = createLeaveCommentHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				taskId: "test-task-id",
				commentText: "This is a comment",
				authorId: "author-123",
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(200)

		const body = JSON.parse(result.body)

		expect(body.id).toBe("test-task-id")
		expect(body.projectId).toBe("test-project-id")
		expect(body.title).toBe("Test Task")
		expect(body.description).toBe("Test Description")
	})

	it("returns 400 when body is missing", async () => {
		const mockUseCase: LeaveCommentUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createLeaveCommentHandler(mockUseCase)

		const event = {} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("No request body provided")
	})

	it("returns 500 when an unexpected error is thrown", async () => {
		const mockUseCase: LeaveCommentUseCase = {
			execute: async () => {
				throw new Error("Unexpected error")
			},
		}

		handler = createLeaveCommentHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				taskId: "test-task-id",
				commentText: "This is a comment",
				authorId: "author-123",
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(500)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Something went wrong")
	})
})
