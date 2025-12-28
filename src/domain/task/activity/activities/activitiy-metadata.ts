import { CommentLeftMetadata } from "./comment-left/metadata"
import { DescriptionUpdatedMetadata } from "./description-updated/metadata"
import { FinishedWorkMetadata } from "./finished-work/metadata"
import { StartedWorkMetadata } from "./started-work/metadata"
import { TaskCreatedMetadata } from "./task-created/metadata"
import { TitleUpdatedMetadata } from "./title-updated/metadata"

export type ActivityMetadata = 
    CommentLeftMetadata | 
    TitleUpdatedMetadata | 
    DescriptionUpdatedMetadata | 
    TaskCreatedMetadata |
    StartedWorkMetadata |
    FinishedWorkMetadata