import { ProjectDTO } from "@application/dto/project"

export interface ArchiveProject {

    /**
     * Archives a project.
     * @param projectId - The ID of the project to archive.
     * @returns The archived ProjectDTO object.
     */
    execute(projectId: string): Promise<ProjectDTO>
}
