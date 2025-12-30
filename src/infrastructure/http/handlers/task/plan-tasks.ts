import { createPlanTasksHandler } from "@infrastructure/http/factories/task/plan-tasks"
import { planTasks } from "@infrastructure/dependencies"

export const handler = createPlanTasksHandler(planTasks)
