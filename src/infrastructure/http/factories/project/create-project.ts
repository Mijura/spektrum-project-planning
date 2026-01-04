import { ProjectMapper } from "@infra/http/mappers/project-mapper"
import { CreateProjectPort } from "@app/ports/use-cases/project/create-project"
import { Project } from "@domain/project/project"
import { EntryPoint } from "@jigjoy-io/project-deployment-client"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export function createCreateProjectHandler(createNewProject: CreateProjectPort) {
	return async function createProjectHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {
			if (!body) throw new ValidationError("No page body")

			const { owner } = JSON.parse(body)

			if (!owner) throw new ValidationError("Missing path parameter: owner")

			const result: { project: Project; entryPoint: EntryPoint } = await createNewProject.execute(owner)

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
