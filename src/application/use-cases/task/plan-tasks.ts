import { AIAssistantService } from "@app/services/ai-assistant-service"
import { PlanTasksUseCase } from "@app/ports/use-cases/task/plan-tasks"
import { Task } from "@domain/task/task"

export class PlanTasks implements PlanTasksUseCase {
	constructor(private readonly aiAssistantService: AIAssistantService) {}

	async execute(projectId: string, projectDescription: string): Promise<Task[]> {
		console.log("Planning tasks with AI")
		const task = Task.create("Product Owner", projectId, "Plan Tasks", projectDescription)
		await this.aiAssistantService.updateProjectDetails(task)

		const tasks = await this.aiAssistantService.planTasks(projectId, projectDescription)

		return tasks
	}
}
