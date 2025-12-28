import { CreateProjectDTO } from "@application/dto/create-project"

export interface CreateProject {

    /**
     * Creates a new project.
     * @param owner - The owner of the project.
     * @returns The created CreateProjectDTO object.
     */
    execute(owner: string): Promise<CreateProjectDTO>
}
