import { planTasksWithAI } from "@infrastructure/dependencies"
import { errorHandler, Responses, schemaValidator, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export async function planTasksWithAIHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
		if (!body) throw new ValidationError("No page body")

		const { projectId, projectDescription } = JSON.parse(body)
        //schemaValidator(schema, commit)

        try {
            const tasks = await planTasksWithAI.execute(projectId, projectDescription)

            return Responses._200(tasks)
        } catch (error) {
            console.error("Error planning tasks with AI:", error)
			throw new Error(`Error planning tasks with AI: ${error}`)
        }

	} catch (error) {
		return errorHandler(error)
	}
}


