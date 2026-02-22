import { Task } from "@domain/task/task"
import { AuthenticatedUseCase } from "@heksagon/app"

export type PlanTasksParams = {
	projectId: string
	projectDescription: string
}

export type PlanTasksUseCase = AuthenticatedUseCase<PlanTasksParams, Task[]>
