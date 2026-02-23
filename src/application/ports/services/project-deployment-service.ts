import { Module } from "@app/types/module"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export interface ProjectDeploymentService {
	deployModule(projectId: string, module: Module, auth: Auth<UserData>): Promise<EntryPoint>
	createCloudProfile(projectId: string, auth: Auth<UserData>): Promise<void>
}
