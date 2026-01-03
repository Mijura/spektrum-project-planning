import { Task } from "@domain/task/task"

export interface PlanTasksPort {

    /**
     * Plans tasks with AI for a given project.
     * @param projectId - The ID of the project to plan tasks for.
     * @param projectDescription - The description of the project to plan tasks for.
     * @returns A list of Task objects.
     */
    execute(projectId: string, projectDescription: string): Promise<Task[]>
}