import { ProjectDeploymentService } from "@app/ports/services/project-deployment-service"
import { Module } from "@app/types/module"
import { SpektrumClient } from "@jigjoy-ai/spektrum-client"
import { DeployModuleCommand, EnvironmentType } from "@jigjoy-ai/project-deployment-client"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export class JigJoyProjectDeploymentService implements ProjectDeploymentService {
	spektrumClient: SpektrumClient
	constructor() {
		const endpoint = process.env.JIGJOY_API_ENDPOINT as string
		this.spektrumClient = new SpektrumClient(endpoint, {
			kind: "internal",
			token: process.env.INTERNAL_SERVICE_TOKEN as string,
		})
	}

	async deployModule(projectId: string, module: Module, auth: Auth<UserData>): Promise<EntryPoint> {
		const deploymentRequest: DeployModuleCommand = {
			projectId: projectId,
			moduleId: module.id,
			moduleType: module.type,
			versionControlId: module.repositoryId,
			environmentType: EnvironmentType.DEV,
			setAsEntryPoint: true,
		}

		const entryPoint = await this.spektrumClient.deployment.deployModule(deploymentRequest, auth)
		return entryPoint
	}

	async createCloudProfile(projectId: string, auth: Auth<UserData>): Promise<void> {
		return await this.spektrumClient.deployment.createCloudProfile(projectId, auth)
	}
}
