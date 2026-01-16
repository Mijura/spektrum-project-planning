import { APIGatewayProxyEvent } from "aws-lambda"
import { describe, it, expect, beforeEach } from "@rstest/core"
import { FetchProjectUseCase } from "@app/ports/use-cases/project/fetch-project"
import { createFetchProjectHandler } from "@infra/http/factories/project/fetch-project"
import { Project } from "@domain/project/project"
import { ProjectStatus } from "@domain/project/project-status"

describe("Fetch Project Handler", () => {
	let handler: (event: APIGatewayProxyEvent) => Promise<any>

	beforeEach(() => {
		// Reset handler before each test
		handler = undefined as any
	})

	it("returns 200 and project data when projectId is provided", async () => {
		const mockProject = Project.rehydrate({
			id: "test-project-id",
			ownerId: "owner-123",
			name: "Test Project",
			description: "Test Description",
			created: "2024-01-01T00:00:00.000Z",
			updated: null,
			status: ProjectStatus.ACTIVE,
			detailsUpdated: false,
		})

		const mockUseCase: FetchProjectUseCase = {
			execute: async () => mockProject,
		}

		handler = createFetchProjectHandler(mockUseCase)

		const event = {
			pathParameters: {
				projectId: "test-project-id",
			},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(200)

		const body = JSON.parse(result.body)

		expect(body.id).toBe("test-project-id")
		expect(body.ownerId).toBe("owner-123")
		expect(body.name).toBe("Test Project")
		expect(body.description).toBe("Test Description")
		expect(body.status).toBe(ProjectStatus.ACTIVE)
	})

	it("returns 400 when projectId is missing", async () => {
		const mockUseCase: FetchProjectUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createFetchProjectHandler(mockUseCase)

		const event = {
			pathParameters: {},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Missing path parameter: projectId")
	})

	it("returns 400 when pathParameters is undefined", async () => {
		const mockUseCase: FetchProjectUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createFetchProjectHandler(mockUseCase)

		const event = {} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Missing path parameter: projectId")
	})

	it("returns 500 when an unexpected error is thrown", async () => {
		const mockUseCase: FetchProjectUseCase = {
			execute: async () => {
				throw new Error("Unexpected error")
			},
		}

		handler = createFetchProjectHandler(mockUseCase)

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
