import { Project } from "@domain/entities/project"
import { CreateProject } from "@domain/use-cases/project/create-project"
import { ProjectRepository } from "@domain/ports/repositories/project-repository"
import { AICodingClient, Module } from "@jigjoy-io/ai-coding-client"
import { DeployModuleCommand, EnvironmentType, ProjectDeploymentClient } from "@jigjoy-io/project-deployment-client"

export class CreateProjectUseCase implements CreateProject {
	constructor(
		private readonly projectRepository: ProjectRepository,
		private readonly aiCodingClient: AICodingClient,
		private readonly projectDeploymentClient: ProjectDeploymentClient
	) {}

	async execute(owner: string): Promise<Project> {
		try {
			// Create a new project with a unique ID
			const project: Project = Project.create("My Project", "Empty project...", owner)
			
			
			const module = await this.aiCodingClient.initializeReactModule(project.id)
			console.log(`MODULE: ${JSON.stringify(module)}`)

			await this.projectDeploymentClient.createCloudProfile(project.id)

			const deploymentRequest: DeployModuleCommand = {
				projectId: project.id,
				moduleId: module.id,
				moduleType: module.moduleType,
				versionControlId: module.repositoryId,
				environmentType: EnvironmentType.DEV,
				setAsEntryPoint: true
			}

			await this.projectDeploymentClient.deployModule(deploymentRequest)
			const savedProject = await this.projectRepository.save(project)

			return savedProject
		} catch (error) {
			console.error("Error creating new project:", error)
			throw new Error("Failed to create new project.")
		}
	}
}
