import { PlanTasksUseCase } from "@app/ports/use-cases/task/plan-tasks"
import { PlanTasks } from "@app/use-cases/task/plan-tasks"
import { taskGenerator } from "@infra/generators/task-generator"
import { createPlanTasksHandler } from "@infra/http/factories/task/plan-tasks"
import { taskRepository } from "@infra/repositories/task-repository"
import { projectDetailsService } from "@infra/services/project-details-service"

export const planTasks: PlanTasksUseCase = new PlanTasks(projectDetailsService, taskRepository, taskGenerator)

export const handler = createPlanTasksHandler(planTasks)
