import { Project } from "@domain/project/project"

export interface FetchProjectsUseCase {
	/**
	 * Fetches all projects for a given owner ID.
	 * @param ownerId - The ID of the owner to fetch projects for.
	 * @returns A list of Project objects.
	 */
	execute(ownerId: string): Promise<Project[]>
}
