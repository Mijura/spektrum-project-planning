import { createRecordWorkHandler } from "@infra/http/factories/task/record-work"
import { recordWork } from "@infra/dependencies"

export const handler = createRecordWorkHandler(recordWork)
