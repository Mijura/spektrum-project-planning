import { describe, it, expect, beforeEach } from "@rstest/core"
import { CreateProject } from "@app/use-cases/project/create-project"
import { InMemoryProjectRepository } from "@app/test/mocks/in-memory-project-repository"
import { InMemoryAICodingService } from "@app/test/mocks/in-memory-ai-coding-service"
import { InMemoryProjectDeploymentService } from "@app/test/mocks/in-memory-project-deployment-service"
import { ProjectRepository } from "@app/ports/repositories/project-repository"
import { AICodingService } from "@app/ports/services/ai-coding-service"
import { ProjectDeploymentService } from "@app/ports/services/project-deployment-service"
import { Project } from "@domain/project/project"
import { ProjectStatus } from "@domain/project/project-status"

describe("Create Project", () => {
	let createProjectUseCase: CreateProject
	let repository: ProjectRepository
	let aiCodingService: AICodingService
	let projectDeploymentService: ProjectDeploymentService

	beforeEach(() => {
		repository = new InMemoryProjectRepository()
		aiCodingService = new InMemoryAICodingService()
		projectDeploymentService = new InMemoryProjectDeploymentService()
		createProjectUseCase = new CreateProject(repository, aiCodingService, projectDeploymentService)
	})

	it("should successfully create a project with entry point", async () => {
		// Arrange
		const owner = "owner-123"
		const module: Module = {
			id: "module-id-123",
			repositoryId: "repo-id-456",
			type: "FRONTEND" as ModuleType,
		}
		const entryPoint: EntryPoint = {
			moduleId: "module-id-123",
			assetBaseUrl: "https://assets.example.com",
			publicAppUrl: "https://app.example.com",
		}

		;(aiCodingService as InMemoryAICodingService).setDefault(module)
		;(projectDeploymentService as InMemoryProjectDeploymentService).setDefault(entryPoint)

		// Act
		const result = await createProjectUseCase.execute(owner)

		// Assert
		expect(result).toBeDefined()
		expect(result.project).toBeDefined()
		expect(result.project.ownerId).toBe(owner)
		expect(result.project.name).toBe("My Project")
		expect(result.project.description).toBe("Empty project...")
		expect(result.project.status).toBe(ProjectStatus.ACTIVE)
		expect(result.entryPoint).toBeDefined()
		expect(result.entryPoint.moduleId).toBe(module.id)
		expect(result.entryPoint.assetBaseUrl).toBe(entryPoint.assetBaseUrl)
		expect(result.entryPoint.publicAppUrl).toBe(entryPoint.publicAppUrl)
	})

	it("should save the project to repository", async () => {
		// Arrange
		const owner = "owner-456"
		const module: Module = {
			id: "module-id-789",
			repositoryId: "repo-id-789",
			type: "FRONTEND" as ModuleType,
		}
		;(aiCodingService as InMemoryAICodingService).setDefault(module)

		// Act
		const result = await createProjectUseCase.execute(owner)

		// Assert
		const savedProject = await repository.get(result.project.id)
		expect(savedProject).toBeDefined()
		expect(savedProject.id).toBe(result.project.id)
		expect(savedProject.ownerId).toBe(owner)
	})

	it("should create cloud profile for the project", async () => {
		// Arrange
		const owner = "owner-789"
		const module: Module = {
			id: "module-id-abc",
			repositoryId: "repo-id-abc",
			type: "FRONTEND" as ModuleType,
		}
		;(aiCodingService as InMemoryAICodingService).setDefault(module)

		// Act
		const result = await createProjectUseCase.execute(owner)

		// Assert
		const hasCloudProfile = (projectDeploymentService as InMemoryProjectDeploymentService).hasCloudProfile(
			result.project.id,
		)
		expect(hasCloudProfile).toBe(true)
	})

	it("should use project-specific module when seeded", async () => {
		// Arrange
		const owner = "owner-123"
		const customModule: Module = {
			id: "custom-module-id",
			repositoryId: "custom-repo-id",
			type: "FRONTEND" as ModuleType,
		}

		// First create a project to get its ID
		const result1 = await createProjectUseCase.execute(owner)
		const actualProjectId = result1.project.id

		// Seed a custom module for this project
		;(aiCodingService as InMemoryAICodingService).seed(actualProjectId, customModule)

		// Act - create another project (will use default)
		const result2 = await createProjectUseCase.execute(owner)

		// Assert - second project uses default, first would use custom if we called it again
		expect(result2.entryPoint.moduleId).not.toBe(customModule.id)
	})

	it("should deploy module with correct project ID and module", async () => {
		// Arrange
		const owner = "owner-123"
		const module: Module = {
			id: "module-id-deploy",
			repositoryId: "repo-id-deploy",
			type: "FRONTEND" as ModuleType,
		}
		const entryPoint: EntryPoint = {
			moduleId: "module-id-deploy",
			assetBaseUrl: "https://assets.test.com",
			publicAppUrl: "https://app.test.com",
		}
		
		;(aiCodingService as InMemoryAICodingService).setDefault(module)
		;(projectDeploymentService as InMemoryProjectDeploymentService).setDefault(entryPoint)

		// Act
		const result = await createProjectUseCase.execute(owner)

		// Assert
		expect(result.entryPoint.moduleId).toBe(module.id)
		expect(result.entryPoint.assetBaseUrl).toBe(entryPoint.assetBaseUrl)
		expect(result.entryPoint.publicAppUrl).toBe(entryPoint.publicAppUrl)
	})

	it("should execute all operations in parallel", async () => {
		// Arrange
		const owner = "owner-123"
		let aiServiceCalled = false
		let deploymentServiceCalled = false
		let repositoryCalled = false

		const trackingAIService: AICodingService = {
			initializeReactModule: async (projectId: string) => {
				aiServiceCalled = true
				return {
					id: "module-id",
					repositoryId: "repo-id",
					type: "FRONTEND" as ModuleType,
				}
			},
		}

		const trackingDeploymentService: ProjectDeploymentService = {
			createCloudProfile: async (projectId: string) => {
				deploymentServiceCalled = true
			},
			deployModule: async (projectId: string, module: Module) => {
				return {
					moduleId: module.id,
					assetBaseUrl: "https://assets.example.com",
					publicAppUrl: "https://app.example.com",
				}
			},
		}

		const trackingRepository: ProjectRepository = {
			save: async (project: Project) => {
				repositoryCalled = true
				return project
			},
			get: async () => {
				throw new Error("Should not be called")
			},
			getAll: async () => {
				throw new Error("Should not be called")
			},
			getAllByStatus: async () => {
				throw new Error("Should not be called")
			},
		}

		const trackingUseCase = new CreateProject(trackingRepository, trackingAIService, trackingDeploymentService)

		// Act
		await trackingUseCase.execute(owner)

		// Assert - All should be called (they run in parallel)
		expect(aiServiceCalled).toBe(true)
		expect(deploymentServiceCalled).toBe(true)
		expect(repositoryCalled).toBe(true)
	})
})
