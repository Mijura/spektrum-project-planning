import { AICodingService } from "@app/ports/services/ai-coding-service"
import { Module } from "@app/types/module"
import { PlatformSDK } from "@jigjoy-ai/platform-sdk"

export class JigJoyAICodingService implements AICodingService {
	jigjoyClient: PlatformSDK
	constructor() {
		const endpoint = process.env.JIGJOY_API_ENDPOINT as string
		this.jigjoyClient = new PlatformSDK(endpoint)
	}

	async initializeReactModule(projectId: string): Promise<Module> {
		return await this.jigjoyClient.ai.initalizeModule(projectId)
	}
}
