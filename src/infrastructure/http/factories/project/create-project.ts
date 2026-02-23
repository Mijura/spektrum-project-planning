import { ProjectMapper } from "@infra/http/mappers/project-mapper"
import { CreateProjectResponse, CreateProjectUseCase } from "@app/ports/use-cases/project/create-project"
import { errorHandler, Responses } from "@jigjoy-ai/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"
import { extractAuthData } from "@heksagon/http"

export function createCreateProjectHandler(createNewProjectUseCase: CreateProjectUseCase) {
	return async function createProjectHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {
			const auth: Auth<UserData> = extractAuthData(event)

			const result: CreateProjectResponse = await createNewProjectUseCase.execute(auth)

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
