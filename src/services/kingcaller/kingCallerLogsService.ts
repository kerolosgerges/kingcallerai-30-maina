import { KingCallerAuthService } from './kingCallerAuthService';
import { ApiLog, CallLog, LogsListResponse } from './kingCallerTypes';

export class KingCallerLogsService {
  private authService: KingCallerAuthService;

  constructor(authService: KingCallerAuthService) {
    this.authService = authService;
  }

  async getApiLogs(page: number = 1, limit: number = 10, search: string = ''): Promise<LogsListResponse<ApiLog>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search })
    });
    
    const response = await this.authService.makeAuthenticatedRequest(
      `/v1/logs/api-logs?${params.toString()}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch API logs: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result;
  }

  async getCallLogs(page: number = 1, limit: number = 10, search: string = ''): Promise<LogsListResponse<CallLog>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search })
    });
    
    const response = await this.authService.makeAuthenticatedRequest(
      `/v1/logs/call-logs?${params.toString()}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch call logs: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result;
  }

  async getCallLogById(logId: string): Promise<CallLog> {
    const response = await this.authService.makeAuthenticatedRequest(
      `/v1/logs/call-logs/${logId}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch call log: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  }

  async getLogsDownloadLink(): Promise<{ downloadUrl: string }> {
    const response = await this.authService.makeAuthenticatedRequest(
      `/v1/logs/download/`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to get download link: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  }

  async downloadLogsFile(logId: string): Promise<{ downloadUrl: string }> {
    const response = await this.authService.makeAuthenticatedRequest(
      `/v1/logs/download/${logId}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to download logs file: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  }

  async downloadCallAudio(logId: string): Promise<{ audioUrl: string }> {
    const response = await this.authService.makeAuthenticatedRequest(
      `/v1/logs/audio/${logId}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to download call audio: ${response.statusText}`);
    }
    
    const result = await response.json();
    return result.data;
  }
}