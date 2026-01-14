import { CreateTaskUseCase } from "@app/ports/use-cases/task/create-task"
import { Task } from "@domain/task/task"
import { TaskMapper } from "@infra/http/mappers/task-mapper"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { Task as TaskDTO } from "@jigjoy-io/task-contracts"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export function createCreateTaskHandler(createTaskUseCase: CreateTaskUseCase) {
	return async ({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
		try {
			if (!body) throw new ValidationError("No page body")

			const { projectId, title, description } = JSON.parse(body)

			const task: Task = await createTaskUseCase.execute(projectId, title, description)

			const taskDTO: TaskDTO = TaskMapper.toDTO(task)
			return Responses._201(taskDTO)
		} catch (error) {
			console.error("Error creating task:", error)
			return errorHandler(error)
		}
	}
}
