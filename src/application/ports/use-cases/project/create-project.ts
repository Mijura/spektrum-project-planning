import { Project } from "@domain/project/project"
import { AuthenticatedUseCase } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export type CreateProjectResponse = {
	project: Project
	entryPoint: EntryPoint
}

export type CreateProjectUseCase = AuthenticatedUseCase<UserData, void, CreateProjectResponse>
