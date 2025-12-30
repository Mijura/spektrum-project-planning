import { createUpdateProjectDetailsHandler } from "@infrastructure/http/factories/project/update-project-details"
import { updateProjectDetails } from "@infrastructure/dependencies"

export const handler = createUpdateProjectDetailsHandler(updateProjectDetails)
