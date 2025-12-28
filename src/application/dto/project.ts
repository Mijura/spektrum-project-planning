import { ProjectStatus } from "@domain/project/project-status"

export interface ProjectDTO {
	id: string
	ownerId: string
	name: string
	description: string
	created: string
	updated: string | null
	status: ProjectStatus
  }