import { ProjectDTO } from "@app/dto/project"
import { FetchProjectPort } from "@app/ports/use-cases/project/fetch-project"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"


export function createFetchProjectHandler(fetchProject: FetchProjectPort) {

	return async function fetchProjectHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
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
}

