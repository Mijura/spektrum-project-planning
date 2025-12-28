import { TaskDTO } from "@application/dto/task"

export interface PlanTasksWithAI {

    /**
     * Plans tasks with AI for a given project.
     * @param projectId - The ID of the project to plan tasks for.
     * @param projectDescription - The description of the project to plan tasks for.
     * @returns A list of TaskDTO objects.
     */
    execute(projectId: string, projectDescription: string): Promise<TaskDTO[]>
}