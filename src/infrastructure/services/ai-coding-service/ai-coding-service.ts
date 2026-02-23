import { AICodingService } from "@app/ports/services/ai-coding-service"
import { Module } from "@app/types/module"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"
import { SpektrumClient } from "@jigjoy-ai/spektrum-client"

export class JigJoyAICodingService implements AICodingService {
	spektrumClient: SpektrumClient
	constructor() {
		const endpoint = process.env.JIGJOY_API_ENDPOINT as string
		this.spektrumClient = new SpektrumClient(endpoint, {
			kind: "internal",
			token: process.env.INTERNAL_SERVICE_TOKEN as string,
		})
	}

	async initializeReactModule(projectId: string, auth: Auth<UserData>): Promise<Module> {
		return await this.spektrumClient.ai.initalizeModule(projectId, auth)
	}
}
