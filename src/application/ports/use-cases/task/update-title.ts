import { Task } from "@domain/task/task"
import { AuthenticatedUseCase } from "@heksagon/app"

export type UpdateTaskTitleParams = {
	taskId: string
	newTitle: string
}

export type UpdateTaskTitleUseCase = AuthenticatedUseCase<UpdateTaskTitleParams, Task>
