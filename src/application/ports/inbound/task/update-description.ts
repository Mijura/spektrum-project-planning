
import { TaskDTO } from "@application/dto/task"

export interface UpdateTaskDescription {

    /**
     * Updates the description of a task.
     * @param task - The task to update.
     * @returns The updated TaskDTO object.
     */
    execute(task: TaskDTO): Promise<TaskDTO>
}
