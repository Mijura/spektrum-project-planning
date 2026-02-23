import { Task } from "@domain/task/task"
import { AuthenticatedUseCase } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export type UpdateTaskDescriptionParams = {
	taskId: string
	newDescription: string
}

export type UpdateTaskDescriptionUseCase = AuthenticatedUseCase<UserData, UpdateTaskDescriptionParams, Task>
