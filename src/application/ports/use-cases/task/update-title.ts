import { Task } from "@domain/task/task"

export interface UpdateTaskTitlePort {
	/**
	 * Updates the title of a task.
	 * @param taskId - The ID of the task to update.
	 * @param newTitle - The new title of the task.
	 * @returns The updated Task object.
	 */
	execute(taskId: string, newTitle: string): Promise<Task>
}
