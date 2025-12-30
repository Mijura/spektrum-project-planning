import { ProjectDTO } from "@app/dto/project"

export interface FetchProjectsPort {

    /**
     * Fetches all projects for a given owner ID.
     * @param ownerId - The ID of the owner to fetch projects for.
     * @returns A list of ProjectDTO objects.
     */
    execute(ownerId: string): Promise<ProjectDTO[]> 
}

