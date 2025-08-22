
import { 
  Agent, 
  AgentListResponse, 
  AgentSpeechSettings, 
  UpdateAgentResponse, 
  CreateKingCallerAgentRequest, 
  CreateKingCallerAgentResponse,
  CreateAssistantRequest,
  UpdateAssistantRequest,
  AssistantDetails,
  ScrapWebsiteRequest,
  ScrapWebsiteResponse,
  ApiResponse
} from './kingCallerTypes';
import { KingCallerAuthService } from './kingCallerAuthService';

// New interface for the Voice AI API response
interface VoiceAIAgentResponse {
  agents: Array<{
    agent_id: string;
    data: {
      agent_name: string;
      agent_type: string;
      agent_welcome_message: string;
      assistant_status: string;
      tasks: Array<{
        tools_config: {
          llm_agent: {
            llm_config: {
              model: string;
            };
          };
          synthesizer: {
            provider_config: {
              voice: string;
              voice_id: string;
            };
          };
        };
      }>;
    };
  }>;
}

// Transform Voice AI response to our Agent format
const transformVoiceAIAgent = (voiceAIAgent: VoiceAIAgentResponse['agents'][0]): Agent => {
  const task = voiceAIAgent.data.tasks?.[0];
  const voice = task?.tools_config?.synthesizer?.provider_config?.voice || 'Unknown';
  const model = task?.tools_config?.llm_agent?.llm_config?.model || 'gpt-4o-mini';

  return {
    id: voiceAIAgent.agent_id,
    agentName: voiceAIAgent.data.agent_name,
    name: voiceAIAgent.data.agent_name, // Add name field for UI compatibility
    voiceId: voice,
    greeting: voiceAIAgent.data.agent_welcome_message,
    instructions: 'You are a helpful AI assistant.', // Default since not in API response
    listenModel: 'nova-2', // Default
    thinkModel: model,
    assistantStatus: voiceAIAgent.data.assistant_status,
    status: voiceAIAgent.data.assistant_status === 'updated' ? 'active' : voiceAIAgent.data.assistant_status, // Map to status field
    agentType: voiceAIAgent.data.agent_type,
    knowledgeBase: { company: '', services: [] },
    toolConfigIds: []
  };
};

export class KingCallerAgentService {
  constructor(private authService: KingCallerAuthService) {}

  async getAgentList(page: number = 1, limit: number = 10, search: string = ''): Promise<Agent[]> {
    try {
      // Use the new Voice AI endpoint with saas_id parameter
      const url = `https://voiceai.kingcaller.ai/all?saas_id=${this.authService.getCurrentSubAccountId()}`;
      
      console.log('KingCaller: Fetching agents from Voice AI API:', url);
      
      // Get authentication token
      const accessToken = await this.authService.getValidAccessToken();
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch agents: ${response.status}`);
      }

      const data: VoiceAIAgentResponse = await response.json();
      console.log('KingCaller: Raw Voice AI response:', data);

      // Transform the agents to our format
      const transformedAgents = data.agents.map(transformVoiceAIAgent);
      
      console.log('KingCaller: Transformed agents:', transformedAgents);
      
      // Apply search filter if provided
      if (search) {
        const searchLower = search.toLowerCase();
        return transformedAgents.filter(agent => 
          agent.agentName.toLowerCase().includes(searchLower) ||
          agent.voiceId.toLowerCase().includes(searchLower) ||
          agent.thinkModel.toLowerCase().includes(searchLower)
        );
      }

      return transformedAgents;
    } catch (error) {
      console.error('Error fetching agents from Voice AI:', error);
      return [];
    }
  }

  async getAssistantById(assistantId: string): Promise<AssistantDetails | null> {
    try {
      const response = await this.authService.makeAuthenticatedRequest(
        `/v1/assistants/findById/${assistantId}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch assistant: ${response.status}`);
      }

      const data: ApiResponse<AssistantDetails> = await response.json();
      console.log('KingCaller: Fetched assistant details:', data.data);
      return data.success && data.data ? data.data : null;
    } catch (error) {
      console.error('Error fetching assistant details:', error);
      throw error;
    }
  }

  async createAssistant(assistantData: CreateAssistantRequest): Promise<string | null> {
    try {
      console.log('=== KINGCALLER AGENT SERVICE ===');
      console.log('KingCaller: Creating assistant with data:', assistantData);
      console.log('KingCaller: Auth service authenticated:', this.authService.isAuthenticated());
      
      const response = await this.authService.makeAuthenticatedRequest('/v1/assistants/create', {
        method: 'POST',
        body: JSON.stringify(assistantData)
      });

      console.log('KingCaller: Create assistant response status:', response.status);
      console.log('KingCaller: Create assistant response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('KingCaller: Create assistant error response:', errorText);
        throw new Error(`Failed to create assistant: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('KingCaller: Assistant created successfully:', data);
      return data._id || data.id;
    } catch (error) {
      console.error('Error creating assistant:', error);
      throw error;
    }
  }

