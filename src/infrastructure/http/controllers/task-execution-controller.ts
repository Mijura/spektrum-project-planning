import { TaskExecution } from "@domain/entities/task-execution"
import { TaskExecutionHeatmap } from "@domain/value-objects/task-execution"
import { fetchTimelineByAccountId, fetchTaskExecutionsHeatmap } from "@infrastructure/dependencies"
import { Request, Response } from "express"

export class TaskExecutionController {

    async fetchHeatmap(req: Request, res: Response): Promise<void> {
        const accountId = req.query.accountId as string
        const startDate = req.query.startDate as string
        const endDate = req.query.endDate as string

        if (!accountId || !startDate || !endDate) {
            res.status(400).json({ error: "Missing required parameters" })
            return
        }

        try {
            const heatmap: TaskExecutionHeatmap[] = await fetchTaskExecutionsHeatmap.execute(accountId, { startDate, endDate })
            res.status(200).json(heatmap)
        } catch (error) {
            console.error("Error during fetching heatmap:", error)
            res.status(500).json({ error: "Internal server error" })
        }
    }
    
}