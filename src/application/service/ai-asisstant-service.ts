import { Task } from "@domain/task/task"
import { ProjectRepository } from "@application/ports/outbound/project-repository"
import { ProjectDetailsDTO } from "@application/dto/project-details"
import { ProjectDetailsGeneratorPort } from "@application/service/agents/project-details-generator"
import { TaskPlannerPort } from "@application/service/agents/task-planner"
import { AIAssistantServicePort } from "@application/ports/ai-asisstant-service"
import { TaskRepository } from "@application/ports/outbound/task-repository"

export class AIAssistantService implements AIAssistantServicePort {

    constructor(
        private readonly projectDetailsGenerator: ProjectDetailsGeneratorPort,   
        private readonly taskPlanner: TaskPlannerPort,
        private readonly projectRepository: ProjectRepository,
        private readonly taskRepository: TaskRepository
    ) {}

    async updateProjectDetails(task: Task) {
        const project = await this.projectRepository.get(task.projectId)
        if (!project) {
            throw new Error("Project not found")
        }

        if (!project.detailsUpdated) {
            const projectDetails: ProjectDetailsDTO = await this.projectDetailsGenerator.generateProjectDetails(task)
            project.setDetails(projectDetails.name, projectDetails.description)
            await this.projectRepository.save(project)
        }
    }

    async planTasks(task: Task): Promise<Task[]> {
        
        const tasks = await this.taskPlanner.generateTasks(task)
        
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