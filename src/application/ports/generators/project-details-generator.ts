import { Task } from "@domain/task/task"

export interface ProjectDetailsGenerator {
	generateProjectDetails(task: Task): Promise<ProjectDetails>
}
