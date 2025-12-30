import { ProjectDTO } from "@app/dto/project"
import { ProjectDetailsDTO } from "@app/dto/project-details"
import { UpdateProjectDetailsPort } from "@app/ports/use-cases/project/update-details"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"


export function createUpdateProjectDetailsHandler(updateProjectDetails: UpdateProjectDetailsPort) {

	return async function updateProjectDetailsHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
		try {
			if (!body) throw new ValidationError("No page body")

			const { id, name, description } = JSON.parse(body)

			const projectDetails: ProjectDetailsDTO = {
				name,
				description
			}
			const projectDTO: ProjectDTO = await updateProjectDetails.execute(id, projectDetails)

			return Responses._200(projectDTO)
		} catch (error) {
			console.error("Error updating project:", error)
			return errorHandler(error)
		}
	}
}

