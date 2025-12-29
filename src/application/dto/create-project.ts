import { EntryPointDTO } from "./entry-point"
import { ProjectDTO } from "./project"

export type CreateProjectDTO = {
	project: ProjectDTO
    entryPoint: EntryPointDTO
}