import { Task } from "@domain/task/task"

export interface UpdateTaskDescriptionPort {
	/**
	 * Updates the description of a task.
	 * @param taskId - The ID of the task to update.
	 * @param newDescription - The new description of the task.
	 * @returns The updated Task object.
	 */
	execute(taskId: string, newDescription: string): Promise<Task>
}
