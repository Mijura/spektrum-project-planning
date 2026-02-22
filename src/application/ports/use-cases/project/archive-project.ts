import { Project } from "@domain/project/project"
import { AuthenticatedUseCase } from "@heksagon/app"

export type ArchiveProjectParams = {
	projectId: string
}

export type ArchiveProjectUseCase = AuthenticatedUseCase<ArchiveProjectParams, Project>
