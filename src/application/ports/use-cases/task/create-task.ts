import { Task } from "@domain/task/task"

export interface CreateTaskPort {
	/**
	 * Creates a new task.
	 * @param projectId - The ID of the project to create the task for.
	 * @param title - The title of the task.
	 * @param description - The description of the task.
	 * @returns The created Task object.
	 */
	execute(projectId: string, title: string, description: string): Promise<Task>
}
