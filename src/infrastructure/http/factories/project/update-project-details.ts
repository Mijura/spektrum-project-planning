import { ProjectDTO } from "@infra/http/dtos/project"
import { ProjectMapper } from "@infra/http/mappers/project-mapper"
import { UpdateProjectDetailsPort } from "@app/ports/use-cases/project/update-details"
import { Project } from "@domain/project/project"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"


export function createUpdateProjectDetailsHandler(updateProjectDetails: UpdateProjectDetailsPort) {

	return async function updateProjectDetailsHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {
			if (!body) throw new ValidationError("No page body")

			const { id, name, description } = JSON.parse(body)


			const project: Project = await updateProjectDetails.execute(id, name, description)
			const projectDTO: ProjectDTO = ProjectMapper.toDto(project)

			return Responses._200(projectDTO)
		} catch (error) {
			console.error("Error updating project:", error)
			return errorHandler(error)
		}
	}
}

