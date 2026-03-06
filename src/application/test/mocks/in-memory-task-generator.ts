import { TaskGenerator } from "@app/ports/generators/task-generator"
import { Task } from "@domain/task/task"

export class InMemoryTaskGenerator implements TaskGenerator {
	private byProjectId: Map<string, Task[]> = new Map()
	private defaultTasks: Task[] = []

	/**
	 * Provide deterministic output for a given projectId.
	 */
	seed(projectId: string, tasks: Task[]) {
		this.byProjectId.set(projectId, tasks)
	}

	/**
	 * Provide fallback output when no project-specific value is seeded.
	 */
	setDefault(tasks: Task[]) {
		this.defaultTasks = tasks
	}

	async generateTaskList(projectId: string, _projectDescription: string): Promise<Task[]> {
		return this.byProjectId.get(projectId) ?? this.defaultTasks
	}
}
