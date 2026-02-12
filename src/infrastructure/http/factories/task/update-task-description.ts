import { UpdateTaskDescriptionUseCase } from "@app/ports/use-cases/task/update-description"
import { Task } from "@domain/task/task"
import { TaskMapper } from "@infra/http/mappers/task-mapper"
import { errorHandler, Responses, ValidationError } from "@jigjoy-ai/serverless-core"
import { Task as TaskDTO } from "@jigjoy-ai/task-contracts"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export function createUpdateTaskDescriptionHandler(updateTaskDescriptionUseCase: UpdateTaskDescriptionUseCase) {
	return async ({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
		try {
			if (!body) throw new ValidationError("No page body")

			const taskDTO: TaskDTO = JSON.parse(body)

			const taskId = taskDTO.id
			const newDescription = taskDTO.description

			const updatedTask: Task = await updateTaskDescriptionUseCase.execute(taskId, newDescription)
			const updatedTaskDTO: TaskDTO = TaskMapper.toDTO(updatedTask)
			return Responses._200(updatedTaskDTO)
		} catch (error) {
			console.error("Error updating task description:", error)
			return errorHandler(error)
		}
	}
}
