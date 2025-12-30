import { TaskDTO } from "@app/dto/task"
import { PlanTasksPort } from "@app/ports/use-cases/task/plan-tasks"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"


export function createPlanTasksHandler(planTasks: PlanTasksPort) {

	return async function planTasksHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {
			if (!body) throw new ValidationError("No page body")

			const { projectId, projectDescription } = JSON.parse(body)

			const tasks: TaskDTO[] = await planTasks.execute(projectId, projectDescription)

			return Responses._200(tasks)

		} catch (error) {
			console.error("Error planning tasks with AI:", error)
			return errorHandler(error)
		}
	}
}

