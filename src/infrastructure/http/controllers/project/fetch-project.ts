import { ProjectDto, ProjectDtoMapper } from "@application/mappers/project-dto-mappers"
import { fetchProject } from "@infrastructure/dependencies"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export async function fetchProjectHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
		const projectId = event.pathParameters?.projectId
		if (!projectId) throw new ValidationError("Missing path parameter: projectId")

        try {
			const project = await fetchProject.execute(projectId)
			const projectDTO: ProjectDto = ProjectDtoMapper.toDto(project)
			console.log(projectDTO)
			return Responses._200(projectDTO)
		} catch (error) {
			// TODO: Handle Project Not Found
			console.error("Error fetching project:", error)
			throw new Error(`Error fetching project.`)
		}

	} catch (error) {
		return errorHandler(error)
	}
}