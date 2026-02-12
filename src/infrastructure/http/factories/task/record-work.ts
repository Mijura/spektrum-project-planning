import { Task } from "@domain/task/task"
import { Task as TaskDTO } from "@jigjoy-ai/task-contracts"
import { TaskMapper } from "@infra/http/mappers/task-mapper"
import { errorHandler, Responses, ValidationError } from "@jigjoy-ai/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { RecordWorkUseCase } from "@app/ports/use-cases/task/record-work"

export function createRecordWorkHandler(recordWorkUseCase: RecordWorkUseCase) {
	return async ({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
		try {
			if (!body) throw new ValidationError("No request body provided")

			const { taskId, workerId, message, type } = JSON.parse(body)

			console.log(
				"Recording work for task:",
				taskId,
				"by worker:",
				workerId,
				"with message:",
				message,
				"and type:",
				type,
			)
			const task: Task = await recordWorkUseCase.execute(taskId, workerId, message, type)
			const taskDTO: TaskDTO = TaskMapper.toDTO(task)

			return Responses._200(taskDTO)
		} catch (error) {
			console.error("Error recording work:", error)
			return errorHandler(error)
		}
	}
}
