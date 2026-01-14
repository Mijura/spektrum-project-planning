import { AIAssistantService } from "@app/services/ai-assistant-service"
import { PlanTasksUseCase } from "@app/ports/use-cases/task/plan-tasks"
import { Task } from "@domain/task/task"
import { AITaskGenerator } from "@app/ports/ai-assistant-service/ai-task-generator"
import { TaskRepository } from "@app/ports/repositories/task-repository"

export class PlanTasks implements PlanTasksUseCase {
	constructor(private readonly aiAssistantService: AIAssistantService, private readonly taskRepository: TaskRepository, private readonly aiTaskGenerator: AITaskGenerator) {}

	async execute(projectId: string, projectDescription: string): Promise<Task[]> {
		console.log("Planning tasks with AI")
		const task = Task.create("Product Owner", projectId, "Plan Tasks", projectDescription)
		await this.aiAssistantService.updateProjectDetails(task)

		// Generate tasks with AI
		const tasks: Task[] = await this.aiTaskGenerator.generateTaskList(projectId, projectDescription)

		// Save all tasks
		const taskPromises = []
		for (const t of tasks) {
			const taskPromise = this.taskRepository.save(t)
			taskPromises.push(taskPromise)
		}

		await Promise.all(taskPromises)

		return tasks
	}
}
