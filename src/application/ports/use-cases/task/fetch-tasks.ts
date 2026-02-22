import { Task } from "@domain/task/task"
import { AuthenticatedUseCase } from "@heksagon/app"

export type FetchTasksParams = {
	projectId: string
}

export type FetchTasksUseCase = AuthenticatedUseCase<FetchTasksParams, Task[]>
