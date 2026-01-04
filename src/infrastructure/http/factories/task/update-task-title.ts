import { Task } from "@domain/task/task"
import { TaskMapper } from "@infra/http/mappers/task-mapper"
import { UpdateTaskTitlePort } from "@app/ports/use-cases/task/update-title"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Task as TaskDTO } from "@jigjoy-io/task-contracts"

export function createUpdateTaskTitleHandler(updateTaskTitle: UpdateTaskTitlePort) {
	return async ({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
		try {
			if (!body) throw new ValidationError("No page body")

			const taskDTO: TaskDTO = JSON.parse(body)

			const taskId = taskDTO.id
			const newTitle = taskDTO.title

			const updatedTask: Task = await updateTaskTitle.execute(taskId, newTitle)
			const updatedTaskDTO: TaskDTO = TaskMapper.toDTO(updatedTask)
			return Responses._200(updatedTaskDTO)
		} catch (error) {
			console.error("Error updating task title:", error)
			return errorHandler(error)
		}
	}
}
