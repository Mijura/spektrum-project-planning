import { Project } from "@domain/project/project"
import { Task } from "@domain/task/task"

export interface AIAssistantServicePort {
    /**
     * Updates the project details for a given project and saves project to the database
     * @param task The task to update the project details for
     * @returns The updated project
     */
    updateProjectDetails(task: Task): Promise<Project>

    /**
     * Plans tasks for a given project and saves them to the database
     * @param task The task to plan tasks for
     * @returns The planned tasks
     */
    planTasks(task: Task): Promise<Task[]>
}