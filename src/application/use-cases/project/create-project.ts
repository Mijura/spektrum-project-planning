import { Project } from "@domain/project/project"
import { CreateProjectPort } from "@app/ports/use-cases/project/create-project"
import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { AICodingClient } from "@jigjoy-io/ai-coding-client"
import {
	DeployModuleCommand,
	EntryPoint,
	EnvironmentType,
	ProjectDeploymentClient,
} from "@jigjoy-io/project-deployment-client"

export class CreateProjectUseCase implements CreateProjectPort {
	constructor(
		private readonly projectRepository: ProjectRepository,
		private readonly aiCodingClient: AICodingClient,
		private readonly projectDeploymentClient: ProjectDeploymentClient,
	) {}

	async execute(owner: string): Promise<{ project: Project; entryPoint: EntryPoint }> {
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
				setAsEntryPoint: true,
			}

			const entryPoint: EntryPoint = await this.projectDeploymentClient.deployModule(deploymentRequest)

			return { project, entryPoint }
		} catch (error) {
			console.error("Error creating new project:", error)
			throw new Error("Failed to create new project.")
		}
	}
}
