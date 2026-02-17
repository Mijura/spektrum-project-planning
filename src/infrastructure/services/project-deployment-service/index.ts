import { ProjectDeploymentService } from "@app/ports/services/project-deployment-service"
import { JigJoyProjectDeploymentService } from "./project-deployment-service"

export const projectDeploymentService: ProjectDeploymentService = new JigJoyProjectDeploymentService()
