import { ProjectDto, ProjectDtoMapper } from "@application/mappers/project-dto-mappers"
import { fetchProjects } from "@infrastructure/dependencies"
import { errorHandler, Responses, schemaValidator, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export async function fetchProjectsHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
		if (!body) throw new ValidationError("No page body")

        //TODO: Get from param from request instead of body
        const { ownerId } = JSON.parse(body)
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