import { CreateProjectDTO } from "@application/dto/create-project"
import { createNewProject } from "@infrastructure/dependencies"
import { errorHandler, Responses, ValidationError } from "@jigjoy-io/serverless-core"
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"

export async function createProjectHandler({ body }: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
	
	try {

		if (!body) throw new ValidationError("No page body")

		const { owner }  = JSON.parse(body)

		if (!owner) 
			throw new ValidationError("Missing path parameter: owner")

		const createProjectDTO: CreateProjectDTO = await createNewProject.execute(owner)

		return Responses._201(createProjectDTO)


	} catch (error) {
		console.error("Error creating project:", error)
		return errorHandler(error)
	}
}