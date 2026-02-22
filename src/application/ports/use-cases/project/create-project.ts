import { Project } from "@domain/project/project"
import { AuthenticatedUseCase } from "@heksagon/app"

export type CreateProjectResponse = {
	project: Project
	entryPoint: EntryPoint
}

export type CreateProjectUseCase = AuthenticatedUseCase<null, CreateProjectResponse>
