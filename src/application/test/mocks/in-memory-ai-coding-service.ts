import { AICodingService } from "@app/ports/services/ai-coding-service"
import { Module, ModuleType } from "@app/types/module"

export class InMemoryAICodingService implements AICodingService {
	private byProjectId: Map<string, Module> = new Map()
	private defaultModule: Module = {
		id: "default-module-id",
		repositoryId: "default-repository-id",
		type: "FRONTEND" as ModuleType,
	}

	/**
	 * Provide deterministic output for a specific projectId.
	 */
	seed(projectId: string, module: Module) {
		this.byProjectId.set(projectId, module)
	}

	/**
	 * Provide fallback output when no project-specific value is seeded.
	 */
	setDefault(module: Module) {
		this.defaultModule = module
	}

	async initializeReactModule(projectId: string): Promise<Module> {
		return this.byProjectId.get(projectId) ?? this.defaultModule
	}
}
