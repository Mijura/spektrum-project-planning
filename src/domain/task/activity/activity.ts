
import { v4 as uuidv4 } from "uuid"
import { ActivityMetadata } from "./activities/activitiy-metadata"
import { ActivityType } from "./activity-type"

export class Activity<T> {
    constructor(
      public readonly id: string,
      public readonly type: ActivityType,
      public readonly projectId: string,
      public readonly taskId: string,
      public readonly userId: string,
      public readonly metadata: T,
      public readonly occurredAt: string
    ) {}
    
    static rehydrate(data: {
        id: string
        type: ActivityType
        projectId: string
        taskId: string
        userId: string
        metadata: ActivityMetadata
        occurredAt: string
    }): Activity<ActivityMetadata> {
        return new Activity(data.id, data.type, data.projectId, data.taskId, data.userId, data.metadata, data.occurredAt)
    }

    protected static generateId() {
        return uuidv4()
    }
      
    protected static now() {
        return new Date().toISOString()
    }
  }
  