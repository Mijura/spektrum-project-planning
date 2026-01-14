import { Task } from "@domain/task/task"

export interface FetchTasksUseCase {
	/**
	 * Fetches all tasks for a given project ID.
	 * @param projectId - The ID of the project to fetch tasks for.
	 * @returns A list of Task objects.
	 */
	execute(projectId: string): Promise<Task[]>
}
