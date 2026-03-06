import { Module } from "@app/types/module"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"

export interface AICodingService {
	initializeReactModule(projectId: string, auth: Auth<UserData>): Promise<Module>
}
