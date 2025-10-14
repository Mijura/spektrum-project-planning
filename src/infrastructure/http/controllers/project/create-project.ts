import { createNewProject } from "@infrastructure/dependencies"
import { errorHandler, Responses, schemaValidator, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export async function createRepositoryHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
		if (!body) throw new ValidationError("No page body")


        //schemaValidator(schema, commit)

		const { owner } = JSON.parse(body)
		
		let project = null

		try {
			project = await createNewProject.execute(owner)
		} catch (error) {
			console.error("Error creating project:", error)
			throw new Error(`Failed to create project: ${error}`)
		}

		let response = {
			statusCode: 201,
			body: JSON.stringify({ project })
		}

		return Responses._202(response)
	} catch (error) {
		return errorHandler(error)
	}
}