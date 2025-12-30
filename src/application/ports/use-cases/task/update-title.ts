import { TaskDTO } from "@app/dto/task"

export interface UpdateTaskTitlePort {

    /**
     * Updates the title of a task.
     * @param task - The task to update.
     * @returns The updated TaskDTO object.
     */
    execute(task: TaskDTO): Promise<TaskDTO>
}
