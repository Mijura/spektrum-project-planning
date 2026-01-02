import { EntryPointDTO } from "./entry-point"
import { ProjectDTO } from "./project"

export type CreateProjectResponseDTO = {
	project: ProjectDTO
    entryPoint: EntryPointDTO
}