import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { DynamoDBProjectRepository } from "./project-repository"

export const projectRepository: ProjectRepository = new DynamoDBProjectRepository()
