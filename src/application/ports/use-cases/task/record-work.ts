import { Task } from "@domain/task/task"
import { ActivityType } from "@jigjoy-io/task-contracts"

export interface RecordWorkUseCase {
	/**
	 * Records work on a task.
	 * @param taskId - The ID of the task.
	 * @param workerId - The worker to record work.
	 * @param message - The message to record.
	 * @param type - The type of work to record.
	 * @returns The task with the recorded activity.
	 */
	execute(
		taskId: string,
		workerId: string,
		message: string,
		type: ActivityType.STARTED_WORK | ActivityType.FINISHED_WORK,
	): Promise<Task>
}
