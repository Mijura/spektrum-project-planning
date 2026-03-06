import { TaskRepository } from "@app/ports/repositories/task-repository"
import { Task } from "@domain/task/task"

export class InMemoryTaskRepository implements TaskRepository {
	private storage: Map<string, Task> = new Map()

	async save(task: Task): Promise<Task> {
		this.storage.set(task.id, task)
		return task
	}

	async get(taskId: string): Promise<Task | null> {
		const task = this.storage.get(taskId)
		return task ?? null
	}

	async getAll(projectId: string): Promise<Task[]> {
		return Array.from(this.storage.values()).filter((t) => t.projectId === projectId)
	}
}
