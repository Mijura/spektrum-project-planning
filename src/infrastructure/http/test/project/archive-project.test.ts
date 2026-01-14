import { APIGatewayProxyEvent } from "aws-lambda"
import { describe, it, expect, beforeEach } from "@rstest/core"
import { ArchiveProjectUseCase } from "@app/ports/use-cases/project/archive-project"
import { createArchiveProjectHandler } from "@infra/http/factories/project/archive-project"
import { Project } from "@domain/project/project"
import { ProjectStatus } from "@domain/project/project-status"

describe("Archive Project Handler", () => {
	let handler: (event: APIGatewayProxyEvent) => Promise<any>

	beforeEach(() => {
		// Reset handler before each test
		handler = undefined as any
	})

	it("returns 200 and archived project data when projectId is provided", async () => {
		const mockProject = Project.rehydrate({
			id: "test-project-id",
			ownerId: "owner-123",
			name: "Test Project",
			description: "Test Description",
			created: "2024-01-01T00:00:00.000Z",
			updated: null,
			status: ProjectStatus.ARCHIVED,
			detailsUpdated: false,
		})

		const mockUseCase: ArchiveProjectUseCase = {
			execute: async () => mockProject,
		}

		handler = createArchiveProjectHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				projectId: "test-project-id",
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(200)

		const body = JSON.parse(result.body)

		expect(body.id).toBe("test-project-id")
		expect(body.ownerId).toBe("owner-123")
		expect(body.name).toBe("Test Project")
		expect(body.description).toBe("Test Description")
		expect(body.status).toBe(ProjectStatus.ARCHIVED)
	})

	it("returns 400 when body is missing", async () => {
		const mockUseCase: ArchiveProjectUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createArchiveProjectHandler(mockUseCase)

		const event = {} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("No page body")
	})

	it("returns 400 when projectId is missing from body", async () => {
		const mockUseCase: ArchiveProjectUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createArchiveProjectHandler(mockUseCase)

		const event = {
			body: JSON.stringify({}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Missing path parameter: projectId")
	})

	it("returns 500 when an unexpected error is thrown", async () => {
		const mockUseCase: ArchiveProjectUseCase = {
			execute: async () => {
				throw new Error("Unexpected error")
			},
		}

		handler = createArchiveProjectHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				projectId: "test-project-id",
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(500)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Something went wrong")
	})
})
