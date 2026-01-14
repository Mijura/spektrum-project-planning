import { Task } from "@domain/task/task"

export interface TaskGenerator {
	generateTaskList(projectId: string, projectDescription: string): Promise<Task[]>
}