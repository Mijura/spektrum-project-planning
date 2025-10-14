import { createNewProject } from "@infrastructure/dependencies"
import { errorHandler, Responses, schemaValidator, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export async function createProjectHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
		if (!body) throw new ValidationError("No page body")


		const { owner } = JSON.parse(body)
        //schemaValidator(schema, commit)
		
		let response = null

		try {
			const project = await createNewProject.execute(owner)

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