// Utility for communicating with the robot through our Next.js API proxy
// This prevents CORS issues by routing through our backend

export interface RobotApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export class RobotClient {
  private static baseUrl = '/api/robot'

  static async get<T = any>(endpoint: string): Promise<RobotApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}?endpoint=${encodeURIComponent(endpoint)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error('Robot API GET error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  static async post<T = any>(endpoint: string, payload: any): Promise<RobotApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}?endpoint=${encodeURIComponent(endpoint)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error('Robot API POST error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  // Example methods for common robot operations
  static async getStatus() {
    return this.get('status')
  }

  static async sendCommand(command: string) {
    return this.post('command', { command })
  }

  static async getStreamUrl() {
    return this.get('stream-url')
  }
}

export default RobotClient