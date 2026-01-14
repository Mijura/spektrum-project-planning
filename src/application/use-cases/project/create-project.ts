import { Project } from "@domain/project/project"
import { CreateProjectUseCase } from "@app/ports/use-cases/project/create-project"
import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { AICodingService } from "@app/ports/services/ai-coding-service"
import { ProjectDeploymentService } from "@app/ports/services/project-deployment-service"

export class CreateProject implements CreateProjectUseCase {
	constructor(
		private readonly projectRepository: ProjectRepository,
		private readonly aiCodingService: AICodingService,
		private readonly projectDeploymentService: ProjectDeploymentService,
	) {}

	async execute(owner: string): Promise<{ project: Project; entryPoint: EntryPoint }> {
		// Create a new project with a unique ID
		const project: Project = Project.create("My Project", "Empty project...", owner)

		const initializedModulePromise = this.aiCodingService.initializeReactModule(project.id)
		const cloudProfilePromise = this.projectDeploymentService.createCloudProfile(project.id)
		const saveProjectPromise = this.projectRepository.save(project)

		const [module] = await Promise.all([initializedModulePromise, saveProjectPromise, cloudProfilePromise])

		const entryPoint: EntryPoint = await this.projectDeploymentService.deployModule(project.id, module)

		return { project, entryPoint }
	}
}
