import { TaskDTO } from "@application/dto/task"
import { planTasks } from "@infrastructure/dependencies"
import { errorHandler, Responses, schemaValidator, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export async function planTasksHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
		if (!body) throw new ValidationError("No page body")

		const { projectId, projectDescription } = JSON.parse(body)
        //schemaValidator(schema, commit)

        const tasks: TaskDTO[] = await planTasks.execute(projectId, projectDescription)

        return Responses._200(tasks)

	} catch (error) {
        console.error("Error planning tasks with AI:", error)
		return errorHandler(error)
	}
}


