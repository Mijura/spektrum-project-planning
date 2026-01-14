import { ProjectDetails } from "@app/types/project-details"
import { Task } from "@domain/task/task"

export interface ProjectDetailsGenerator {
	generateProjectDetails(task: Task): Promise<ProjectDetails>
}