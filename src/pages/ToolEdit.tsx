
import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Code, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ParametersEditor } from "@/components/tools/ParametersEditor";
import { ToolAdvancedSections } from "@/components/tools/ToolAdvancedSections";
import { CodePreviewDialog } from "@/components/tools/CodePreviewDialog";

const ToolEdit = () => {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const toolType = searchParams.get('type');
  
  const isCreateMode = !toolId;
  
  const [formData, setFormData] = useState({
    name: "",
    backendName: "",
    type: toolType || "",
    description: "",
    parameters: {} as any,
    advancedConfig: {} as any,
  });
  
  const [isDirty, setIsDirty] = useState(false);
  const [showCodePreview, setShowCodePreview] = useState(false);

  useEffect(() => {
    if (toolId && !isCreateMode) {
      // In real app, fetch tool data from API
      // For now, use mock data
      const mockTool = {
        id: toolId,
        name: "Transfer to Sales",
        backendName: "TRANSFER_CALL",
        type: "Transfer Call",
        description: "Transfers call to sales team",
        parameters: {
          phoneNumber: "+18005551234"
        },
        advancedConfig: {
          destinations: ["+18005551234", "+18005559876"]
        }
      };
      setFormData(mockTool);
    }
  }, [toolId, isCreateMode]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.backendName || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // In real app, make API call here
      console.log("Saving tool:", formData);
      
      if (isCreateMode) {
        // POST /assistants/tool-config/create
        toast({
          title: "Tool Created",
          description: `Successfully created "${formData.name}"`,
        });
      } else {
        // PUT /assistants/tool-config/update/:toolId
        toast({
          title: "Tool Updated", 
          description: `Successfully updated "${formData.name}"`,
        });
      }
      
      setIsDirty(false);
      navigate('/tools');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save tool",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!toolId) return;
    
    try {
      // DELETE /assistants/tool-config/delete/:toolId
      console.log("Deleting tool:", toolId);
      
      toast({
        title: "Tool Deleted",
        description: `Successfully deleted "${formData.name}"`,
      });
      
      navigate('/tools');
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to delete tool",
        variant: "destructive",
      });
    }
  };

  const generatePreviewPayload = () => {
    return {
      name: formData.backendName,
      description: formData.description,
      parameters: formData.parameters,
      ...formData.advancedConfig
    };
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/tools')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tools
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isCreateMode ? 'Create Tool' : 'Edit Tool'}
            </h1>
            {formData.type && (
              <Badge variant="outline" className="mt-1">
                {formData.type}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            onClick={() => setShowCodePreview(true)}
          >
            <Code className="h-4 w-4 mr-2" />
            Code
          </Button>
          {!isCreateMode && (
            <Button 
              variant="outline"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
          <Button 
            onClick={handleSave}
            disabled={!isDirty}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Configure the basic settings for your tool
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Tool Name (Display Name) *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g. Transfer to Sales"
                  />
                </div>
                <div>
                  <Label htmlFor="backendName">Backend Tool Name *</Label>
                  <Input
                    id="backendName"
                    value={formData.backendName}
                    onChange={(e) => handleInputChange('backendName', e.target.value)}
                    placeholder="e.g. TRANSFER_CALL"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe what this tool does..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Parameters Section */}
          <ParametersEditor
            parameters={formData.parameters}
            onChange={(parameters) => handleInputChange('parameters', parameters)}
          />

          {/* Advanced Sections */}
          <ToolAdvancedSections
            toolType={formData.type}
            config={formData.advancedConfig}
            onChange={(config) => handleInputChange('advancedConfig', config)}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tool Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="enabled">Enabled</Label>
                <Switch id="enabled" defaultChecked />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tool Type</Label>
                <Badge variant="outline">{formData.type || 'Not specified'}</Badge>
              </div>
              
              {!isCreateMode && (
                <>
                  <Separator />
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div>Created: June 9, 2024</div>
                    <div>Last updated: June 9, 2024</div>
                    <div>Tool ID: {toolId}</div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Code Preview Dialog */}
      <CodePreviewDialog
        open={showCodePreview}
        onOpenChange={setShowCodePreview}
        payload={generatePreviewPayload()}
      />
    </div>
  );
};

export default ToolEdit;
