import { Project } from "@domain/project/project"
import { AuthenticatedUseCase } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export type FetchProjectsUseCase = AuthenticatedUseCase<UserData, void, Project[]>
