import { ProjectMapper } from "@infra/http/mappers/project-mapper"
import { CreateProjectUseCase } from "@app/ports/use-cases/project/create-project"
import { Project } from "@domain/project/project"
import { EntryPoint } from "@jigjoy-ai/project-deployment-client"
import { errorHandler, Responses, ValidationError } from "@jigjoy-ai/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export function createCreateProjectHandler(createNewProjectUseCase: CreateProjectUseCase) {
	return async function createProjectHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {
			if (!body) throw new ValidationError("No page body")

			const { owner } = JSON.parse(body)

			if (!owner) throw new ValidationError("Missing path parameter: owner")

			const result: { project: Project; entryPoint: EntryPoint } = await createNewProjectUseCase.execute(owner)

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
