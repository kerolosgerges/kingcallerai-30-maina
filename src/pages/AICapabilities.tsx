import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mic, 
  Globe, 
  Brain, 
  Zap, 
  Plus, 
  Settings, 
  Play, 
  Pause, 
  Download, 
  Upload,
  Volume2,
  Languages,
  Cpu,
  Sparkles,
  TrendingUp
} from "lucide-react";

const AICapabilities = () => {
  const [selectedModel, setSelectedModel] = useState("gpt-4");
  const [voiceCloningEnabled, setVoiceCloningEnabled] = useState(false);
  const [sentimentAnalysis, setSentimentAnalysis] = useState(true);

  const voiceModels = [
    {
      id: "voice_001",
      name: "Professional Sarah",
      type: "Cloned",
      language: "English",
      quality: 95,
      status: "active",
      trainingData: "2.5 hours",
      lastTrained: "2025-01-05"
    },
    {
      id: "voice_002", 
      name: "Friendly Mike",
      type: "Synthetic",
      language: "English",
      quality: 88,
      status: "training",
      trainingData: "1.8 hours",
      lastTrained: "2025-01-07"
    },
    {
      id: "voice_003",
      name: "Multilingual Anna",
      type: "Cloned",
      language: "Multi",
      quality: 92,
      status: "active",
      trainingData: "3.2 hours",
      lastTrained: "2025-01-06"
    }
  ];

  const languageSupport = [
    { language: "English", support: "Native", quality: 99, calls: 2847 },
    { language: "Spanish", support: "Fluent", quality: 94, calls: 1256 },
    { language: "French", support: "Fluent", quality: 91, calls: 892 },
    { language: "German", support: "Fluent", quality: 89, calls: 654 },
    { language: "Italian", support: "Good", quality: 85, calls: 432 },
    { language: "Portuguese", support: "Good", quality: 83, calls: 298 },
    { language: "Chinese", support: "Basic", quality: 76, calls: 187 },
    { language: "Japanese", support: "Basic", quality: 74, calls: 145 }
  ];

  const sentimentData = [
    { emotion: "Positive", percentage: 68, color: "bg-green-500" },
    { emotion: "Neutral", percentage: 22, color: "bg-gray-500" },
    { emotion: "Negative", percentage: 8, color: "bg-red-500" },
    { emotion: "Frustrated", percentage: 2, color: "bg-orange-500" }
  ];

  const modelConfigurations = [
    {
      name: "GPT-4 Turbo",
      id: "gpt-4-turbo",
      description: "Latest high-performance model",
      capabilities: ["Text", "Reasoning", "Code"],
      cost: "$0.01/1K tokens",
      latency: "2.1s",
      quality: 95
    },
    {
      name: "Claude-3 Opus",
      id: "claude-3-opus", 
      description: "Excellent for complex conversations",
      capabilities: ["Text", "Analysis", "Creative"],
      cost: "$0.015/1K tokens",
      latency: "2.8s",
      quality: 93
    },
    {
      name: "Custom Fine-tuned",
      id: "custom-model",
      description: "Your specialized model",
      capabilities: ["Domain-specific", "Optimized"],
      cost: "$0.008/1K tokens",
      latency: "1.9s",
      quality: 97
    }
  ];

  const getQualityColor = (quality: number) => {
    if (quality >= 90) return "text-green-600";
    if (quality >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      training: "secondary",
      inactive: "destructive"
    } as const;
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced AI Capabilities</h1>
          <p className="text-gray-600">Configure and enhance AI features</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Models
          </Button>
          <Button>
            <Brain className="h-4 w-4 mr-2" />
            Train New Model
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Models</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">2 custom trained</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voice Models</CardTitle>
            <Mic className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">1 training</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Languages</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">4 fluent, 4 basic</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Quality</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91%</div>
            <p className="text-xs text-muted-foreground">Across all models</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="voice-cloning" className="space-y-6">
        <TabsList>
          <TabsTrigger value="voice-cloning">Voice Cloning</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
          <TabsTrigger value="translation">Multi-Language</TabsTrigger>
          <TabsTrigger value="fine-tuning">Model Fine-tuning</TabsTrigger>
        </TabsList>

        <TabsContent value="voice-cloning" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Label htmlFor="voice-cloning-toggle">Enable Voice Cloning</Label>
              <Switch 
                id="voice-cloning-toggle"
                checked={voiceCloningEnabled}
                onCheckedChange={setVoiceCloningEnabled}
              />
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Voice Model
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {voiceModels.map((voice) => (
              <Card key={voice.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{voice.name}</CardTitle>
                    {getStatusBadge(voice.status)}
                  </div>
                  <CardDescription>
                    {voice.type} • {voice.language}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Quality Score</span>
                      <span className={getQualityColor(voice.quality)}>{voice.quality}%</span>
                    </div>
                    <Progress value={voice.quality} className="h-2" />
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Training Data</span>
                      <span>{voice.trainingData}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Trained</span>
                      <span>{voice.lastTrained}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Play className="h-4 w-4 mr-2" />
                      Test
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Voice Synthesis Settings</CardTitle>
              <CardDescription>Fine-tune voice generation parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Speaking Rate</Label>
                    <Slider defaultValue={[1.0]} max={2.0} min={0.5} step={0.1} />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Slow</span>
                      <span>Normal</span>
                      <span>Fast</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Pitch</Label>
                    <Slider defaultValue={[0]} max={20} min={-20} step={1} />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Low</span>
                      <span>Normal</span>
                      <span>High</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Emotion Intensity</Label>
                    <Slider defaultValue={[50]} max={100} min={0} step={5} />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Neutral</span>
                      <span>Expressive</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Pause Duration</Label>
                    <Slider defaultValue={[1.0]} max={3.0} min={0.1} step={0.1} />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Short</span>
                      <span>Normal</span>
                      <span>Long</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Label htmlFor="sentiment-toggle">Enable Sentiment Analysis</Label>
              <Switch 
                id="sentiment-toggle"
                checked={sentimentAnalysis}
                onCheckedChange={setSentimentAnalysis}
              />
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Emotion Distribution</CardTitle>
                <CardDescription>Real-time sentiment analysis from calls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {sentimentData.map((sentiment, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${sentiment.color}`}></div>
                        {sentiment.emotion}
                      </span>
                      <span className="font-medium">{sentiment.percentage}%</span>
                    </div>
                    <Progress value={sentiment.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sentiment Triggers</CardTitle>
                <CardDescription>Automated responses based on emotion detection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Frustration Detected</div>
                      <div className="text-sm text-gray-500">Transfer to human agent</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">High Satisfaction</div>
                      <div className="text-sm text-gray-500">Offer upsell opportunity</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Confusion Detected</div>
                      <div className="text-sm text-gray-500">Provide clearer explanation</div>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="translation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Language Support</CardTitle>
              <CardDescription>Real-time translation and localization capabilities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {languageSupport.map((lang, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-medium">{lang.language}</div>
                        <div className="text-sm text-gray-500">{lang.support} support</div>
                      </div>
                      <Badge variant="outline">{lang.calls} calls</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`font-medium ${getQualityColor(lang.quality)}`}>
                          {lang.quality}%
                        </div>
                        <div className="text-xs text-gray-500">Quality</div>
                      </div>
                      <Switch defaultChecked={lang.quality > 80} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fine-tuning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Model Fine-tuning</CardTitle>
              <CardDescription>Create specialized models for your use case</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {modelConfigurations.map((model, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                      <CardDescription>{model.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {model.capabilities.map((cap, capIndex) => (
                            <Badge key={capIndex} variant="outline">{cap}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Cost</span>
                          <span>{model.cost}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Latency</span>
                          <span>{model.latency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quality</span>
                          <span className={getQualityColor(model.quality)}>{model.quality}%</span>
                        </div>
                      </div>
                      <Button 
                        variant={model.id === selectedModel ? "default" : "outline"} 
                        className="w-full"
                        onClick={() => setSelectedModel(model.id)}
                      >
                        {model.id === selectedModel ? "Active" : "Select"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Training Data Upload</h3>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Drop your training data files here or click to browse
                    </p>
                    <Button variant="outline" className="mt-2">
                      Upload Files
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="training-name">Model Name</Label>
                      <Input id="training-name" placeholder="My Custom Model" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="base-model">Base Model</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select base model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4">GPT-4 Turbo</SelectItem>
                          <SelectItem value="claude-3">Claude-3 Opus</SelectItem>
                          <SelectItem value="llama-2">Llama-2 70B</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Brain className="h-4 w-4 mr-2" />
                    Start Training
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AICapabilities;
