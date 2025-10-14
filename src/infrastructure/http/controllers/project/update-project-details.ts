import { ProjectDto, ProjectDtoMapper } from "@application/mappers/project-dto-mappers"
import { updateProjectDetails } from "@infrastructure/dependencies"
import { errorHandler, Responses, schemaValidator, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export async function updateProjectDetailsHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
		if (!body) throw new ValidationError("No page body")

        const { id, name, description }  = JSON.parse(body)
        //schemaValidator(schema, commit)
		
		let response = null

        try {
			const project = await updateProjectDetails.execute(id, name, description)
			const projectDTO: ProjectDto = ProjectDtoMapper.toDto(project)
            response = {
				statusCode: 200,
				body: JSON.stringify({ projectDTO })
			}
		} catch (error) {
			console.error("Error updating project:", error)
			throw new Error(`Error updating project details.`)
		}

		return Responses._200(response)
	} catch (error) {
		return errorHandler(error)
	}
}