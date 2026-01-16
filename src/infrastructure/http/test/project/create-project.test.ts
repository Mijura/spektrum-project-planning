import { APIGatewayProxyEvent } from "aws-lambda"
import { describe, it, expect, beforeEach } from "@rstest/core"
import { CreateProjectUseCase } from "@app/ports/use-cases/project/create-project"
import { createCreateProjectHandler } from "@infra/http/factories/project/create-project"
import { Project } from "@domain/project/project"
import { ProjectStatus } from "@domain/project/project-status"
import { EntryPoint } from "@jigjoy-io/project-deployment-client"

describe("Create Project Handler", () => {
	let handler: (event: APIGatewayProxyEvent) => Promise<any>

	beforeEach(() => {
		// Reset handler before each test
		handler = undefined as any
	})

	it("returns 201 and project data with entryPoint when owner is provided", async () => {
		const mockProject = Project.rehydrate({
			id: "test-project-id",
			ownerId: "owner-123",
			name: "My Project",
			description: "Empty project...",
			created: "2024-01-01T00:00:00.000Z",
			updated: null,
			status: ProjectStatus.ACTIVE,
			detailsUpdated: false,
		})

		const mockEntryPoint: EntryPoint = {
			moduleId: "module-123",
			assetBaseUrl: "https://assets.example.com",
			publicAppUrl: "https://app.example.com",
		}

		const mockUseCase: CreateProjectUseCase = {
			execute: async () => ({
				project: mockProject,
				entryPoint: mockEntryPoint,
			}),
		}

		handler = createCreateProjectHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				owner: "owner-123",
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(201)

		const body = JSON.parse(result.body)

		expect(body.project.id).toBe("test-project-id")
		expect(body.project.ownerId).toBe("owner-123")
		expect(body.project.name).toBe("My Project")
		expect(body.project.description).toBe("Empty project...")
		expect(body.project.status).toBe(ProjectStatus.ACTIVE)
		expect(body.entryPoint.moduleId).toBe("module-123")
		expect(body.entryPoint.assetBaseUrl).toBe("https://assets.example.com")
		expect(body.entryPoint.publicAppUrl).toBe("https://app.example.com")
	})

	it("returns 400 when body is missing", async () => {
		const mockUseCase: CreateProjectUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createCreateProjectHandler(mockUseCase)

		const event = {} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("No page body")
	})

	it("returns 400 when owner is missing from body", async () => {
		const mockUseCase: CreateProjectUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createCreateProjectHandler(mockUseCase)

		const event = {
			body: JSON.stringify({}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Missing path parameter: owner")
	})

	it("returns 500 when an unexpected error is thrown", async () => {
		const mockUseCase: CreateProjectUseCase = {
			execute: async () => {
				throw new Error("Unexpected error")
			},
		}

		handler = createCreateProjectHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				owner: "owner-123",
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(500)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Something went wrong")
	})
})
