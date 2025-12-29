import { Task } from "@domain/task/task"
import { ProjectRepository } from "@application/ports/repositories/project-repository"
import { ProjectDetailsDTO } from "@application/dto/project-details"
import { ProjectDetailsGeneratorPort } from "@application/services/agents/project-details-generator"
import { TaskPlannerPort } from "@application/services/agents/task-planner"
import { AIAssistantServicePort } from "@application/ports/services/ai-asisstant-service"
import { TaskRepository } from "@application/ports/repositories/task-repository"
import { Project } from "@domain/project/project"

export class AIAssistantService implements AIAssistantServicePort {

    constructor(
        private readonly projectDetailsGenerator: ProjectDetailsGeneratorPort,   
        private readonly taskPlanner: TaskPlannerPort,
        private readonly projectRepository: ProjectRepository,
        private readonly taskRepository: TaskRepository
    ) {}

    async updateProjectDetails(task: Task): Promise<Project> {
        const project = await this.projectRepository.get(task.projectId)
        if (!project) {
            throw new Error("Project not found")
        }

        if (!project.detailsUpdated) {
            const projectDetails: ProjectDetailsDTO = await this.projectDetailsGenerator.generateProjectDetails(task)
            console.log("Project details generated:", projectDetails)
            project.setDetails(projectDetails.name, projectDetails.description)
            return await this.projectRepository.save(project)
        }
        
        return project
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