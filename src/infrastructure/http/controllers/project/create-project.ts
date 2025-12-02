import { createNewProject } from "@infrastructure/dependencies"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export async function createProjectHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {

		const ownerId = event.pathParameters?.ownerId
		
		if (!ownerId) 
			throw new ValidationError("Missing path parameter: ownerId")

		
		let response = null

		try {
			const project = await createNewProject.execute(ownerId)

			response = {
				statusCode: 201,
				body: JSON.stringify({ project })
			}
		} catch (error) {
			console.error("Error creating project:", error)
			throw new Error(`Failed to create project: ${error}`)
		}



		return Responses._201(response)
	} catch (error) {
		return errorHandler(error)
	}
}