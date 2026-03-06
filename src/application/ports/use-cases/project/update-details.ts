import { Project } from "@domain/project/project"
import { AuthenticatedUseCase } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export type UpdateProjectDetailsParams = {
	projectId: string
	newName: string
	newDescription: string
}

export type UpdateProjectDetailsUseCase = AuthenticatedUseCase<UserData, UpdateProjectDetailsParams, Project>
