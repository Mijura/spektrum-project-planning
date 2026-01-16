export declare enum ModuleType {
	FRONTEND = "FRONTEND",
}

export type Module = {
	id: string
	repositoryId: string
	type: ModuleType
}
