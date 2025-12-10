import { ProjectDto, ProjectDtoMapper } from "@application/mappers/project-dto-mappers"
import { fetchProject } from "@infrastructure/dependencies"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export async function fetchProjectHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	
	try {

		const projectId = event.pathParameters?.projectId
		
		if (!projectId) 
			throw new ValidationError("Missing path parameter: projectId")

		const project = await fetchProject.execute(projectId)
		const projectDTO: ProjectDto = ProjectDtoMapper.toDto(project)

		return Responses._200(projectDTO)

	} catch (error) {
		console.error("Error fetching project:", error)
		return errorHandler(error)
	}
}