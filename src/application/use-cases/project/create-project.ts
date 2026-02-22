import { Project } from "@domain/project/project"
import { CreateProjectResponse, CreateProjectUseCase } from "@app/ports/use-cases/project/create-project"
import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { AICodingService } from "@app/ports/services/ai-coding-service"
import { ProjectDeploymentService } from "@app/ports/services/project-deployment-service"
import { AuthContext, requireAuthenticated, requireUserId } from "@heksagon/app"

export class CreateProject implements CreateProjectUseCase {
	constructor(
		private readonly projectRepository: ProjectRepository,
		private readonly aiCodingService: AICodingService,
		private readonly projectDeploymentService: ProjectDeploymentService,
	) {}

	async execute(params: void, authContext: AuthContext): Promise<CreateProjectResponse> {
		requireAuthenticated(authContext)

		const userId = requireUserId(authContext)
		const project: Project = Project.create("My Project", "Empty project...", userId)

		const initializedModulePromise = this.aiCodingService.initializeReactModule(project.id)
		const cloudProfilePromise = this.projectDeploymentService.createCloudProfile(project.id)
		const saveProjectPromise = this.projectRepository.save(project)

		const [module] = await Promise.all([initializedModulePromise, saveProjectPromise, cloudProfilePromise])

		const entryPoint: EntryPoint = await this.projectDeploymentService.deployModule(project.id, module)

		return { project, entryPoint }
	}
}
