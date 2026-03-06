import { RecordWorkUseCase } from "@app/ports/use-cases/task/record-work"
import { RecordWork } from "@app/use-cases/task/record-work"
import { createRecordWorkHandler } from "@infra/http/factories/task/record-work"
import { taskRepository } from "@infra/repositories/task-repository"

export const recordWork: RecordWorkUseCase = new RecordWork(taskRepository)

export const handler = createRecordWorkHandler(recordWork)
