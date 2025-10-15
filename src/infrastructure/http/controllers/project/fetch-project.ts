import { ProjectDto, ProjectDtoMapper } from "@application/mappers/project-dto-mappers"
import { fetchProject } from "@infrastructure/dependencies"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export async function fetchProjectHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
		const projectId = event.pathParameters?.projectId
		if (!projectId) throw new ValidationError("Missing path parameter: projectId")
		
		let response = null

        try {
			const project = await fetchProject.execute(projectId)
			const projectDTO: ProjectDto = ProjectDtoMapper.toDto(project)
            response = {
				statusCode: 200,
				body: JSON.stringify({ projectDTO })
			}
		} catch (error) {
			// TODO: Handle Project Not Found
			console.error("Error fetching project:", error)
			throw new Error(`Error fetching project.`)
		}

		return Responses._200(response)
	} catch (error) {
		return errorHandler(error)
	}
}