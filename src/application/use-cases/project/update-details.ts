import { Project } from "@domain/entities/project"
import { ProjectRepository } from "@application/ports/outbound/project-repository"
import { UpdateProjectDetails } from "@application/ports/inbound/project/update-details"
import { ProjectMapper } from "@application/mappers/project-mappers"
import { ProjectDTO } from "@application/dto/project"
import { ProjectDetails } from "@domain/value-objects/project"

export class UpdateProjectDetailsUseCase implements UpdateProjectDetails {
    
    constructor(
        private readonly projectRepository: ProjectRepository
    ) {}

    async execute(projectId: string, projectDetails: ProjectDetails): Promise<ProjectDTO> {
        try {
            
            console.log(`Updating project details for project ${projectId}`)
            const project: Project | null = await this.projectRepository.get(projectId)

            if (!project) {
                throw new Error("Project not found.")
            }

            // Update project details
            project.setName(projectDetails.name)
            project.setDescription(projectDetails.description)

            // Persist the project in the database
            const updatedProject: Project = await this.projectRepository.save(project)
            return ProjectMapper.toResponse(updatedProject)
        } catch (error) {
            console.error("Error during project details update:", error)
            throw new Error("Failed to update project details.")
        }
    }
} 