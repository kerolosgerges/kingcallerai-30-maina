import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreadcrumbProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  currentPath,
  onNavigate
}) => {
  const pathSegments = currentPath ? currentPath.split('/').filter(Boolean) : [];

  const handleNavigate = (index: number) => {
    if (index === -1) {
      onNavigate('');
    } else {
      const newPath = pathSegments.slice(0, index + 1).join('/');
      onNavigate(newPath);
    }
  };

  return (
    <div className="flex items-center space-x-1 text-sm">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleNavigate(-1)}
        className="gap-1 h-8 px-2"
      >
        <Home className="h-4 w-4" />
        Root
      </Button>
      
      {pathSegments.map((segment, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleNavigate(index)}
            className="h-8 px-2"
          >
            {segment}
          </Button>
        </React.Fragment>
      ))}
    </div>
  );
};