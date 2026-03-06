import { ProjectDTO } from "@infra/http/dtos/project"
import { ProjectMapper } from "@infra/http/mappers/project-mapper"
import { ArchiveProjectParams, ArchiveProjectUseCase } from "@app/ports/use-cases/project/archive-project"
import { Project } from "@domain/project/project"
import { errorHandler, Responses, ValidationError } from "@jigjoy-ai/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { extractAuthData } from "@heksagon/http"
import { UserData } from "@jigjoy-ai/auth"
import { Auth } from "@heksagon/app"

export function createArchiveProjectHandler(archiveProjectUseCase: ArchiveProjectUseCase) {
	return async function archiveProjectHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {
			if (!event.body) throw new ValidationError("No page body")

			const { projectId } = JSON.parse(event.body)

			if (!projectId) 
				throw new ValidationError("Missing path parameter: projectId")

			const auth: Auth<UserData> = extractAuthData(event.headers)
			
			const params: ArchiveProjectParams = {
				projectId,
			}
			const project: Project = await archiveProjectUseCase.execute(auth, params)
			const projectDTO: ProjectDTO = ProjectMapper.toDto(project)

			return Responses._200(projectDTO)
		} catch (error) {
			console.error("Error archiving project:", error)
			return errorHandler(error)
		}
	}
}
