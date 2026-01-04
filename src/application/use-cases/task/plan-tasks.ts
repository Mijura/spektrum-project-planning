import { PlanTasksPort } from "@app/ports/use-cases/task/plan-tasks"
import { Task } from "@domain/task/task"
import { AIAssistantServicePort } from "@app/ports/services/ai-asisstant-service"

export class PlanTasksUseCase implements PlanTasksPort {
	constructor(private readonly aiAssistantService: AIAssistantServicePort) {}

	async execute(projectId: string, projectDescription: string): Promise<Task[]> {
		console.log("Planning tasks with AI")
		const task = Task.create("Product Owner", projectId, "Plan Tasks", projectDescription)
		await this.aiAssistantService.updateProjectDetails(task)

		const tasks = await this.aiAssistantService.planTasks(projectId, projectDescription)

		return tasks
	}
}
