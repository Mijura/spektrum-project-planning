import { CreateProjectResponseDTO } from "@app/dto/create-project-response"

export interface CreateProjectPort {

    /**
     * Creates a new project.
     * @param owner - The owner of the project.
     * @returns The created CreateProjectDTO object.
     */
    execute(owner: string): Promise<CreateProjectResponseDTO>
}
