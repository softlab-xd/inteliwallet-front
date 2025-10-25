import { API_CONFIG } from "../config/api"

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>
}

class ApiClient {
  private baseURL: string
  private timeout: number

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL
    this.timeout = API_CONFIG.TIMEOUT
  }

  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("authToken")
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options

    let url = `${this.baseURL}${endpoint}`
    if (params) {
      const queryString = new URLSearchParams(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      ).toString()
      url += `?${queryString}`
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    }

    const token = this.getAuthToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new ApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData
        )
      }

      if (response.status === 204) {
        return {} as T
      }

      return await response.json()
    } catch (error) {
      clearTimeout(timeoutId)

      if (error instanceof ApiError) {
        throw error
      }

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new ApiError("Request timeout", 408)
        }
        throw new ApiError(error.message, 0)
      }

      throw new ApiError("Unknown error occurred", 0)
    }
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" })
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async patch<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" })
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export const apiClient = new ApiClient()
