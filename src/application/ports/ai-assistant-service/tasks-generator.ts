import { Task } from "@domain/task/task"

export interface TasksGenerator {
	generateTasks(projectId: string, projectDescription: string): Promise<Task[]>
}