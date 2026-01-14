import { APIGatewayProxyEvent } from "aws-lambda"
import { describe, it, expect, beforeEach } from "@rstest/core"
import { FetchProjectsUseCase } from "@app/ports/use-cases/project/fetch-projects"
import { createFetchProjectsHandler } from "@infra/http/factories/project/fetch-projects"
import { Project } from "@domain/project/project"
import { ProjectStatus } from "@domain/project/project-status"

describe("Fetch Projects Handler", () => {
	let handler: (event: APIGatewayProxyEvent) => Promise<any>

	beforeEach(() => {
		// Reset handler before each test
		handler = undefined as any
	})

	it("returns 200 and array of projects when ownerId is provided", async () => {
		const mockProjects = [
			Project.rehydrate({
				id: "project-1",
				ownerId: "owner-123",
				name: "Project 1",
				description: "Description 1",
				created: "2024-01-01T00:00:00.000Z",
				updated: null,
				status: ProjectStatus.ACTIVE,
				detailsUpdated: false,
			}),
			Project.rehydrate({
				id: "project-2",
				ownerId: "owner-123",
				name: "Project 2",
				description: "Description 2",
				created: "2024-01-02T00:00:00.000Z",
				updated: null,
				status: ProjectStatus.ARCHIVED,
				detailsUpdated: false,
			}),
		]

		const mockUseCase: FetchProjectsUseCase = {
			execute: async () => mockProjects,
		}

		handler = createFetchProjectsHandler(mockUseCase)

		const event = {
			pathParameters: {
				ownerId: "owner-123",
			},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(200)

		const body = JSON.parse(result.body)

		expect(Array.isArray(body)).toBe(true)
		expect(body.length).toBe(2)
		expect(body[0].id).toBe("project-1")
		expect(body[0].ownerId).toBe("owner-123")
		expect(body[0].name).toBe("Project 1")
		expect(body[0].status).toBe(ProjectStatus.ACTIVE)
		expect(body[1].id).toBe("project-2")
		expect(body[1].ownerId).toBe("owner-123")
		expect(body[1].name).toBe("Project 2")
		expect(body[1].status).toBe(ProjectStatus.ARCHIVED)
	})

	it("returns 200 and empty array when owner has no projects", async () => {
		const mockUseCase: FetchProjectsUseCase = {
			execute: async () => [],
		}

		handler = createFetchProjectsHandler(mockUseCase)

		const event = {
			pathParameters: {
				ownerId: "owner-123",
			},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(200)

		const body = JSON.parse(result.body)

		expect(Array.isArray(body)).toBe(true)
		expect(body.length).toBe(0)
	})

	it("returns 400 when ownerId is missing", async () => {
		const mockUseCase: FetchProjectsUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createFetchProjectsHandler(mockUseCase)

		const event = {
			pathParameters: {},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Missing path parameter: ownerId")
	})

	it("returns 400 when pathParameters is undefined", async () => {
		const mockUseCase: FetchProjectsUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createFetchProjectsHandler(mockUseCase)

		const event = {} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Missing path parameter: ownerId")
	})

	it("returns 500 when an unexpected error is thrown", async () => {
		const mockUseCase: FetchProjectsUseCase = {
			execute: async () => {
				throw new Error("Unexpected error")
			},
		}

		handler = createFetchProjectsHandler(mockUseCase)

		const event = {
			pathParameters: {
				ownerId: "owner-123",
			},
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(500)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Something went wrong")
	})
})
