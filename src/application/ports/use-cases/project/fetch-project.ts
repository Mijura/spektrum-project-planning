import { Project } from "@domain/project/project"
import { AuthenticatedUseCase } from "@heksagon/app"

export type FetchProjectParams = {
	projectId: string
}

export type FetchProjectUseCase = AuthenticatedUseCase<FetchProjectParams, Project>
