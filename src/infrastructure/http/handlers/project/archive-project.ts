import { createArchiveProjectHandler } from "@infrastructure/http/factories/project/archive-project"
import { archiveProject } from "@infrastructure/dependencies"

export const handler = createArchiveProjectHandler(archiveProject)