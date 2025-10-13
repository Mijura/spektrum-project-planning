import Responses from "@infrastructure/http/api-responses"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { ValidationError } from "@infrastructure/http/error-handler/errors/validation-error"
import { errorHandler } from "@infrastructure/http/error-handler"
import { schemaValidator } from "@infrastructure/http/schema-validator"

export async function createRepositoryHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
		if (!body) throw new ValidationError("No page body")


        schemaValidator(schema, commit)

		let repositoryId: string

		try {
			//repositoryId = await createRepositoryUseCase.execute()
		} catch (error) {
			throw new Error(`Failed to create repository: ${error}`)
		}

		let response = {
			statusCode: 202,
			body: JSON.stringify({ repositoryId })
		}

		return Responses._202(response)
	} catch (error) {
		return errorHandler(error)
	}
}