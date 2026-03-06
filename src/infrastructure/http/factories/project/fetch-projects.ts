import { ProjectDTO } from "@infra/http/dtos/project"
import { ProjectMapper } from "@infra/http/mappers/project-mapper"
import { FetchProjectsUseCase } from "@app/ports/use-cases/project/fetch-projects"
import { Project } from "@domain/project/project"
import { errorHandler, Responses } from "@jigjoy-ai/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { Auth } from "@heksagon/app"
import { UserData } from "@jigjoy-ai/auth"
import { extractAuthData } from "@heksagon/http"

export function createFetchProjectsHandler(fetchProjectsUseCase: FetchProjectsUseCase) {
	return async function fetchProjectsHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {

			const auth: Auth<UserData> = extractAuthData(event.headers)

			const projects: Project[] = await fetchProjectsUseCase.execute(auth)
			const projectDTOs: ProjectDTO[] = ProjectMapper.toDtos(projects)

			return Responses._200(projectDTOs)
		} catch (error) {
			console.error("Error fetching projects:", error)
			return errorHandler(error)
		}
	}
}
