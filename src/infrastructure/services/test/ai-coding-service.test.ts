import { describe, it, expect, beforeAll } from "@rstest/core"
import { JigJoyAICodingService } from "@infra/services/ai-coding-service"

describe("JigJoyAICodingService Integration Tests", () => {
	let service: JigJoyAICodingService
	const testProjectId = `test-project-${Date.now()}`

	beforeAll(() => {
		// Ensure the endpoint is configured
		if (!process.env.AI_CODING_ENDPOINT) {
			throw new Error("AI_CODING_ENDPOINT environment variable is not set")
		}
		service = new JigJoyAICodingService()
	})

	it("should initialize a React module for a project", async () => {
		const projectId = `${testProjectId}-init`

		const module = await service.initializeReactModule(projectId)

		expect(module).toBeDefined()
		expect(module.id).toBeDefined()
		expect(typeof module.id).toBe("string")
		expect(module.id.length).toBeGreaterThan(0)
		expect(module.repositoryId).toBeDefined()
		expect(typeof module.repositoryId).toBe("string")
		expect(module.repositoryId.length).toBeGreaterThan(0)
		expect(module.type).toBe("FRONTEND")
	}, 10_000)

})
