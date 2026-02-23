import { Task } from "@domain/task/task"
import { AuthenticatedUseCase } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export type CreateTaskParams = {
	projectId: string
	title: string
	description: string
}

export type CreateTaskUseCase = AuthenticatedUseCase<UserData, CreateTaskParams, Task>
