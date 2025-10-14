import { planTasksWithAI } from "@infrastructure/dependencies"
import { errorHandler, Responses, schemaValidator, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export async function createProjectHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
		if (!body) throw new ValidationError("No page body")


        //schemaValidator(schema, commit)

		const { projectId, projectDescription } = JSON.parse(body)


        let response = null

        try {
            const tasks = await planTasksWithAI.execute(projectId, projectDescription)

            response = {
                statusCode: 200,
                body: JSON.stringify({ tasks })
            }
        } catch (error) {
            console.error("Error planning tasks with AI:", error)
			throw new Error(`Error planning tasks with AI: ${error}`)
        }



		return Responses._200(response)
	} catch (error) {
		return errorHandler(error)
	}
}


