import { ProjectDTO } from "@application/dto/project"
import { ProjectDetails } from "@domain/value-objects/project"
import { updateProjectDetails } from "@infrastructure/dependencies"
import { errorHandler, Responses, schemaValidator, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export async function updateProjectDetailsHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
		if (!body) throw new ValidationError("No page body")

        const { id, name, description }  = JSON.parse(body)
        //schemaValidator(schema, commit)

		const projectDetails: ProjectDetails = {
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