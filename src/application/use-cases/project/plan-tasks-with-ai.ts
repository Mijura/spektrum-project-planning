import { PlanTasksWithAI } from "@application/ports/inbound/project/plan-tasks-with-ai"
import { MarketingService } from "@application/ports/inbound/marketing-service"    
import { Agent } from "@domain/agent"    
import { TaskRepository } from "@application/ports/outbound/task-repository"
import { TaskDTO } from "@application/dto/task"
import { TaskMapper } from "@application/mappers/task-mapper"
import { Task } from "@domain/task/task"

export class PlanTasksWithAIUseCase implements PlanTasksWithAI {
	
    constructor(
        private readonly productOwner: Agent,
        private readonly marketingService: MarketingService,
        private readonly taskRepository: TaskRepository
	) {}
    
    async execute(projectId: string, projectDescription: string): Promise<TaskDTO[]> {

        console.log("Planning tasks with AI")
        const task = Task.create("Product Owner", projectId, "Plan Tasks", projectDescription)
        await this.marketingService.updateProjectDetails(task)

        const tasks = await this.productOwner.execute(task)

        // Save all tasks
        const taskPromises = []
        for (const t of tasks) {
            const taskPromise = this.taskRepository.save(t)
            taskPromises.push(taskPromise)
        }

        await Promise.all(taskPromises)

        return TaskMapper.toDTOs(tasks)
    }
    
}