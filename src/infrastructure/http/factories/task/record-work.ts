import { Task } from "@domain/task/task"
import { Task as TaskDTO } from "@jigjoy-ai/task-contracts"
import { TaskMapper } from "@infra/http/mappers/task-mapper"
import { errorHandler, Responses, ValidationError } from "@jigjoy-ai/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { RecordWorkParams, RecordWorkUseCase } from "@app/ports/use-cases/task/record-work"
import { Auth } from "@heksagon/app"
import { extractAuthData } from "@heksagon/http"
import { UserData } from "@jigjoy-ai/auth"

export function createRecordWorkHandler(recordWorkUseCase: RecordWorkUseCase) {
	return async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
		try {
			if (!event.body) throw new ValidationError("No request body provided")

			const auth: Auth<UserData> = extractAuthData(event.headers)
			const params: RecordWorkParams = JSON.parse(event.body)

			const task: Task = await recordWorkUseCase.execute(auth, params)
			const taskDTO: TaskDTO = TaskMapper.toDTO(task)

			return Responses._200(taskDTO)
		} catch (error) {
			console.error("Error recording work:", error)
			return errorHandler(error)
		}
	}
}
