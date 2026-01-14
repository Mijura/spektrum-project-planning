export interface ProjectDeploymentService {
	deployModule(projectId: string, module: Module): Promise<EntryPoint>
	createCloudProfile(projectId: string): Promise<void>
}
