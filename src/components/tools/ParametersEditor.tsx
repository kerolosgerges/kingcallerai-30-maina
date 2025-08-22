
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Code } from "lucide-react";

interface ParametersEditorProps {
  parameters: any;
  onChange: (parameters: any) => void;
}

interface Parameter {
  name: string;
  type: string;
  description?: string;
  required?: boolean;
}

export const ParametersEditor = ({ parameters, onChange }: ParametersEditorProps) => {
  const [useVisualEditor, setUseVisualEditor] = useState(true);
  const [parametersList, setParametersList] = useState<Parameter[]>(() => {
    // Convert parameters object to array for visual editor
    if (typeof parameters === 'object' && parameters) {
      return Object.entries(parameters).map(([name, value]) => ({
        name,
        type: typeof value === 'string' ? 'string' : 'number',
        description: '',
        required: true,
      }));
    }
    return [];
  });

  const [rawJson, setRawJson] = useState(() => {
    return JSON.stringify(parameters || {}, null, 2);
  });

  const handleAddParameter = () => {
    const newParam: Parameter = {
      name: '',
      type: 'string',
      description: '',
      required: false,
    };
    setParametersList(prev => [...prev, newParam]);
  };

  const handleUpdateParameter = (index: number, field: keyof Parameter, value: any) => {
    setParametersList(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      
      // Convert back to object and notify parent
      const parametersObj = updated.reduce((acc, param) => {
        if (param.name) {
          acc[param.name] = getDefaultValue(param.type);
        }
        return acc;
      }, {} as any);
      
      onChange(parametersObj);
      return updated;
    });
  };

  const handleRemoveParameter = (index: number) => {
    setParametersList(prev => {
      const updated = prev.filter((_, i) => i !== index);
      
      // Convert back to object and notify parent
      const parametersObj = updated.reduce((acc, param) => {
        if (param.name) {
          acc[param.name] = getDefaultValue(param.type);
        }
        return acc;
      }, {} as any);
      
      onChange(parametersObj);
      return updated;
    });
  };

  const handleRawJsonChange = (value: string) => {
    setRawJson(value);
    try {
      const parsed = JSON.parse(value);
      onChange(parsed);
    } catch (error) {
      // Invalid JSON, don't update
    }
  };

  const getDefaultValue = (type: string) => {
    switch (type) {
      case 'string': return '';
      case 'number': return 0;
      case 'boolean': return false;
      case 'array': return [];
      case 'object': return {};
      default: return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Parameters</CardTitle>
            <CardDescription>
              Define the parameters that can be passed to this tool
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="visual-editor" className="text-sm">Visual Editor</Label>
            <Switch 
              id="visual-editor"
              checked={useVisualEditor}
              onCheckedChange={setUseVisualEditor}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {useVisualEditor ? (
          <div className="space-y-4">
            {parametersList.map((param, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Parameter {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveParameter(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">Parameter Name</Label>
                    <Input
                      value={param.name}
                      onChange={(e) => handleUpdateParameter(index, 'name', e.target.value)}
                      placeholder="e.g. phoneNumber"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs">Type</Label>
                    <Select 
                      value={param.type}
                      onValueChange={(value) => handleUpdateParameter(index, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="string">string</SelectItem>
                        <SelectItem value="number">number</SelectItem>
                        <SelectItem value="boolean">boolean</SelectItem>
                        <SelectItem value="array">array</SelectItem>
                        <SelectItem value="object">object</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={param.required}
                      onCheckedChange={(checked) => handleUpdateParameter(index, 'required', checked)}
                    />
                    <Label className="text-xs">Required</Label>
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs">Description</Label>
                  <Input
                    value={param.description}
                    onChange={(e) => handleUpdateParameter(index, 'description', e.target.value)}
                    placeholder="Describe this parameter..."
                  />
                </div>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              onClick={handleAddParameter}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Parameter
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Code className="h-4 w-4" />
              JSON Schema
            </div>
            <Textarea
              value={rawJson}
              onChange={(e) => handleRawJsonChange(e.target.value)}
              placeholder='{\n  "parameterName": "defaultValue"\n}'
              className="font-mono text-sm"
              rows={8}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
