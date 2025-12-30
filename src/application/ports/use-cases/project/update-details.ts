import { ProjectDTO } from "@app/dto/project"
import { ProjectDetailsDTO } from "@app/dto/project-details"

export interface UpdateProjectDetailsPort {

    /**
     * Updates the details of a project.
     * @param projectId - The ID of the project to update.
     * @param name - The new name of the project.
     * @param description - The new description of the project.
     * @returns The updated ProjectDTO object.
     */
    execute(projectId: string, projectDetails: ProjectDetailsDTO): Promise<ProjectDTO>
} 