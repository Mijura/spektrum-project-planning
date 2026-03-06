import { Task } from "@domain/task/task"
import { AuthenticatedUseCase } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export type PlanTasksParams = {
	projectId: string
	projectDescription: string
}

export type PlanTasksUseCase = AuthenticatedUseCase<UserData, PlanTasksParams, Task[]>
