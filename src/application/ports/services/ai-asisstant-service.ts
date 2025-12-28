import { Task } from "@domain/task/task"

export interface AIAssistantServicePort {
    /**
     * Updates the project details for a given project
     * @param task The task to update the project details for
     * @returns The updated project details
     */
    updateProjectDetails(task: Task): Promise<void>

    /**
     * Plans tasks for a given project
     * @param task The task to plan tasks for
     * @returns The planned tasks
     */
    planTasks(task: Task): Promise<Task[]>
}