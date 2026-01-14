import { ProjectDeploymentService } from "@app/ports/services/project-deployment-service"

export class InMemoryProjectDeploymentService implements ProjectDeploymentService {
	private cloudProfiles: Set<string> = new Set()
	private byProjectId: Map<string, EntryPoint> = new Map()
	private defaultEntryPoint: EntryPoint = {
		moduleId: "default-module-id",
		assetBaseUrl: "https://assets.example.com",
		publicAppUrl: "https://app.example.com",
	}

	/**
	 * Provide deterministic output for a specific projectId.
	 */
	seed(projectId: string, entryPoint: EntryPoint) {
		this.byProjectId.set(projectId, entryPoint)
	}

	/**
	 * Provide fallback output when no project-specific value is seeded.
	 */
	setDefault(entryPoint: EntryPoint) {
		this.defaultEntryPoint = entryPoint
	}

	/**
	 * Check if a cloud profile was created for a project.
	 */
	hasCloudProfile(projectId: string): boolean {
		return this.cloudProfiles.has(projectId)
	}

	async createCloudProfile(projectId: string): Promise<void> {
		this.cloudProfiles.add(projectId)
	}

	async deployModule(projectId: string, module: Module): Promise<EntryPoint> {
		const entryPoint = this.byProjectId.get(projectId) ?? this.defaultEntryPoint
		return {
			...entryPoint,
			moduleId: module.id,
		}
	}
}
