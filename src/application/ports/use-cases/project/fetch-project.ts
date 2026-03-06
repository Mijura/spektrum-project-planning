import { Project } from "@domain/project/project"
import { AuthenticatedUseCase } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export type FetchProjectParams = {
	projectId: string
}

export type FetchProjectUseCase = AuthenticatedUseCase<UserData, FetchProjectParams, Project>
