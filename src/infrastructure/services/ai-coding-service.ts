import { AICodingService } from "@app/ports/services/ai-coding-service"
import { Module } from "@app/types/module"
import { AICodingClient } from "@jigjoy-io/ai-coding-client"

export class JigJoyAICodingService implements AICodingService {
	aiCodingClient: AICodingClient
	constructor() {
		const endpoint = process.env.AI_CODING_ENDPOINT as string
		this.aiCodingClient = new AICodingClient(endpoint)
	}

	async initializeReactModule(projectId: string): Promise<Module> {
		return await this.aiCodingClient.initializeReactModule(projectId)
	}
}
