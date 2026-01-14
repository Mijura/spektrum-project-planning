import { Project } from "@domain/project/project"

export interface UpdateProjectDetailsUseCase {
	/**
	 * Updates the details of a project.
	 * @param projectId - The ID of the project to update.
	 * @param name - The new name of the project.
	 * @param description - The new description of the project.
	 * @returns The updated Project object.
	 */
	execute(projectId: string, newName: string, newDescription: string): Promise<Project>
}
