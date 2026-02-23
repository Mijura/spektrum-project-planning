import { ProjectDTO } from "@infra/http/dtos/project"
import { ProjectMapper } from "@infra/http/mappers/project-mapper"
import { UpdateProjectDetailsParams, UpdateProjectDetailsUseCase } from "@app/ports/use-cases/project/update-details"
import { Project } from "@domain/project/project"
import { errorHandler, Responses, ValidationError } from "@jigjoy-ai/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"
import { extractAuthData } from "@heksagon/http"

export function createUpdateProjectDetailsHandler(updateProjectDetailsUseCase: UpdateProjectDetailsUseCase) {
	return async function updateProjectDetailsHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {
			if (!event.body) throw new ValidationError("No page body")

			const auth: Auth<UserData> = extractAuthData(event)
			const params: UpdateProjectDetailsParams = JSON.parse(event.body)

			const project: Project = await updateProjectDetailsUseCase.execute(auth, params)
			const projectDTO: ProjectDTO = ProjectMapper.toDto(project)

			return Responses._200(projectDTO)
		} catch (error) {
			console.error("Error updating project:", error)
			return errorHandler(error)
		}
	}
}
