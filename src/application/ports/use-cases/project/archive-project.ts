import { ProjectDTO } from "@app/dto/project"

export interface ArchiveProjectPort {

    /**
     * Archives a project.
     * @param projectId - The ID of the project to archive.
     * @returns The archived ProjectDTO object.
     */
    execute(projectId: string): Promise<ProjectDTO>
}
