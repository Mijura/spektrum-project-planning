import { TaskRepository } from "@app/ports/repositories/task-repository"
import { DynamoDBTaskRepository } from "./task-repository"

export const taskRepository: TaskRepository = new DynamoDBTaskRepository()
