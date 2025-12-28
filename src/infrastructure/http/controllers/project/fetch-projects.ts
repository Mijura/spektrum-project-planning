import { ProjectDTO } from "@application/dto/project"
import { fetchProjects } from "@infrastructure/dependencies"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export async function fetchProjectsHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
        
		const ownerId = event.pathParameters?.ownerId
		if (!ownerId) throw new ValidationError("Missing path parameter: ownerId")
        //schemaValidator(schema, commit)

		console.log(`Fetching all projects for ${ownerId}`)
		const projects: ProjectDTO[] = await fetchProjects.execute(ownerId)
		return Responses._200(projects)
		
	} catch (error) {
		console.error("Error fetching projects:", error)
		return errorHandler(error)
	}
}