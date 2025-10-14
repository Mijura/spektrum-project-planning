import { ProjectDto, ProjectDtoMapper } from "@application/mappers/project-dto-mappers"
import { fetchProject } from "@infrastructure/dependencies"
import { errorHandler, Responses, schemaValidator, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export async function fetchProjectHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
		if (!body) throw new ValidationError("No page body")

        //TODO: Get from param from request instead of body
        const { projectId } = JSON.parse(body)
        //schemaValidator(schema, commit)
		
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