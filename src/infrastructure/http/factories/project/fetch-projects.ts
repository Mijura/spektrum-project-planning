import { ProjectDTO } from "@infra/http/dtos/project"
import { ProjectMapper } from "@infra/http/mappers/project-mapper"
import { FetchProjectsUseCase } from "@app/ports/use-cases/project/fetch-projects"
import { Project } from "@domain/project/project"
import { errorHandler, Responses, ValidationError } from "@jigjoy-ai/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export function createFetchProjectsHandler(fetchProjectsUseCase: FetchProjectsUseCase) {
	return async function fetchProjectsHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {

			const userId = event.headers?.["x-user-id"] || event.headers?.["X-User-Id"]

			console.log(`userId: ${userId}`)
			
			const ownerId = event.pathParameters?.ownerId
			if (!ownerId) throw new ValidationError("Missing path parameter: ownerId")

			console.log(`Fetching all projects for ${ownerId}`)

			const projects: Project[] = await fetchProjectsUseCase.execute(ownerId)
			const projectDTOs: ProjectDTO[] = ProjectMapper.toDtos(projects)

			return Responses._200(projectDTOs)
		} catch (error) {
			console.error("Error fetching projects:", error)
			return errorHandler(error)
		}
	}
}
