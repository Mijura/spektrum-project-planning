import { TaskRepository } from "@app/ports/repositories/task-repository"
import { LeaveCommentUseCase } from "@app/ports/use-cases/task/leave-comment"
import { Task } from "@domain/task/task"

export class LeaveComment implements LeaveCommentUseCase {
	constructor(private readonly taskRepository: TaskRepository) {}

	async execute(taskId: string, commentText: string, authorId: string): Promise<Task> {
		const task: Task | null = await this.taskRepository.get(taskId)
		if (!task) {
			throw new Error("Task not found")
		}
		task.leaveComment(authorId, commentText)

		const savedTask: Task = await this.taskRepository.save(task)
		return savedTask
	}
}
