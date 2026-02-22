import { TaskRepository } from "@app/ports/repositories/task-repository"
import { LeaveCommentParams, LeaveCommentUseCase } from "@app/ports/use-cases/task/leave-comment"
import { Task } from "@domain/task/task"
import { AuthContext, requireUserId } from "@heksagon/app"

export class LeaveComment implements LeaveCommentUseCase {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(params: LeaveCommentParams, authContext: AuthContext): Promise<Task> {
		const userId = requireUserId(authContext)
		const { taskId, commentText } = params

		const task: Task | null = await this.taskRepository.get(taskId)
		if (!task) {
			throw new Error("Task not found")
		}

		task.leaveComment(userId, commentText)

		return await this.taskRepository.save(task)
	}
}
