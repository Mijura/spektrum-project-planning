import { Task } from "@domain/task/task"
import { AuthenticatedUseCase } from "@heksagon/app"

export type CreateTaskParams = {
	projectId: string
	title: string
	description: string
}

export type CreateTaskUseCase = AuthenticatedUseCase<CreateTaskParams, Task>
