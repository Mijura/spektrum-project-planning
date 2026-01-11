import { TaskRepository } from "@app/ports/repositories/task-repository"
import { RecordWorkPort } from "@app/ports/use-cases/task/record-work"
import { Task } from "@domain/task/task"
import { ActivityType } from "@jigjoy-io/task-contracts"

export class RecordWorkUseCase implements RecordWorkPort {

    constructor(private readonly taskRepository: TaskRepository) {}
    
	async execute(taskId: string, workerId: string, message: string, type: ActivityType.STARTED_WORK | ActivityType.FINISHED_WORK): Promise<Task> {
		const task = await this.taskRepository.get(taskId)
		if (!task) {
			throw new Error("Task not found")
		}
		if (type === ActivityType.STARTED_WORK) {
			task.startedWork(workerId, message)
		} else if (type === ActivityType.FINISHED_WORK) {
			task.finishedWork(workerId, message)
		}

        console.log("Task to save:", task)

        const savedTask = await this.taskRepository.save(task)

        console.log("Saved task:", savedTask)
        return savedTask
	}
}