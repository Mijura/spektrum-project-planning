import { Project } from "@domain/project/project"

export interface FetchProjectPort {
	/**
	 * Fetches a project by its ID.
	 * @param projectId - The ID of the project to fetch.
	 * @returns The fetched Project object.
	 */
	execute(projectId: string): Promise<Project>
}
