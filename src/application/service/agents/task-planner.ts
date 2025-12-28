import { Task } from "@domain/task/task"

export interface TaskPlannerPort {
    /**
     * Plans tasks for a given project
     * @param task The task to plan tasks for
     * @returns The planned tasks
     */
    generateTasks(task: Task): Promise<Task[]>
}