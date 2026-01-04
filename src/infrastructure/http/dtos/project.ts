import { ProjectStatus } from "@domain/project/project-status"

export type ProjectDTO = {
	id: string
	ownerId: string
	name: string
	description: string
	created: string
	updated: string | null
	status: ProjectStatus
}
