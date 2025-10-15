import { ProjectDto, ProjectDtoMapper } from "@application/mappers/project-dto-mappers"
import { fetchProjects } from "@infrastructure/dependencies"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export async function fetchProjectsHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
        
		const ownerId = event.pathParameters?.projectId
		if (!ownerId) throw new ValidationError("Missing path parameter: ownerId")
        //schemaValidator(schema, commit)
		
		let response = null

        try {
            console.log(`Fetching all projects for ${ownerId}`)
			const projects = await fetchProjects.execute(ownerId)
			const projectDtos: ProjectDto[] = ProjectDtoMapper.toDtos(projects)
            response = {
				statusCode: 200,
				body: JSON.stringify({ projectDtos })
			}
		} catch (error) {
			// TODO: Handle Project Not Found
			console.error("Error fetching projects:", error)
			throw new Error(`Error fetching projects.`)
		}

		return Responses._200(response)
	} catch (error) {
		return errorHandler(error)
	}
}