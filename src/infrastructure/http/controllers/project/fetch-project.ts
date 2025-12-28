import { ProjectDTO } from "@application/dto/project"
import { fetchProject } from "@infrastructure/dependencies"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export async function fetchProjectHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	
	try {

		const projectId = event.pathParameters?.projectId
		
		if (!projectId) 
			throw new ValidationError("Missing path parameter: projectId")

		const projectDTO: ProjectDTO = await fetchProject.execute(projectId)

		return Responses._200(projectDTO)

	} catch (error) {
		console.error("Error fetching project:", error)
		return errorHandler(error)
	}
}