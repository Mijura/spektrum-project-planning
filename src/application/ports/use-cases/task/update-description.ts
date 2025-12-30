
import { TaskDTO } from "@app/dto/task"

export interface UpdateTaskDescriptionPort {

    /**
     * Updates the description of a task.
     * @param task - The task to update.
     * @returns The updated TaskDTO object.
     */
    execute(task: TaskDTO): Promise<TaskDTO>
}
