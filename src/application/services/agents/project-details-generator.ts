import { ProjectDetailsDTO } from "@application/dto/project-details"
import { Task } from "@domain/task/task"

export interface ProjectDetailsGeneratorPort {
    /**
     * Generates project details for a given project
     * @param task The task to generate project details for
     * @returns The generated project details
     */
    generateProjectDetails(task: Task): Promise<ProjectDetailsDTO>
}