  async updateAssistant(assistantId: string, assistantData: UpdateAssistantRequest): Promise<AssistantDetails | null> {
    try {
      console.log('KingCaller: Updating assistant:', { assistantId, assistantData });
      
      const response = await this.authService.makeAuthenticatedRequest(`/v1/assistants/update/${assistantId}`, {
        method: 'PUT',
        body: JSON.stringify(assistantData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update assistant: ${response.status}`);
      }

      const data: ApiResponse<AssistantDetails> = await response.json();
      
      if (!data.success) {
        throw new Error(`Failed to update assistant: ${data.message}`);
      }

      console.log('KingCaller: Assistant updated successfully:', data.data);
      return data.data || null;
    } catch (error) {
      console.error('Error updating assistant:', error);
      throw error;
    }
  }

  async scrapWebsite(websiteUrl: string): Promise<any> {
    try {
      console.log('KingCaller: Scraping website:', websiteUrl);
      
      const requestData: ScrapWebsiteRequest = { websiteUrl };
      
      const response = await this.authService.makeAuthenticatedRequest('/v1/assistants/scrap-website', {
        method: 'POST',
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error(`Failed to scrap website: ${response.status}`);
      }

      const data: ScrapWebsiteResponse = await response.json();
      
      if (!data.success) {
        throw new Error(`Failed to scrap website: ${data.message}`);
      }

      console.log('KingCaller: Website scraping completed:', data.data);
      return data.data;
    } catch (error) {
      console.error('Error scraping website:', error);
      throw error;
    }
  }

  async updateAgentSpeechSettings(agentId: string, settings: AgentSpeechSettings): Promise<AgentSpeechSettings> {
    try {
      console.log('KingCaller: Updating agent speech settings:', { agentId, settings });
      const response = await this.authService.makeAuthenticatedRequest(
        `/api/v1/agent/update-agent/${agentId}`,
        {
          method: 'PATCH',
          body: JSON.stringify(settings)
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update agent: ${response.status}`);
      }

      const data: UpdateAgentResponse = await response.json();
      
      if (!data.success) {
        throw new Error(`Failed to update agent: ${data.message}`);
      }

      console.log('KingCaller: Agent speech settings updated:', data.data);
      return data.data;
    } catch (error) {
      console.error('Error updating agent speech settings:', error);
      throw error;
    }
  }

  async createKingCallerAgent(agentData: CreateKingCallerAgentRequest): Promise<string | null> {
    try {
      console.log('KingCaller: Creating agent with data:', agentData);
      
      // First create the basic agent
      const response = await this.authService.makeAuthenticatedRequest('/api/v1/assistants/create', {
        method: 'POST',
        body: JSON.stringify({
          name: agentData.name,
          prompt: agentData.prompt,
          welcomeMessage: agentData.welcomeMessage,
          model: agentData.model,
          voice: agentData.voice,
          agentType: agentData.agentType
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create agent: ${response.status}`);
      }

      const data: CreateKingCallerAgentResponse = await response.json();
      
      if (!data.success) {
        throw new Error(`Failed to create agent: ${data.message}`);
      }

      console.log('KingCaller: Agent created successfully:', data.data);
      const agentId = data.data.id;

      // Apply speech settings if provided
      if (agentData.speechSettings && agentId) {
        console.log('KingCaller: Applying speech settings to agent:', agentId);
        try {
          await this.updateAgentSpeechSettings(agentId, agentData.speechSettings);
          console.log('KingCaller: Speech settings applied successfully');
        } catch (error) {
          console.warn('KingCaller: Failed to apply speech settings, but agent created:', error);
        }
      }

      return agentId;
    } catch (error) {
      console.error('Error creating KingCaller agent:', error);
      throw error;
    }
  }
}
