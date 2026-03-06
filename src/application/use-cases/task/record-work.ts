import { TaskRepository } from "@app/ports/repositories/task-repository"
import { RecordWorkParams, RecordWorkUseCase } from "@app/ports/use-cases/task/record-work"
import { Task } from "@domain/task/task"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"
import { ActivityType } from "@jigjoy-ai/task-contracts"

export class RecordWork implements RecordWorkUseCase {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(auth: Auth<UserData>, params: RecordWorkParams): Promise<Task> {
		console.log(`Auth data: ${JSON.stringify(auth.data)}`)

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
