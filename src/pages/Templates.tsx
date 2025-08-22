import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Copy, MoreVertical, Mail, Smartphone, Bell } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Templates = () => {
  const { subAccountId } = useParams();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');

  // Mock templates data
  const templates = [
    {
      id: '1',
      name: 'Welcome Email',
      type: 'email',
      status: 'published',
      created: '2024-01-15',
      updated: '2024-01-20',
      thumbnail: null
    },
    {
      id: '2',
      name: 'Product Launch',
      type: 'email',
      status: 'draft',
      created: '2024-01-10',
      updated: '2024-01-18',
      thumbnail: null
    },
    {
      id: '3',
      name: 'Push Notification',
      type: 'push',
      status: 'published',
      created: '2024-01-08',
      updated: '2024-01-16',
      thumbnail: null
    }
  ];

  const handleCreateTemplate = (type: string) => {
    navigate(`/${subAccountId}/campaigns/templates/new?type=${type}`);
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'push': return <Smartphone className="w-4 h-4" />;
      case 'inApp': return <Bell className="w-4 h-4" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            Templates
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Create and manage email, push, and in-app message templates
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Template
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleCreateTemplate('email')}>
              <Mail className="w-4 h-4 mr-2" />
              Email Template
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCreateTemplate('push')}>
              <Smartphone className="w-4 h-4 mr-2" />
              Push Notification
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleCreateTemplate('inApp')}>
              <Bell className="w-4 h-4 mr-2" />
              In-App Message
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Templates */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="push">Push</TabsTrigger>
          <TabsTrigger value="inApp">In-App</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getTypeIcon(template.type)}
                        {template.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Updated {template.updated}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={getStatusColor(template.status)}>
                      {template.status}
                    </Badge>
                    <div className="text-sm text-muted-foreground capitalize">
                      {template.type}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate(`/${subAccountId}/campaigns/templates/${template.id}`)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Similar content for other tabs */}
        <TabsContent value="email">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.filter(t => t.type === 'email').map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {getTypeIcon(template.type)}
                        {template.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Updated {template.updated}
                      </CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={getStatusColor(template.status)}>
                      {template.status}
                    </Badge>
                    <div className="text-sm text-muted-foreground capitalize">
                      {template.type}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate(`/${subAccountId}/campaigns/templates/${template.id}`)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-lg text-muted-foreground mb-4">No templates found</div>
          <Button onClick={() => handleCreateTemplate('email')}>
            <Plus className="mr-2 h-4 w-4" />
            Create your first template
          </Button>
        </div>
      )}
    </div>
  );
};

export default Templates;
