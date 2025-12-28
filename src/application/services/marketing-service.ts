import { Task } from "@domain/entities/task"
import { Agent } from "@domain/agent"
import { ProjectRepository } from "@application/ports/outbound/project-repository"
import { MarketingService } from "@application/ports/inbound/marketing-service"
import { ProjectDetails } from "@domain/value-objects/project"

export class DefaultMarketingService implements MarketingService {

    constructor(
        private readonly marketeer: Agent,   
        private readonly projectRepository: ProjectRepository
    ) {}

    async updateProjectDetails(task: Task) {
        const project = await this.projectRepository.get(task.projectId)
        if (!project) {
            throw new Error("Project not found")
        }

        if (!project.detailsUpdated) {
            const projectDetails: ProjectDetails = await this.marketeer.execute(task)
            project.setDetails(projectDetails.name, projectDetails.description)
            await this.projectRepository.save(project)
        }
    }
}