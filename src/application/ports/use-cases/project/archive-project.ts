import { Project } from "@domain/project/project"

export interface ArchiveProjectPort {

    /**
     * Archives a project.
     * @param projectId - The ID of the project to archive.
     * @returns The archived Project object.
     */
    execute(projectId: string): Promise<Project>
}
