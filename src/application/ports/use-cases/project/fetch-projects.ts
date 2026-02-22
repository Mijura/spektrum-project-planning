import { Project } from "@domain/project/project"
import { AuthContext } from "@heksagon/app"

export interface FetchProjectsUseCase {
	/**
	 * Fetches all projects for the authenticated user.
	 * @param authContext - The authentication context.
	 * @returns A list of Project objects.
	 */
	execute(authContext: AuthContext): Promise<Project[]>
}
