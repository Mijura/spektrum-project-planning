import { describe, it, expect, beforeAll } from "@rstest/core"
import { JigJoyAICodingService } from "@infra/services/ai-coding-service"

describe("JigJoyAICodingService Integration Tests", () => {
	let service: JigJoyAICodingService
	const testProjectId = `test-project-${Date.now()}`

	beforeAll(() => {
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
