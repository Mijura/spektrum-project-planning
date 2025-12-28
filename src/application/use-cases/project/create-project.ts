import { Project } from "@domain/project/project"
import { CreateProjectPort } from "@application/ports/use-cases/project/create-project"
import { ProjectRepository } from "@application/ports/repositories/project-repository"
import { AICodingClient } from "@jigjoy-io/ai-coding-client"
import { DeployModuleCommand, EnvironmentType, ProjectDeploymentClient } from "@jigjoy-io/project-deployment-client"
import { CreateProjectDTO } from "@application/dto/create-project"
import { ProjectDTO } from "@application/dto/project"
import { ProjectMapper } from "@application/mappers/project-mappers"
import { EntryPointDTO } from "@application/dto/entry-point"

export class CreateProjectUseCase implements CreateProjectPort {
	
	constructor(
		private readonly projectRepository: ProjectRepository,
		private readonly aiCodingClient: AICodingClient,
		private readonly projectDeploymentClient: ProjectDeploymentClient
	) {}

	async execute(owner: string): Promise<CreateProjectDTO> {
		try {
			// Create a new project with a unique ID
			const project: Project = Project.create("My Project", "Empty project...", owner)
			
			
			const initializedModulePromise = this.aiCodingClient.initializeReactModule(project.id)
			const cloudProfilePromise = this.projectDeploymentClient.createCloudProfile(project.id)
			const saveProjectPromise = this.projectRepository.save(project)

			const [module] = await Promise.all([initializedModulePromise, saveProjectPromise, cloudProfilePromise])

 
			const deploymentRequest: DeployModuleCommand = {
				projectId: project.id,
				moduleId: module.id,
				moduleType: module.type,
				versionControlId: module.repositoryId,
				environmentType: EnvironmentType.DEV,
				setAsEntryPoint: true
			}

			const entryPointDTO: EntryPointDTO = await this.projectDeploymentClient.deployModule(deploymentRequest)
			const projectDTO: ProjectDTO = ProjectMapper.toDto(project)

			const createProjectDTO: CreateProjectDTO = {
				project: projectDTO,
				entryPoint: entryPointDTO
			}

			return createProjectDTO
		} catch (error) {
			console.error("Error creating new project:", error)
			throw new Error("Failed to create new project.")
		}
	}
}
