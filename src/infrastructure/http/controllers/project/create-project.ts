import { createNewProject } from "@infrastructure/dependencies"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export async function createProjectHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	
	try {

		if (!body) throw new ValidationError("No page body")

		const { owner }  = JSON.parse(body)

		if (!owner) 
			throw new ValidationError("Missing path parameter: owner")

		const project = await createNewProject.execute(owner)

		return Responses._201(project)


	} catch (error) {
		console.error("Error creating project:", error)
		return errorHandler(error)
	}
}