import { Project } from "@domain/project/project"
import { AuthenticatedUseCase } from "@heksagon/app"

export type UpdateProjectDetailsParams = {
	projectId: string
	newName: string
	newDescription: string
}

export type UpdateProjectDetailsUseCase = AuthenticatedUseCase<UpdateProjectDetailsParams, Project>
