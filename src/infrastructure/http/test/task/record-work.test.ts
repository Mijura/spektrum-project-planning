import { APIGatewayProxyEvent } from "aws-lambda"
import { describe, it, expect, beforeEach } from "@rstest/core"
import { RecordWorkUseCase } from "@app/ports/use-cases/task/record-work"
import { createRecordWorkHandler } from "@infra/http/factories/task/record-work"
import { Task } from "@domain/task/task"
import { TaskStatus, ActivityType } from "@jigjoy-io/task-contracts"

describe("Record Work Handler", () => {
	let handler: (event: APIGatewayProxyEvent) => Promise<any>

	beforeEach(() => {
		// Reset handler before each test
		handler = undefined as any
	})

	it("returns 200 and task data when taskId, workerId, message, and type STARTED_WORK are provided", async () => {
		const mockTask = Task.rehydrate({
			id: "test-task-id",
			created: "2024-01-01T00:00:00.000Z",
			projectId: "test-project-id",
			title: "Test Task",
			description: "Test Description",
			status: TaskStatus.WORK_IN_PROGRESS,
			updated: "2024-01-02T00:00:00.000Z",
			activities: [],
		})

		const mockUseCase: RecordWorkUseCase = {
			execute: async () => mockTask,
		}

		handler = createRecordWorkHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				taskId: "test-task-id",
				workerId: "worker-123",
				message: "Starting work",
				type: ActivityType.STARTED_WORK,
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(200)

		const body = JSON.parse(result.body)

		expect(body.id).toBe("test-task-id")
		expect(body.projectId).toBe("test-project-id")
		expect(body.title).toBe("Test Task")
		expect(body.status).toBe(TaskStatus.WORK_IN_PROGRESS)
	})

	it("returns 200 and task data when taskId, workerId, message, and type FINISHED_WORK are provided", async () => {
		const mockTask = Task.rehydrate({
			id: "test-task-id",
			created: "2024-01-01T00:00:00.000Z",
			projectId: "test-project-id",
			title: "Test Task",
			description: "Test Description",
			status: TaskStatus.DONE,
			updated: "2024-01-02T00:00:00.000Z",
			activities: [],
		})

		const mockUseCase: RecordWorkUseCase = {
			execute: async () => mockTask,
		}

		handler = createRecordWorkHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				taskId: "test-task-id",
				workerId: "worker-123",
				message: "Finished work",
				type: ActivityType.FINISHED_WORK,
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(200)

		const body = JSON.parse(result.body)

		expect(body.id).toBe("test-task-id")
		expect(body.projectId).toBe("test-project-id")
		expect(body.title).toBe("Test Task")
		expect(body.status).toBe(TaskStatus.DONE)
	})

	it("returns 400 when body is missing", async () => {
		const mockUseCase: RecordWorkUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createRecordWorkHandler(mockUseCase)

		const event = {} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("No request body provided")
	})

	it("returns 500 when an unexpected error is thrown", async () => {
		const mockUseCase: RecordWorkUseCase = {
			execute: async () => {
				throw new Error("Unexpected error")
			},
		}

		handler = createRecordWorkHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				taskId: "test-task-id",
				workerId: "worker-123",
				message: "Starting work",
				type: ActivityType.STARTED_WORK,
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(500)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Something went wrong")
	})
})
