import { TaskRepository } from "@app/ports/repositories/task-repository"
import { LeaveCommentPort } from "@app/ports/use-cases/task/leave-comment"
import { Task } from "@domain/task/task"

export class LeaveCommentUseCase implements LeaveCommentPort {
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
