import { ProjectDetailsGenerator } from "@app/ports/generators/project-details-generator"
import { Task } from "@domain/task/task"

export class InMemoryProjectDetailsGenerator implements ProjectDetailsGenerator {
	private byTaskId: Map<string, ProjectDetails> = new Map()
	private defaultDetails: ProjectDetails = {
		name: "Default Project Name",
		description: "Default project description.",
	}

	/**
	 * Provide deterministic output for a specific task.
	 */
	seed(taskId: string, details: ProjectDetails) {
		this.byTaskId.set(taskId, details)
	}

	/**
	 * Provide fallback output when no task-specific value is seeded.
	 */
	setDefault(details: ProjectDetails) {
		this.defaultDetails = details
	}

	async generateProjectDetails(task: Task): Promise<ProjectDetails> {
		return this.byTaskId.get(task.id) ?? this.defaultDetails
	}
}
