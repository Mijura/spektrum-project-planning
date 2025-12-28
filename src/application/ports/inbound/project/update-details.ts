import { ProjectDTO } from "@application/dto/project"
import { ProjectDetailsDTO } from "@application/dto/project-details"

export interface UpdateProjectDetails {

    /**
     * Updates the details of a project.
     * @param projectId - The ID of the project to update.
     * @param name - The new name of the project.
     * @param description - The new description of the project.
     * @returns The updated ProjectDTO object.
     */
    execute(projectId: string, projectDetails: ProjectDetailsDTO): Promise<ProjectDTO>
} 