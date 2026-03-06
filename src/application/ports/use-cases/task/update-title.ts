import { Task } from "@domain/task/task"
import { AuthenticatedUseCase } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export type UpdateTaskTitleParams = {
	taskId: string
	newTitle: string
}

export type UpdateTaskTitleUseCase = AuthenticatedUseCase<UserData, UpdateTaskTitleParams, Task>
