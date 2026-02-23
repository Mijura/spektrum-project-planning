import { Project } from "@domain/project/project"
import { AuthenticatedUseCase } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export type ArchiveProjectParams = {
	projectId: string
}

export type ArchiveProjectUseCase = AuthenticatedUseCase<UserData, ArchiveProjectParams, Project>
