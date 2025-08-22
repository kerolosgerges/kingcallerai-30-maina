import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSubAccount } from "@/contexts/SubAccountContext";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Edit, Trash2, Phone, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { TestCallModal, Agent } from "@/components/agentpage/TestCallModal";

// Extended Agent type with saas_id at top level
type AgentDisplay = Agent & {
  saas_id: string;
};
const AGENT_DEFAULT_PAYLOAD = {
  agent_config: {
    agent_name: "Alfred",
    agent_type: "other",
    agent_welcome_message: "How are you doing Bruce?",
    tasks: [{
      task_type: "conversation",
      toolchain: {
        execution: "parallel",
        pipelines: [["transcriber", "llm", "synthesizer"]]
      },
      tools_config: {
        input: {
          format: "wav",
          provider: "twilio"
        },
        llm_agent: {
          agent_type: "simple_llm_agent",
          agent_flow_type: "streaming",
          routes: null,
          llm_config: {
            agent_flow_type: "streaming",
            provider: "openai",
            request_json: true,
            model: "gpt-4o-mini"
          }
        },
        output: {
          format: "wav",
          provider: "twilio"
        },
        synthesizer: {
          audio_format: "wav",
          provider: "elevenlabs",
          stream: true,
          provider_config: {
            voice: "George",
            model: "eleven_turbo_v2_5",
            voice_id: "JBFqnCBsd6RMkjVDRZzb"
          },
          buffer_size: 100.0
        },
        transcriber: {
          encoding: "linear16",
          language: "en",
          provider: "deepgram",
          stream: true
        }
      },
      task_config: {
        hangup_after_silence: 30.0
      }
    }]
  },
  agent_prompts: {
    task_1: {
      system_prompt: "Why Do We Fall, Sir? So That We Can Learn To Pick Ourselves Up."
    }
  }
};
const AgentsUI = () => {
  const {
    currentSubAccount
  } = useSubAccount();
  const [agents, setAgents] = useState<AgentDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingAgent, setDeletingAgent] = useState<AgentDisplay | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Create Agent Modal/Loading/Error State
  const [creating, setCreating] = useState(false);

  // State for test call modal
  const [testCallOpen, setTestCallOpen] = useState(false);
  const [testCallAgent, setTestCallAgent] = useState<AgentDisplay | null>(null);
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    if (!currentSubAccount?.id) return;
    setLoading(true);
    fetch(`https://voiceai.kingcaller.ai/all?saas_id=${currentSubAccount.id}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json'
      }
    }).then(res => res.json()).then(data => {
      const mappedAgents: AgentDisplay[] = (data.agents || []).map((agent: any) => {
        const a = agent.data || {};
        const toolsConfig = a?.tasks?.[0]?.tools_config ?? {};
        const llmAgent = toolsConfig.llm_agent ?? {};
        const llmConfig = llmAgent.llm_config ?? {};
        const synthesizer = toolsConfig.synthesizer ?? {};
        const synthConfig = synthesizer.provider_config ?? {};
        return {
          agent_id: agent.agent_id,
          saas_id: a.saas_id || agent.saas_id || currentSubAccount.id,
          agent_name: a.agent_name ?? "-",
          agent_type: a.agent_type ?? "-",
          model: llmConfig.model ?? "-",
          voice: synthConfig.voice ?? "-",
          greeting: a.agent_welcome_message ?? "-",
          assistant_status: a.assistant_status ?? "-"
        };
      });
      setAgents(mappedAgents);
      setLoading(false);
    }).catch(err => {
      console.error("API error:", err);
      setAgents([]);
      setLoading(false);
    });
  }, [currentSubAccount?.id]);
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return '🟢';
      case 'seeding':
        return '🟡';
      case 'inactive':
        return '⚫';
      case 'draft':
        return '🔵';
      default:
        return '⚪';
    }
  };
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'seeding':
        return 'secondary';
      case 'inactive':
        return 'outline';
      default:
        return 'outline';
    }
  };
  const filteredAgents = agents.filter(a => a.agent_name?.toLowerCase().includes(search.toLowerCase()) || a.model?.toLowerCase().includes(search.toLowerCase()) || a.voice?.toLowerCase().includes(search.toLowerCase()) || a.agent_type?.toLowerCase().includes(search.toLowerCase()) || a.assistant_status?.toLowerCase().includes(search.toLowerCase()) || a.agent_id?.toLowerCase().includes(search.toLowerCase()) || a.saas_id?.toLowerCase().includes(search.toLowerCase()));
  const handleOpenTestCall = (agent: AgentDisplay) => {
    setTestCallAgent(agent);
    setTestCallOpen(true);
  };

  // ---- CREATE AGENT HANDLER ----
  const handleCreateAgent = async () => {
    if (!currentSubAccount?.id) return;
    setCreating(true);
    try {
      const res = await fetch(`https://voiceai.kingcaller.ai/agent?saas_id=${currentSubAccount.id}`, {
        method: "POST",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(AGENT_DEFAULT_PAYLOAD)
      });
      if (!res.ok) throw new Error("Failed to create agent");
      const data = await res.json();
      const agent_id = data.agent_id;
      if (agent_id) {
        toast({
          title: "Agent Created",
          description: "Agent was created successfully!"
        });
        // Navigate to AgentBuilder, customize as needed!
        navigate(`${agent_id}/edit`);
      } else {
        throw new Error("No agent_id returned from API");
      }
    } catch (e: any) {
      toast({
        title: "Create Agent failed",
        description: e.message || "Error creating agent.",
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  // ---- DELETE LOGIC ----
  const handleDelete = async () => {
    if (!deletingAgent) return false;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch(`https://voiceai.kingcaller.ai/agent/${deletingAgent.agent_id}?saas_id=${deletingAgent.saas_id}`, {
        method: "DELETE",
        headers: {
          "accept": "application/json"
        }
      });
      if (!res.ok) throw new Error("Failed to delete agent");
      setAgents(prev => prev.filter(a => a.agent_id !== deletingAgent.agent_id));
      setDeleteDialogOpen(false);
      setDeletingAgent(null);
      toast({
        title: "Agent Deleted",
        description: `Agent ${deletingAgent.agent_name} deleted successfully.`
      });
      return true;
    } catch (e: any) {
      setDeleteError(e.message || "Failed to delete agent");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };
  return <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Agents</h1>
          <p className="text-muted-foreground">Manage your AI voice agents</p>
        </div>
        <Button className="flex items-center gap-2" onClick={handleCreateAgent} disabled={creating}>
          <Plus className="h-4 w-4" />
          {creating ? "Creating..." : "Create Agent"}
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input placeholder="Search agents, id or tenant..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? <div className="text-center py-12 text-lg">Loading agents...</div> : filteredAgents.length === 0 ? <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            {search ? "No agents found matching your search." : "No agents created yet."}
          </div>
          {!search}
        </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map(agent => <Card key={agent.agent_id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getStatusIcon(agent.assistant_status)}</span>
                      <CardTitle className="text-lg">{agent.agent_name}</CardTitle>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <span><strong>Agent ID:</strong> <span className="font-mono">{agent.agent_id}</span></span><br />
                      <span><strong>Tenant:</strong> <span className="font-mono">{agent.saas_id}</span></span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        ⋮
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleOpenTestCall(agent)}>
                        <Phone className="h-4 w-4 mr-2" />
                        Test Call
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/${agent.saas_id}/agents/${agent.agent_id}/edit`)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => {
                  setDeletingAgent(agent);
                  setDeleteDialogOpen(true);
                }}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(agent.assistant_status)}>
                      {agent.assistant_status}
                    </Badge>
                    <Badge variant="outline">{agent.agent_type}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Voice: <span className="font-mono">{agent.voice}</span></p>
                    <p className="text-sm text-muted-foreground mb-1">Model: <span className="font-mono">{agent.model}</span></p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Greeting:</p>
                    <p className="text-sm line-clamp-2">{agent.greeting}</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleOpenTestCall(agent)}>
                      <Phone className="h-4 w-4 mr-1" />
                      Test Call
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => navigate(`/${agent.saas_id}/agents/${agent.agent_id}/edit`)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>)}
        </div>}

      {/* Test Call Modal */}
      <TestCallModal open={testCallOpen} onOpenChange={setTestCallOpen} agent={testCallAgent} onToast={toast} />

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Agent</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletingAgent?.agent_name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteError && <div className="text-red-600 text-sm mb-2">{deleteError}</div>}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={isDeleting} onClick={handleDelete}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};
export default AgentsUI;