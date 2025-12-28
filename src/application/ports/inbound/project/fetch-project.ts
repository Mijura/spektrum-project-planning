import { ProjectDTO } from "@application/dto/project"

export interface FetchProject {

    /**
     * Fetches a project by its ID.
     * @param projectId - The ID of the project to fetch.
     * @returns The fetched ProjectDTO object.
     */
    execute(projectId: string): Promise<ProjectDTO> 
}

