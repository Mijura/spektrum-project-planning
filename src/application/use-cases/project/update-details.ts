import { Project } from "@domain/project/project"
import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { UpdateProjectDetailsPort } from "@app/ports/use-cases/project/update-details"
import { ProjectMapper } from "@app/mappers/project-mappers"
import { ProjectDTO } from "@app/dto/project"
import { ProjectDetailsDTO } from "@app/dto/project-details"

export class UpdateProjectDetailsUseCase implements UpdateProjectDetailsPort {
    
    constructor(
        private readonly projectRepository: ProjectRepository
    ) {}

    async execute(projectId: string, projectDetails: ProjectDetailsDTO): Promise<ProjectDTO> {
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
            return ProjectMapper.toDto(updatedProject)
        } catch (error) {
            console.error("Error during project details update:", error)
            throw new Error("Failed to update project details.")
        }
    }
} 