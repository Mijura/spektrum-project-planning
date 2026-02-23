import { ProjectDetailsService } from "@app/services/project-details-service"
import { PlanTasksParams, PlanTasksUseCase } from "@app/ports/use-cases/task/plan-tasks"
import { Task } from "@domain/task/task"
import { TaskGenerator } from "@app/ports/generators/task-generator"
import { TaskRepository } from "@app/ports/repositories/task-repository"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export class PlanTasks implements PlanTasksUseCase {
	constructor(
		private readonly projectDetailsService: ProjectDetailsService,
		private readonly taskRepository: TaskRepository,
		private readonly taskGenerator: TaskGenerator,
	) {}

	async execute(auth: Auth<UserData>, params: PlanTasksParams): Promise<Task[]> {
		console.log(`Auth data: ${JSON.stringify(auth.data)}`)

		const { projectId, projectDescription } = params

		console.log("Planning tasks with AI")
		const task = Task.create("Product Owner", projectId, "Plan Tasks", projectDescription)
		await this.projectDetailsService.ensureProjectDetailsFromTask(task)

		const tasks: Task[] = await this.taskGenerator.generateTaskList(projectId, projectDescription)

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
