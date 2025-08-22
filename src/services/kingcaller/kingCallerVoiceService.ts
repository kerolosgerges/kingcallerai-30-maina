
import { 
  Voice, 
  VoiceListResponse, 
  VoiceDetails,
  AmbientSound, 
  AmbientSoundResponse,
  TestVoice,
  RequestTestCallRequest,
  CreateTestVoiceRequest,
  ApiResponse
} from './kingCallerTypes';
import { KingCallerAuthService } from './kingCallerAuthService';

export class KingCallerVoiceService {
  constructor(private authService: KingCallerAuthService) {}

  async getVoiceList(): Promise<Voice[]> {
    try {
      console.log('KingCaller: Fetching voice list...');
      const response = await this.authService.makeAuthenticatedRequest('/api/v1/assistants/voice-list');

      if (!response.ok) {
        const errorText = await response.text();
        console.error('KingCaller: Voice list fetch failed:', response.status, errorText);
        throw new Error(`Failed to fetch voices: ${response.status} - ${errorText}`);
      }

      const data: VoiceListResponse = await response.json();
      console.log('KingCaller: Fetched voices:', data.data);
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error fetching voice list:', error);
      throw error;
    }
  }

  async getAmbientSounds(): Promise<AmbientSound[]> {
    try {
      console.log('KingCaller: Fetching ambient sounds...');
      const response = await this.authService.makeAuthenticatedRequest('/v1/assistants/ambient-sound/list');

      if (!response.ok) {
        const errorText = await response.text();
        console.error('KingCaller: Ambient sounds fetch failed:', response.status, errorText);
        throw new Error(`Failed to fetch ambient sounds: ${response.status} - ${errorText}`);
      }

      const data: AmbientSoundResponse = await response.json();
      console.log('KingCaller: Fetched ambient sounds:', data.data);
      return data.success ? data.data : [];
    } catch (error) {
      console.error('Error fetching ambient sounds:', error);
      throw error;
    }
  }

  async getVoiceDetails(voiceId: string): Promise<VoiceDetails> {
    try {
      console.log('KingCaller: Fetching voice details for:', voiceId);
      const response = await this.authService.makeAuthenticatedRequest(`/v1/assistants/voice-list/findById/${voiceId}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('KingCaller: Voice details fetch failed:', response.status, errorText);
        throw new Error(`Failed to fetch voice details: ${response.status} - ${errorText}`);
      }

      const data: ApiResponse<VoiceDetails> = await response.json();
      console.log('KingCaller: Fetched voice details:', data.data);
      return data.data!;
    } catch (error) {
      console.error('Error fetching voice details:', error);
      throw error;
    }
  }

  async getTestVoices(): Promise<TestVoice[]> {
    try {
      console.log('KingCaller: Fetching test voices...');
      const response = await this.authService.makeAuthenticatedRequest('/v1/test-voices/list');

      if (!response.ok) {
        const errorText = await response.text();
        console.error('KingCaller: Test voices fetch failed:', response.status, errorText);
        throw new Error(`Failed to fetch test voices: ${response.status} - ${errorText}`);
      }

      const data: ApiResponse<TestVoice[]> = await response.json();
      console.log('KingCaller: Fetched test voices:', data.data);
      return data.data || [];
    } catch (error) {
      console.error('Error fetching test voices:', error);
      throw error;
    }
  }

  async requestTestCall(request: RequestTestCallRequest): Promise<any> {
    try {
      console.log('KingCaller: Requesting test call:', request);
      const response = await this.authService.makeAuthenticatedRequest('/v1/test-voices/request-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('KingCaller: Test call request failed:', response.status, errorText);
        throw new Error(`Failed to request test call: ${response.status} - ${errorText}`);
      }

      const data: ApiResponse = await response.json();
      console.log('KingCaller: Test call requested successfully:', data);
      return data.data;
    } catch (error) {
      console.error('Error requesting test call:', error);
      throw error;
    }
  }

  async createTestVoice(request: CreateTestVoiceRequest): Promise<TestVoice> {
    try {
      console.log('KingCaller: Creating test voice:', request);
      const response = await this.authService.makeAuthenticatedRequest('/v1/test-voices/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('KingCaller: Test voice creation failed:', response.status, errorText);
        throw new Error(`Failed to create test voice: ${response.status} - ${errorText}`);
      }

      const data: ApiResponse<TestVoice> = await response.json();
      console.log('KingCaller: Test voice created successfully:', data.data);
      return data.data!;
    } catch (error) {
      console.error('Error creating test voice:', error);
      throw error;
    }
  }
}
