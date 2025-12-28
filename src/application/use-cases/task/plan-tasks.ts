import { PlanTasksPort } from "@application/ports/use-cases/task/plan-tasks"
import { TaskDTO } from "@application/dto/task"
import { TaskMapper } from "@application/mappers/task-mapper"
import { Task } from "@domain/task/task"
import { AIAssistantServicePort } from "@application/ports/services/ai-asisstant-service"

export class PlanTasksUseCase implements PlanTasksPort {
	
    constructor(
        private readonly aiAssistantService: AIAssistantServicePort
	) {}
    
    async execute(projectId: string, projectDescription: string): Promise<TaskDTO[]> {

        console.log("Planning tasks with AI")
        const task = Task.create("Product Owner", projectId, "Plan Tasks", projectDescription)
        await this.aiAssistantService.updateProjectDetails(task)

        const tasks = await this.aiAssistantService.planTasks(task)

        return TaskMapper.toDTOs(tasks)
    }
    
}