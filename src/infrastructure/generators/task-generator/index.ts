import { TaskGenerator } from "@app/ports/generators/task-generator"
import { MosaicTaskGenerator } from "./task-generator"

export const taskGenerator: TaskGenerator = new MosaicTaskGenerator()
