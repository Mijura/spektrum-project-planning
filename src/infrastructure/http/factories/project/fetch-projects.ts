import { ProjectDTO } from "@infra/http/dto/project"
import { ProjectMapper } from "@infra/http/mappers/project-mapper"
import { FetchProjectsPort } from "@app/ports/use-cases/project/fetch-projects"
import { Project } from "@domain/project/project"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"


export function createFetchProjectsHandler(fetchProjects: FetchProjectsPort) {

	return async function fetchProjectsHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {
			const ownerId = event.pathParameters?.ownerId
			if (!ownerId) 
				throw new ValidationError("Missing path parameter: ownerId")

			console.log(`Fetching all projects for ${ownerId}`)
			
			const projects: Project[] = await fetchProjects.execute(ownerId)
			const projectDTOs: ProjectDTO[] = ProjectMapper.toDtos(projects)
			
			return Responses._200(projectDTOs)
			
		} catch (error) {
			console.error("Error fetching projects:", error)
			return errorHandler(error)
		}
	}
}

