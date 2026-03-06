import { APIGatewayProxyEvent } from "aws-lambda"
import { describe, it, expect, beforeEach } from "@rstest/core"
import { PlanTasksUseCase } from "@app/ports/use-cases/task/plan-tasks"
import { createPlanTasksHandler } from "@infra/http/factories/task/plan-tasks"
import { Task } from "@domain/task/task"
import { TaskStatus } from "@jigjoy-ai/task-contracts"

describe("Plan Tasks Handler", () => {
	let handler: (event: APIGatewayProxyEvent) => Promise<any>

	beforeEach(() => {
		// Reset handler before each test
		handler = undefined as any
	})

	it("returns 200 and array of planned tasks when projectId and projectDescription are provided", async () => {
		const mockTasks = [
			Task.rehydrate({
				id: "task-1",
				created: "2024-01-01T00:00:00.000Z",
				projectId: "test-project-id",
				title: "Planned Task 1",
				description: "Description 1",
				status: TaskStatus.TODO,
				updated: null,
				activities: [],
			}),
			Task.rehydrate({
				id: "task-2",
				created: "2024-01-01T00:00:00.000Z",
				projectId: "test-project-id",
				title: "Planned Task 2",
				description: "Description 2",
				status: TaskStatus.TODO,
				updated: null,
				activities: [],
			}),
		]

		const mockUseCase: PlanTasksUseCase = {
			execute: async () => mockTasks,
		}

		handler = createPlanTasksHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				projectId: "test-project-id",
				projectDescription: "A test project description",
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(200)

		const body = JSON.parse(result.body)

		expect(Array.isArray(body)).toBe(true)
		expect(body.length).toBe(2)
		expect(body[0].id).toBe("task-1")
		expect(body[0].projectId).toBe("test-project-id")
		expect(body[0].title).toBe("Planned Task 1")
		expect(body[1].id).toBe("task-2")
		expect(body[1].title).toBe("Planned Task 2")
	})

	it("returns 200 and empty array when no tasks are planned", async () => {
		const mockUseCase: PlanTasksUseCase = {
			execute: async () => [],
		}

		handler = createPlanTasksHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				projectId: "test-project-id",
				projectDescription: "A test project description",
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(200)

		const body = JSON.parse(result.body)

		expect(Array.isArray(body)).toBe(true)
		expect(body.length).toBe(0)
	})

	it("returns 400 when body is missing", async () => {
		const mockUseCase: PlanTasksUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createPlanTasksHandler(mockUseCase)

		const event = {} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("No request body provided")
	})

	it("returns 500 when an unexpected error is thrown", async () => {
		const mockUseCase: PlanTasksUseCase = {
			execute: async () => {
				throw new Error("Unexpected error")
			},
		}

		handler = createPlanTasksHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				projectId: "test-project-id",
				projectDescription: "A test project description",
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(500)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Something went wrong")
	})
})
