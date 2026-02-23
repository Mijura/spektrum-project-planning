import { Project } from "@domain/project/project"
import { CreateProjectResponse, CreateProjectUseCase } from "@app/ports/use-cases/project/create-project"
import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { AICodingService } from "@app/ports/services/ai-coding-service"
import { ProjectDeploymentService } from "@app/ports/services/project-deployment-service"
import { UserData } from "@jigjoy-ai/auth"
import { Auth } from "@heksagon/app"

export class CreateProject implements CreateProjectUseCase {
	constructor(
		private readonly projectRepository: ProjectRepository,
		private readonly aiCodingService: AICodingService,
		private readonly projectDeploymentService: ProjectDeploymentService,
	) {}

	async execute(auth: Auth<UserData>): Promise<CreateProjectResponse> {

		console.log(`Auth data: ${JSON.stringify(auth.data)}`)
		const project: Project = Project.create("My Project", "Empty project...", auth.data.userId)

		const initializedModulePromise = this.aiCodingService.initializeReactModule(project.id, auth)
		const cloudProfilePromise = this.projectDeploymentService.createCloudProfile(project.id, auth)
		const saveProjectPromise = this.projectRepository.save(project)

		const [module] = await Promise.all([initializedModulePromise, saveProjectPromise, cloudProfilePromise])

		const entryPoint: EntryPoint = await this.projectDeploymentService.deployModule(project.id, module, auth)

		const response: CreateProjectResponse = {
			project,
			entryPoint,
		}
		return response
	}
}
