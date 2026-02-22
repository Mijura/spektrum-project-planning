import { Task } from "@domain/task/task"
import { AuthenticatedUseCase } from "@heksagon/app"

export type UpdateTaskDescriptionParams = {
	taskId: string
	newDescription: string
}

export type UpdateTaskDescriptionUseCase = AuthenticatedUseCase<UpdateTaskDescriptionParams, Task>
