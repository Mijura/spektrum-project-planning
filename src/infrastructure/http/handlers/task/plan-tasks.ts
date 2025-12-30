import { createPlanTasksHandler } from "@infra/http/factories/task/plan-tasks"
import { planTasks } from "@infra/dependencies"

export const handler = createPlanTasksHandler(planTasks)
