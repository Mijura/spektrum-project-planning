import { Request, Response } from "express"
import { ProjectDtoMapper } from "@application/mappers/project-dto-mappers"
import { fetchProject, fetchProjects, archiveProject, updateProjectDetails, planTasksWithAI } from "@infrastructure/dependencies"

export class ProjectController {

	async fetchProject(req: Request, res: Response): Promise<void> {
		try {
			const { projectId } = req.params
			const project = await fetchProject.execute(projectId)
			const projectDTO = ProjectDtoMapper.toDto(project)
			res.json(projectDTO)
		} catch (error) {
			// TODO: Handle Project Not Found
			console.error("Error fetching project:", error)
			res.status(500).json({ message: "Error fetching project" })
		}
	}

	async fetchProjects(req: Request, res: Response): Promise<any> {

		try {
			const { ownerId } = req.params
			console.log(`Fetching all projects for ${ownerId}`)
			const projects = await fetchProjects.execute(ownerId)
			const projectDtos = ProjectDtoMapper.toDtos(projects)
			res.json(projectDtos)
		} catch (error) {
			// TODO: Handle Project Not Found
			console.error("Error fetching projects:", error)
			res.status(500).json({ message: "Error fetching projects" })
		}

    }

	async archiveProject(req: Request, res: Response): Promise<void> {
		try {
			const { projectId } = req.body
			const project = await archiveProject.execute(projectId)
			res.json(project)
		} catch (error) {
			// TODO: Handle Project Not Found
			console.error("Error changing project status:", error)
			res.status(500).json({ message: "Error changing project status" })
		}
	}

	async updateProjectDetails(request: Request, response: Response): Promise<any> {
        try {
            const { id, name, description } = request.body

            const project = await updateProjectDetails.execute(id, name, description)

            return response.status(200).json(project)
        } catch (error) {
            console.error("Error in UpdateProjectDetailsController:", error)
            return response.status(400).json({
                error: error instanceof Error ? error.message : "Failed to update project details"
            })
        }
    }

}
