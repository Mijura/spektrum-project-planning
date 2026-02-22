import { TaskRepository } from "@app/ports/repositories/task-repository"
import { RecordWorkParams, RecordWorkUseCase } from "@app/ports/use-cases/task/record-work"
import { Task } from "@domain/task/task"
import { AuthContext, requireAuthenticated } from "@heksagon/app"
import { ActivityType } from "@jigjoy-ai/task-contracts"

export class RecordWork implements RecordWorkUseCase {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(params: RecordWorkParams, authContext: AuthContext): Promise<Task> {
		requireAuthenticated(authContext)

		const { taskId, workerId, message, type } = params

		const task = await this.taskRepository.get(taskId)

		if (!task) {
			throw new Error("Task not found")
		}

		if (type === ActivityType.STARTED_WORK) {
			task.startedWork(workerId, message)
		} else if (type === ActivityType.FINISHED_WORK) {
			task.finishedWork(workerId, message)
		}

		return await this.taskRepository.save(task)
	}
}
