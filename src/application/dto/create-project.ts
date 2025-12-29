import { EntryPointDTO } from "./entry-point"
import { ProjectDTO } from "./project"

export interface CreateProjectDTO {
	project: ProjectDTO
    entryPoint: EntryPointDTO
}