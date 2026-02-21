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

			if (!userId) throw new ValidationError("Missing header: x-user-id or X-User-Id")

			console.log(`Fetching all projects for ${userId}`)

			const projects: Project[] = await fetchProjectsUseCase.execute(userId)
			const projectDTOs: ProjectDTO[] = ProjectMapper.toDtos(projects)

			return Responses._200(projectDTOs)
		} catch (error) {
			console.error("Error fetching projects:", error)
			return errorHandler(error)
		}
	}
}
