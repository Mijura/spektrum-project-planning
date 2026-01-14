import { Task } from "@domain/task/task"

export interface AITaskGenerator {
	generateTaskList(projectId: string, projectDescription: string): Promise<Task[]>
}