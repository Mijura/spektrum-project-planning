import { createUpdateProjectDetailsHandler } from "@infra/http/factories/project/update-project-details"
import { updateProjectDetails } from "@infra/dependencies"

export const handler = createUpdateProjectDetailsHandler(updateProjectDetails)
