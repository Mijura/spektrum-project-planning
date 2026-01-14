import { ProjectDeploymentService } from "@app/ports/services/project-deployment-service"
import { DeployModuleCommand, EnvironmentType, ProjectDeploymentClient } from "@jigjoy-io/project-deployment-client"

export class JigJoyProjectDeploymentService implements ProjectDeploymentService {
	projectDeploymentClient: ProjectDeploymentClient
	constructor() {
		const endpoint = process.env.PROJECT_DEPLOYMENT_ENDPOINT
		if (!endpoint) {
			throw new Error("PROJECT_DEPLOYMENT_ENDPOINT is not set")
		}

		this.projectDeploymentClient = new ProjectDeploymentClient(endpoint)
	}

	async deployModule(projectId: string, module: Module): Promise<EntryPoint> {
		const deploymentRequest: DeployModuleCommand = {
			projectId: projectId,
			moduleId: module.id,
			moduleType: module.type,
			versionControlId: module.repositoryId,
			environmentType: EnvironmentType.DEV,
			setAsEntryPoint: true,
		}

		const entryPoint = await this.projectDeploymentClient.deployModule(deploymentRequest)
		return entryPoint
	}

	async createCloudProfile(projectId: string): Promise<void> {
		return await this.projectDeploymentClient.createCloudProfile(projectId)
	}
}
