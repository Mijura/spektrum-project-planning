import { ProjectDTO } from "@application/dto/project"

export interface FetchProjects {

    /**
     * Fetches all projects for a given owner ID.
     * @param ownerId - The ID of the owner to fetch projects for.
     * @returns A list of ProjectDTO objects.
     */
    execute(ownerId: string): Promise<ProjectDTO[]> 
}

