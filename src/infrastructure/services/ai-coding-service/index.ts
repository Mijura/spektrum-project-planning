import { AICodingService } from "@app/ports/services/ai-coding-service"
import { JigJoyAICodingService } from "@infra/services/ai-coding-service/ai-coding-service"

export const aiCodingService: AICodingService = new JigJoyAICodingService()
