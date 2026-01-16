import { Module } from "@app/types/module"

export interface ProjectDeploymentService {
	deployModule(projectId: string, module: Module): Promise<EntryPoint>
	createCloudProfile(projectId: string): Promise<void>
}
