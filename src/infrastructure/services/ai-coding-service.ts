import { AICodingService } from "@app/ports/services/ai-coding-service"
import { AICodingClient } from "@jigjoy-io/ai-coding-client"

export class JigJoyAICodingService implements AICodingService {
	aiCodingClient: AICodingClient
	constructor() {
		this.aiCodingClient = new AICodingClient(process.env.AI_CODING_ENDPOINT || "")
	}

	async initializeReactModule(projectId: string): Promise<Module> {
		return await this.aiCodingClient.initializeReactModule(projectId)
	}
}
