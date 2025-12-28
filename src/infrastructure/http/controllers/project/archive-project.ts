
import { ProjectDTO } from "@application/dto/project"
import { archiveProject } from "@infrastructure/dependencies"
import { errorHandler, Responses, schemaValidator, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export async function archiveProjectHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	try {
		if (!body) throw new ValidationError("No page body")

        const { projectId } = JSON.parse(body)
        //schemaValidator(schema, commit)

		const projectDTO: ProjectDTO = await archiveProject.execute(projectId)

		return Responses._200(projectDTO)
	} catch (error) {
		console.error("Error archiving project:", error)
		return errorHandler(error)
	}
}