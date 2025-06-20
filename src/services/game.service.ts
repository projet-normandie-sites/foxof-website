// src/services/game.service.ts
import apiClient from '@/lib/axios'

/**
 * Platform interface based on API response
 */
export interface Platform {
    '@id': string
    '@type': string
    id: number
    name: string
    slug: string
}

/**
 * Game interface based on API response
 */
export interface Game {
    '@id': string
    '@type': string
    id: number
    name: string
    picture: string
    cover: string
    slug: string
    finishedAt: string | null
    finishedTimes: number | null
    isSearched: boolean
    platform: Platform
}

/**
 * API response interface for game collection
 */
interface GameCollectionResponse {
    '@context': string
    '@id': string
    '@type': string
    'hydra:totalItems': number
    'hydra:member': Game[]
}

/**
 * Interface for game search and filtering parameters
 */
export interface GameFilters {
    page?: number
    itemsPerPage?: number
    name?: string
    isSearched?: boolean
    'order[id]'?: 'asc' | 'desc'
    'order[name]'?: 'asc' | 'desc'
    'platform.slug'?: string
}

/**
 * Game service for fetching games from the API
 */
class GameService {
    /**
     * Get games with filtering and pagination
     * @param filters Search and pagination parameters
     * @returns Promise with game collection
     */
    async getGames(filters: GameFilters = {}): Promise<GameCollectionResponse> {
        const response = await apiClient.get<GameCollectionResponse>('/api/games', {
            params: filters
        })
        return response.data
    }

    /**
     * Get searched games only
     * @returns Promise with searched games collection
     */
    async getSearchedGames(): Promise<Game[]> {
        const response = await apiClient.get<GameCollectionResponse>('/api/games', {
            params: {
                'isSearched': true
            }
        })
        return response.data['hydra:member']
    }

    /**
     * Get finished games only
     * @returns Promise with finished games collection
     */
    async getFinishedGames(): Promise<Game[]> {
        const response = await apiClient.get<GameCollectionResponse>('/api/games', {
            params: {
                'exists[finishedAt]': true
            }
        })
        return response.data['hydra:member']
    }

    /**
     * Get game by ID
     * @param id Game ID
     * @returns Promise with game data
     */
    async getGame(id: number): Promise<Game> {
        const response = await apiClient.get<Game>(`/api/games/${id}`)
        return response.data
    }

    /**
     * Get game cover URL
     * @param gameId Game ID
     * @returns Direct URL to the game's cover image
     */
    getGameCoverUrl(gameId: number): string {
        return `${import.meta.env.VITE_ROOT_API}/game/${gameId}/cover`
    }

    /**
     * Get game picture URL
     * @param gameId Game ID
     * @returns Direct URL to the game's picture image
     */
    getGamePictureUrl(gameId: number): string {
        return `${import.meta.env.VITE_ROOT_API}/game/${gameId}/picture`
    }

    /**
     * Search games by name
     * @param query Search query
     * @param filters Additional filters
     * @returns Promise with game collection
     */
    async searchGames(query: string, filters: Omit<GameFilters, 'name'> = {}): Promise<GameCollectionResponse> {
        return this.getGames({
            ...filters,
            name: query
        })
    }
}

export default new GameService()