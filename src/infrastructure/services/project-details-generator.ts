import { Task } from "@domain/task/task" 
import { z } from "zod"
import { Agent, Command } from "@jigjoy-io/mosaic"

export class ProjectDetailsGenerator {

    async generateProjectDetails(task: Task): Promise<{ name: string, description: string }>{

        const outputSchema = z.object({
            name: z.string().describe("Short and concise title of the project."),
            description: z.string().describe("Project description withtout technical details in single sentence.")
        })

        const prompt = `
                
            ### **Your Task:**
            1) Based on the task details, create a project name and description.
    
            ### **Task Details:** ${JSON.stringify(task)}


            Important:
                - Respond only in valid JSON. The JSON object you return should match the following schema.

            ### **Output Example**
            {
                "name": "Simple Note-taking app",
                "description": "A simple note-taking app that allows you to create, edit, and delete notes."
            }
        `

        const command: Command = {
            model: 'gpt-5.1',
            task: prompt,
            structuredOutput: outputSchema
        }

        const agent = new Agent(command)
        const projectDetails: { name: string, description: string } = await agent.act()
        return projectDetails
    }
}