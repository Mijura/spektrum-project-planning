import { Project } from "@domain/project/project"
import { ProjectDTO } from "@application/dto/project"

export class ProjectMapper {
  
  /** Maps a single domain Project entity to a DTO */
  static toResponse(project: Project): ProjectDTO {
    return {
      id: project.id,
      ownerId: project.ownerId,
      name: project.name,
      description: project.description,
      created: project.created,
      updated: project.updated,
      status: project.status
    }
  }

  /** Maps an array of domain Project entities to DTOs */
  static toDtos(projects: Project[]): ProjectDTO[] {
    return projects.map(this.toResponse)
  }
}
