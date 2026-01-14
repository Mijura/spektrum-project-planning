import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { Project } from "@domain/project/project"
import { ProjectStatus } from "@domain/project/project-status"

export class InMemoryProjectRepository implements ProjectRepository {
	private storage: Map<string, Project> = new Map()

	async save(project: Project): Promise<Project> {
		this.storage.set(project.id, project)
		return project
	}

	async get(projectId: string): Promise<Project> {
		const project = this.storage.get(projectId)
		if (!project) {
			throw new Error(`Project not found: ${projectId}`)
		}
		return project
	}

	async getAll(ownerId: string): Promise<Project[]> {
		return Array.from(this.storage.values()).filter((p) => p.ownerId === ownerId)
	}

	async getAllByStatus(ownerId: string, status: ProjectStatus): Promise<Project[]> {
		return Array.from(this.storage.values()).filter((p) => p.ownerId === ownerId && p.status === status)
	}
}
