import { createArchiveProjectHandler } from "@infra/http/factories/project/archive-project"
import { archiveProject } from "@infra/dependencies"

export const handler = createArchiveProjectHandler(archiveProject)