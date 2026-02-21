import { ProjectMapper } from "@infra/http/mappers/project-mapper"
import { CreateProjectUseCase } from "@app/ports/use-cases/project/create-project"
import { Project } from "@domain/project/project"
import { EntryPoint } from "@jigjoy-ai/project-deployment-client"
import { errorHandler, Responses, ValidationError } from "@jigjoy-ai/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export function createCreateProjectHandler(createNewProjectUseCase: CreateProjectUseCase) {
	return async function createProjectHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {
			const userId = event.headers?.["x-user-id"] || event.headers?.["X-User-Id"]

			if (!userId) throw new ValidationError("Missing header: x-user-id or X-User-Id")

			const result: { project: Project; entryPoint: EntryPoint } = await createNewProjectUseCase.execute(userId)

			return Responses._201({
				project: ProjectMapper.toDto(result.project),
				entryPoint: result.entryPoint,
			})
		} catch (error) {
			console.error("Error creating project:", error)
			return errorHandler(error)
		}
	}
}
