import { ProjectDTO } from "@application/dto/project"
import { ProjectDetails } from "@domain/value-objects/project"

export interface UpdateProjectDetails {

    /**
     * Updates the details of a project.
     * @param projectId - The ID of the project to update.
     * @param name - The new name of the project.
     * @param description - The new description of the project.
     * @returns The updated ProjectDTO object.
     */
    execute(projectId: string, projectDetails: ProjectDetails): Promise<ProjectDTO>
} 