
import { TaskDTO } from "@application/dto/task"

export interface CreateTask {

    /**
     * Creates a new task.
     * @param projectId - The ID of the project to create the task for.
     * @param title - The title of the task.
     * @param description - The description of the task.
     * @returns The created TaskDTO object.
     */
    execute(projectId: string, title: string, description: string): Promise<TaskDTO>
}
