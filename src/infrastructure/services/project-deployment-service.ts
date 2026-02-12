import { ProjectDeploymentService } from "@app/ports/services/project-deployment-service"
import { Module } from "@app/types/module"
import { PlatformSDK } from "@jigjoy-ai/platform-sdk"
import { DeployModuleCommand, EnvironmentType } from "@jigjoy-ai/project-deployment-client"

export class JigJoyProjectDeploymentService implements ProjectDeploymentService {
	jigjoyClient: PlatformSDK
	constructor() {
		const endpoint = process.env.JIGJOY_API_ENDPOINT as string
		this.jigjoyClient = new PlatformSDK(endpoint)
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

		const entryPoint = await this.jigjoyClient.deployment.deployModule(deploymentRequest)
		return entryPoint
	}

	async createCloudProfile(projectId: string): Promise<void> {
		return await this.jigjoyClient.deployment.createCloudProfile(projectId)
	}
}
