import { TaskDTO } from "@application/dto/task"

export interface FetchTasksPort {

    /**
     * Fetches all tasks for a given project ID.
     * @param projectId - The ID of the project to fetch tasks for.
     * @returns A list of TaskDTO objects.
     */
    execute(projectId: string): Promise<TaskDTO[]> 
}

