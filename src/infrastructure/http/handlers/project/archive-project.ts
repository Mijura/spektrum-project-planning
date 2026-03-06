import { ArchiveProjectUseCase } from "@app/ports/use-cases/project/archive-project"
import { ArchiveProject } from "@app/use-cases/project/archive-project"
import { createArchiveProjectHandler } from "@infra/http/factories/project/archive-project"
import { projectRepository } from "@infra/repositories/project-repository"

export const archiveProject: ArchiveProjectUseCase = new ArchiveProject(projectRepository)

export const handler = createArchiveProjectHandler(archiveProject)
