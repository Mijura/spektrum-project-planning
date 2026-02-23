import { Task } from "@domain/task/task"
import { AuthenticatedUseCase } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"
import { ActivityType } from "@jigjoy-ai/task-contracts"

export type RecordWorkParams = {
	taskId: string
	workerId: string
	message: string
	type: ActivityType.STARTED_WORK | ActivityType.FINISHED_WORK
}

export type RecordWorkUseCase = AuthenticatedUseCase<UserData, RecordWorkParams, Task>
