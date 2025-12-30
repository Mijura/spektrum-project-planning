
import { ProjectDTO } from "@app/dto/project"
import { ArchiveProjectPort } from "@app/ports/use-cases/project/archive-project"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"


export function createArchiveProjectHandler(archiveProject: ArchiveProjectPort) {

	return async function archiveProjectHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
        try {
            if (!body) throw new ValidationError("No page body")
    
            const { projectId } = JSON.parse(body)
    
            if (!projectId) 
                throw new ValidationError("Missing path parameter: projectId")
    
            const projectDTO: ProjectDTO = await archiveProject.execute(projectId)
    
            return Responses._200(projectDTO)
        } catch (error) {
            console.error("Error archiving project:", error)
            return errorHandler(error)
        }
    }
}