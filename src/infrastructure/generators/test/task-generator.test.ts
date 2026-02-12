import { describe, it, expect, beforeEach } from "@rstest/core"
import { MosaicTaskGenerator } from "@infra/generators/task-generator"
import { Task } from "@domain/task/task"
import { TaskStatus } from "@jigjoy-ai/task-contracts"

describe("Mosaic Task Generator Integration Tests", () => {
	let generator: MosaicTaskGenerator

	beforeEach(() => {
		generator = new MosaicTaskGenerator()
	})

	it("should generate valid task list with correct structure and format", async () => {
		const projectId = "project-123"
		const projectDescription = "A simple note-taking app"

		const tasks = await generator.generateTaskList(projectId, projectDescription)

		// Validate basic structure
		expect(tasks).toBeDefined()
		expect(Array.isArray(tasks)).toBe(true)
		expect(tasks.length).toBeGreaterThan(0)
		expect(tasks.length).toBeLessThanOrEqual(10) // Reasonable number

		// Validate each task structure
		const taskIds = new Set<string>()
		for (const task of tasks) {
			expect(task).toBeInstanceOf(Task)
			expect(task.id).toBeDefined()
			expect(typeof task.id).toBe("string")
			expect(taskIds.has(task.id)).toBe(false) // Unique IDs
			taskIds.add(task.id)

			expect(task.title).toBeDefined()
			expect(typeof task.title).toBe("string")
			expect(task.title.trim().length).toBeGreaterThan(3) // Meaningful title
			expect(task.title.length).toBeLessThan(200) // Reasonable max length

			expect(task.description).toBeDefined()
			expect(typeof task.description).toBe("string")
			expect(task.description.trim().length).toBeGreaterThan(10) // Meaningful description
			expect(task.description.length).toBeLessThan(1000) // Reasonable max length

			expect(task.projectId).toBe(projectId)
			expect(task.status).toBe(TaskStatus.TODO)
			expect(task.created).toBeDefined()
			expect(typeof task.created).toBe("string")
			const createdDate = new Date(task.created)
			expect(createdDate.getTime()).not.toBeNaN() // Valid ISO timestamp

			// Validate activity logs
			const activityLog = task.getActivityLog()
			expect(activityLog.length).toBeGreaterThan(0) // Should have at least TASK_CREATED
		}
	}, 20_000)

})
