import { Task } from "@domain/task/task"
import { TaskMapper } from "@infra/http/mappers/task-mapper"
import { PlanTasksParams, PlanTasksUseCase } from "@app/ports/use-cases/task/plan-tasks"
import { errorHandler, Responses, ValidationError } from "@jigjoy-ai/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Task as TaskDTO } from "@jigjoy-ai/task-contracts"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"
import { extractAuthData } from "@heksagon/http"

export function createPlanTasksHandler(planTasksUseCase: PlanTasksUseCase) {
	return async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
		try {
			if (!event.body) throw new ValidationError("No request body provided")

			const auth: Auth<UserData> = extractAuthData(event.headers)
			const params: PlanTasksParams = JSON.parse(event.body)

			const tasks: Task[] = await planTasksUseCase.execute(auth, params)
			const taskDTOs: TaskDTO[] = TaskMapper.toDTOs(tasks)

			return Responses._200(taskDTOs)
		} catch (error) {
			console.error("Error planning tasks with AI:", error)
			return errorHandler(error)
		}
	}
}
