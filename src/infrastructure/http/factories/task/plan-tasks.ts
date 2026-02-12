import { Task } from "@domain/task/task"
import { TaskMapper } from "@infra/http/mappers/task-mapper"
import { PlanTasksUseCase } from "@app/ports/use-cases/task/plan-tasks"
import { errorHandler, Responses, ValidationError } from "@jigjoy-ai/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Task as TaskDTO } from "@jigjoy-ai/task-contracts"

export function createPlanTasksHandler(planTasksUseCase: PlanTasksUseCase) {
	return async ({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
		try {
			if (!body) throw new ValidationError("No request body provided")

			const { projectId, projectDescription } = JSON.parse(body)

			const tasks: Task[] = await planTasksUseCase.execute(projectId, projectDescription)
			const taskDTOs: TaskDTO[] = TaskMapper.toDTOs(tasks)

			return Responses._200(taskDTOs)
		} catch (error) {
			console.error("Error planning tasks with AI:", error)
			return errorHandler(error)
		}
	}
}
