import { ProjectDTO } from "@infra/http/dtos/project"
import { ProjectMapper } from "@infra/http/mappers/project-mapper"
import { FetchProjectParams, FetchProjectUseCase } from "@app/ports/use-cases/project/fetch-project"
import { Project } from "@domain/project/project"
import { errorHandler, Responses, ValidationError } from "@jigjoy-ai/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { extractAuthData } from "@heksagon/http"
import { UserData } from "@jigjoy-ai/auth"
import { Auth } from "@heksagon/app"

export function createFetchProjectHandler(fetchProjectUseCase: FetchProjectUseCase) {
	return async function fetchProjectHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {
			const projectId = event.pathParameters?.projectId

			if (!projectId) throw new ValidationError("Missing path parameter: projectId")

			const auth: Auth<UserData> = extractAuthData(event.headers)

			const params: FetchProjectParams = {
				projectId,
			}

			const project: Project = await fetchProjectUseCase.execute(auth, params)
			const projectDTO: ProjectDTO = ProjectMapper.toDto(project)

			return Responses._200(projectDTO)
		} catch (error) {
			console.error("Error fetching project:", error)
			return errorHandler(error)
		}
	}
}
