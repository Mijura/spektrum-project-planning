import { APIGatewayProxyEvent } from "aws-lambda"
import { describe, it, expect, beforeEach } from "@rstest/core"
import { UpdateProjectDetailsUseCase } from "@app/ports/use-cases/project/update-details"
import { createUpdateProjectDetailsHandler } from "@infra/http/factories/project/update-project-details"
import { Project } from "@domain/project/project"
import { ProjectStatus } from "@domain/project/project-status"

describe("Update Project Details Handler", () => {
	let handler: (event: APIGatewayProxyEvent) => Promise<any>

	beforeEach(() => {
		// Reset handler before each test
		handler = undefined as any
	})

	it("returns 200 and updated project data when id, name, and description are provided", async () => {
		const mockProject = Project.rehydrate({
			id: "test-project-id",
			ownerId: "owner-123",
			name: "Updated Name",
			description: "Updated Description",
			created: "2024-01-01T00:00:00.000Z",
			updated: "2024-01-02T00:00:00.000Z",
			status: ProjectStatus.ACTIVE,
			detailsUpdated: false,
		})

		const mockUseCase: UpdateProjectDetailsUseCase = {
			execute: async () => mockProject,
		}

		handler = createUpdateProjectDetailsHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				id: "test-project-id",
				name: "Updated Name",
				description: "Updated Description",
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(200)

		const body = JSON.parse(result.body)

		expect(body.id).toBe("test-project-id")
		expect(body.ownerId).toBe("owner-123")
		expect(body.name).toBe("Updated Name")
		expect(body.description).toBe("Updated Description")
		expect(body.status).toBe(ProjectStatus.ACTIVE)
	})

	it("returns 400 when body is missing", async () => {
		const mockUseCase: UpdateProjectDetailsUseCase = {
			execute: async () => {
				throw new Error("Should not be called")
			},
		}

		handler = createUpdateProjectDetailsHandler(mockUseCase)

		const event = {} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(400)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("No page body")
	})

	it("returns 500 when an unexpected error is thrown", async () => {
		const mockUseCase: UpdateProjectDetailsUseCase = {
			execute: async () => {
				throw new Error("Unexpected error")
			},
		}

		handler = createUpdateProjectDetailsHandler(mockUseCase)

		const event = {
			body: JSON.stringify({
				id: "test-project-id",
				name: "Updated Name",
				description: "Updated Description",
			}),
		} as unknown as APIGatewayProxyEvent

		const result = await handler(event)

		expect(result.statusCode).toBe(500)

		const body = JSON.parse(result.body)

		expect(body.errorMessage).toBe("Something went wrong")
	})
})
