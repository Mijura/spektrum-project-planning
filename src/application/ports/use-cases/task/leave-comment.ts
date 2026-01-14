import { Task } from "@domain/task/task"

export interface LeaveCommentUseCase {
	/**
	 * Leaves a comment on a task and saves it to the database.
	 * @param taskId - The ID of the task to leave a comment on.
	 * @param commentText - The text of the comment.
	 * @returns The updated Task object.
	 */
	execute(taskId: string, commentText: string, authorId: string): Promise<Task>
}
