import { taskExecutionController } from "@infrastructure/dependencies"
import express, { Request, Response } from "express"

const router = express.Router()

router.get("/task-execution/project/timeline", (req: Request, res: Response) => taskExecutionController.fetchTimelineByProjectId(req, res))

router.get("/task-execution/account/timeline", (req: Request, res: Response) => taskExecutionController.fetchTimelineByAccountId(req, res))

router.get("/task-execution/heatmap", (req: Request, res: Response) => taskExecutionController.fetchHeatmap(req, res))

export { router as taskExecutionRouter }