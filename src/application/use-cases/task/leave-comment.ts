import { TaskRepository } from "@app/ports/repositories/task-repository"
import { LeaveCommentParams, LeaveCommentUseCase } from "@app/ports/use-cases/task/leave-comment"
import { Task } from "@domain/task/task"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export class LeaveComment implements LeaveCommentUseCase {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(auth: Auth<UserData>, params: LeaveCommentParams): Promise<Task> {
		console.log(`Auth data: ${JSON.stringify(auth.data)}`)
		const { taskId, commentText, authorName } = params

		const task: Task | null = await this.taskRepository.get(taskId)
		if (!task) {
			throw new Error("Task not found")
		}

		task.leaveComment(authorName, commentText)

		return await this.taskRepository.save(task)
	}
}
