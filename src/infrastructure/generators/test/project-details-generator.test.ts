import { describe, it, expect, beforeEach } from "@rstest/core"
import { MosaicProjectDetailsGenerator } from "@infra/generators/project-details-generator"
import { Task } from "@domain/task/task"

describe("Mosaic Project Details Generator Integration Tests", () => {
	let generator: MosaicProjectDetailsGenerator

	beforeEach(() => {
		generator = new MosaicProjectDetailsGenerator()
	})

	it("should generate valid project details with correct structure and format", async () => {
		const task = Task.create("user-123", "project-456", "Create a note-taking app", "Build a simple app to take notes")

		const projectDetails = await generator.generateProjectDetails(task)

		// Validate structure
		expect(projectDetails).toBeDefined()
		expect(projectDetails).toHaveProperty("name")
		expect(projectDetails).toHaveProperty("description")
		expect(Object.keys(projectDetails).length).toBe(2)

		// Validate format
		expect(typeof projectDetails.name).toBe("string")
		expect(typeof projectDetails.description).toBe("string")
		expect(projectDetails.name.length).toBeGreaterThan(0)
		expect(projectDetails.description.length).toBeGreaterThan(0)

		// Validate reasonable length
		expect(projectDetails.name.length).toBeLessThan(200)
		expect(projectDetails.description.length).toBeLessThan(500)
	})

	it("should handle edge cases - minimal and complex task information", async () => {
		// Test minimal information
		const minimalTask = Task.create("user-123", "project-456", "App", "App description")
		const minimalDetails = await generator.generateProjectDetails(minimalTask)

		expect(minimalDetails).toBeDefined()
		expect(minimalDetails.name.length).toBeGreaterThan(0)
		expect(minimalDetails.description.length).toBeGreaterThan(0)

		// Test complex information
		const complexTask = Task.create(
			"user-123",
			"project-789",
			"Complex enterprise application",
			"Build a complex enterprise application with multiple modules, user management, reporting, and analytics",
		)
		const complexDetails = await generator.generateProjectDetails(complexTask)

		expect(complexDetails).toBeDefined()
		expect(complexDetails.name.length).toBeGreaterThan(0)
		expect(complexDetails.description.length).toBeGreaterThan(0)
		expect(complexDetails.name.length).toBeLessThan(200)
		expect(complexDetails.description.length).toBeLessThan(500)
	})
})
