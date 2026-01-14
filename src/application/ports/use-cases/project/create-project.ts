import { Project } from "@domain/project/project"

export interface CreateProjectUseCase {
	/**
	 * Creates a new project.
	 * @param owner - The owner of the project.
	 * @returns The created project and entry point.
	 */
	execute(owner: string): Promise<{ project: Project; entryPoint: EntryPoint }>
}
