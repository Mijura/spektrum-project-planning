declare enum ModuleType {
	FRONTEND = "FRONTEND",
}

type Module = {
	id: string
	repositoryId: string
	type: ModuleType
}
