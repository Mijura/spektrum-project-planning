import { ProjectDTO } from "@infra/http/dtos/project"
import { ProjectMapper } from "@infra/http/mappers/project-mapper"
import { ArchiveProjectUseCase } from "@app/ports/use-cases/project/archive-project"
import { Project } from "@domain/project/project"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export function createArchiveProjectHandler(archiveProjectUseCase: ArchiveProjectUseCase) {
	return async function archiveProjectHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {
			if (!body) throw new ValidationError("No page body")

			const { projectId } = JSON.parse(body)

			if (!projectId) throw new ValidationError("Missing path parameter: projectId")

			const project: Project = await archiveProjectUseCase.execute(projectId)
			const projectDTO: ProjectDTO = ProjectMapper.toDto(project)

			return Responses._200(projectDTO)
		} catch (error) {
			console.error("Error archiving project:", error)
			return errorHandler(error)
		}
	}
}
