
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle, Lightbulb } from 'lucide-react';
import { WorkflowValidationResult } from '@/utils/workflowValidation';

interface WorkflowValidationPanelProps {
  validation: WorkflowValidationResult;
  suggestions: string[];
  className?: string;
}

export function WorkflowValidationPanel({ 
  validation, 
  suggestions, 
  className = "" 
}: WorkflowValidationPanelProps) {
  const { isValid, errors, warnings } = validation;

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          {isValid ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
          Workflow Validation
          <Badge variant={isValid ? "default" : "destructive"} className="text-xs">
            {isValid ? "Valid" : "Issues Found"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Errors */}
        {errors.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-red-600 flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              Errors ({errors.length})
            </h4>
            {errors.map((error, index) => (
              <Alert key={index} variant="destructive" className="py-2">
                <AlertDescription className="text-xs">{error}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-yellow-600 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Warnings ({warnings.length})
            </h4>
            {warnings.map((warning, index) => (
              <Alert key={index} className="py-2 border-yellow-200 bg-yellow-50">
                <AlertDescription className="text-xs text-yellow-800">{warning}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-blue-600 flex items-center gap-1">
              <Lightbulb className="h-3 w-3" />
              Suggestions ({suggestions.length})
            </h4>
            {suggestions.map((suggestion, index) => (
              <Alert key={index} className="py-2 border-blue-200 bg-blue-50">
                <AlertDescription className="text-xs text-blue-800">{suggestion}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* All Good State */}
        {isValid && warnings.length === 0 && suggestions.length === 0 && (
          <Alert className="py-2 border-green-200 bg-green-50">
            <CheckCircle className="h-3 w-3 text-green-600" />
            <AlertDescription className="text-xs text-green-800">
              Workflow looks great! No issues found.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
