export interface Agent {
    readonly name: string
    execute(task: any): Promise<any>
}
