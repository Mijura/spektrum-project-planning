import { Project } from "@domain/project/project"
import { AuthenticatedUseCase } from "@heksagon/app"

export type FetchProjectsUseCase = AuthenticatedUseCase<null, Project[]>
