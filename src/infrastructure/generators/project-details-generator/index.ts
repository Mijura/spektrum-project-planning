import { ProjectDetailsGenerator } from "@app/ports/generators/project-details-generator"
import { MosaicProjectDetailsGenerator } from "./project-details-generator"

export const projectDetailsGenerator: ProjectDetailsGenerator = new MosaicProjectDetailsGenerator()
