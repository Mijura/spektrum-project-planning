import { Module } from "@app/types/module"

export interface AICodingService {
	initializeReactModule(projectId: string): Promise<Module>
}
