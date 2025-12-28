import { ProjectStatus } from "@domain/value-objects/project"

export interface ProjectDTO {
	id: string
	ownerId: string
	name: string
	description: string
	created: string
	updated: string | null
	status: ProjectStatus
  }