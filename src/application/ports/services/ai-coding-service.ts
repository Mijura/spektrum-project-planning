export interface AICodingService {
	initializeReactModule(projectId: string): Promise<Module>
}
