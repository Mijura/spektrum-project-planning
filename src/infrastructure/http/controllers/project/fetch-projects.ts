import { ProjectDto, ProjectDtoMapper } from "@application/mappers/project-dto-mappers"
import { fetchProjects } from "@infrastructure/dependencies"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export async function fetchProjectsHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
        
		const ownerId = event.pathParameters?.ownerId
		if (!ownerId) throw new ValidationError("Missing path parameter: ownerId")
        //schemaValidator(schema, commit)

        try {
            console.log(`Fetching all projects for ${ownerId}`)
			const projects = await fetchProjects.execute(ownerId)
			const projectDtos: ProjectDto[] = ProjectDtoMapper.toDtos(projects)
            return Responses._200(projectDtos)
		} catch (error) {
			// TODO: Handle Project Not Found
			console.error("Error fetching projects:", error)
			throw new Error(`Error fetching projects.`)
		}

		
	} catch (error) {
		return errorHandler(error)
	}
}