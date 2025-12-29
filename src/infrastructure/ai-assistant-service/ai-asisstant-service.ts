import { Task } from "@domain/task/task"
import { ProjectRepository } from "@application/ports/repositories/project-repository"
import { ProjectDetailsDTO } from "@application/dto/project-details"
import { AIAssistantServicePort } from "@application/ports/services/ai-asisstant-service"
import { TaskRepository } from "@application/ports/repositories/task-repository"
import { Project } from "@domain/project/project"
import { ProjectDetailsGenerator } from "@infrastructure/ai-assistant-service/project-details-generator"
import { TaskPlanner } from "@infrastructure/ai-assistant-service/task-planner"

export class AIAssistantService implements AIAssistantServicePort {

    constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly taskRepository: TaskRepository
    ) {}

    async updateProjectDetails(task: Task): Promise<Project> {
        const project = await this.projectRepository.get(task.projectId)
        if (!project) {
            throw new Error("Project not found")
        }

        if (!project.detailsUpdated) {

            const projectDetailsGenerator = new ProjectDetailsGenerator()
            const projectDetails: ProjectDetailsDTO = await projectDetailsGenerator.generateProjectDetails(task)
            console.log("Project details generated:", projectDetails)
            project.setDetails(projectDetails.name, projectDetails.description)
            return await this.projectRepository.save(project)
        }
        
        return project
    }

    async planTasks(projectId: string, projectDescription: string): Promise<Task[]> {

        const taskPlanner = new TaskPlanner()
        
        const tasks = await taskPlanner.generateTasks(projectId, projectDescription)
        
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