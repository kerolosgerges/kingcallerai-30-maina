
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Eye, Settings, Smartphone, Monitor, Tablet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const TemplateCreator = () => {
  const navigate = useNavigate();
  const { templateId } = useParams();
  const isEditing = !!templateId;

  const [templateData, setTemplateData] = useState({
    name: isEditing ? "New Staff Forms" : "",
    type: "email",
    content: ""
  });

  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");

  const handleSave = () => {
    console.log("Saving template:", templateData);
    navigate('/campaigns/templates');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/campaigns/templates')}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-lg font-semibold">
                {isEditing ? templateData.name : "New Staff Forms"}
              </h1>
              <p className="text-sm text-gray-600">Design Editor</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <div className="flex items-center border rounded-md p-1">
              <Button
                variant={viewMode === "desktop" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("desktop")}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "tablet" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("tablet")}
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "mobile" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("mobile")}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Test Email
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview Template
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save Template
            </Button>
          </div>
        </div>

        <div className="mt-4 text-sm text-blue-600 underline cursor-pointer">
          View this email in browser
        </div>
      </div>

      {/* Editor Layout */}
      <div className="flex h-[calc(100vh-120px)]">
        {/* Left Sidebar - Elements */}
        <div className="w-80 bg-white border-r overflow-y-auto">
          <div className="p-4">
            <h3 className="font-medium mb-4">Elements</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-3">Basic</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: "T", label: "Text" },
                    { icon: "🖼️", label: "Image" },
                    { icon: "📋", label: "Button" },
                    { icon: "🛡️", label: "Logo" },
                    { icon: "—", label: "Divider" },
                    { icon: "📱", label: "Social" },
                    { icon: "📄", label: "Footer" },
                    { icon: "💻", label: "Code" },
                    { icon: "▶️", label: "Video" },
                    { icon: "🛒", label: "Shopping Cart" },
                    { icon: "📡", label: "RSS Header" },
                    { icon: "📝", label: "RSS Items" },
                    { icon: "❓", label: "FAQ" },
                    { icon: "🏷️", label: "Products" },
                    { icon: "🖼️", label: "Image Slider" },
                    { icon: "🔗", label: "Preview URL" },
                    { icon: "⏰", label: "Countdown" },
                    { icon: "📏", label: "Spacer" }
                  ].map((element, index) => (
                    <Card key={index} className="p-3 cursor-pointer hover:bg-gray-50">
                      <CardContent className="p-0 text-center">
                        <div className="text-lg mb-1">{element.icon}</div>
                        <div className="text-xs">{element.label}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">Layouts</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: "📋", label: "Text & Image" },
                    { icon: "1️⃣", label: "1" },
                    { icon: "2️⃣", label: "2" },
                    { icon: "3️⃣", label: "3" },
                    { icon: "⅓", label: "1/3 : 2/3" },
                    { icon: "⅔", label: "2/3 : 1/3" },
                    { icon: "¼", label: "1/4 : 3/4" },
                    { icon: "¾", label: "3/4 : 1/4" },
                    { icon: "4️⃣", label: "4" }
                  ].map((layout, index) => (
                    <Card key={index} className="p-3 cursor-pointer hover:bg-gray-50">
                      <CardContent className="p-0 text-center">
                        <div className="text-lg mb-1">{layout.icon}</div>
                        <div className="text-xs">{layout.label}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
          <div 
            className={`mx-auto bg-white shadow-lg ${
              viewMode === "mobile" ? "max-w-sm" : 
              viewMode === "tablet" ? "max-w-md" : "max-w-2xl"
            }`}
          >
            <div className="p-8">
              {/* Email Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="text-4xl">🌙</div>
                  <div className="ml-4 text-2xl font-light tracking-wider">GREY MOON</div>
                </div>
              </div>

              {/* Email Content */}
              <div className="space-y-4">
                <p>Hi {"{{contact.first_name}}"},</p>
                
                <p>
                  Thank you for applying to join Grey Moon LLC! We've received 
                  your application and appreciate your interest in working with us.
                </p>
                
                <p>To move forward with your application,</p>
                
                <p>please call us at +1 954-914-7081 at your earliest convenience.</p>
                
                <p>We'd love to get to know you better and discuss next steps.</p>
                
                <p>
                  If you have any questions, feel free to reply to this email or call 
                  us directly.
                </p>
                
                <p>Looking forward to connecting with you!</p>
                <p>Best regards,</p>
                <p>Grey Moon LLC Team</p>
                
                <p>
                  <a href="mailto:info@greymoonllc.com" className="text-blue-600 underline">
                    info@greymoonllc.com
                  </a><br />
                  +1 954-914-7081
                </p>
                
                <div className="mt-8 pt-4 border-t text-xs text-gray-500">
                  <p>Copyright © {"{right_now.year}"} Grey Moon LLC, All rights reserved.</p>
                  <p className="mt-2">Our e-mail address is: info@greymoonllc.com</p>
                  <p className="mt-2">
                    Want to change how you receive these emails?<br />
                    You can <a href="#" className="text-blue-600 underline">unsubscribe from this list</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties (if element selected) */}
        <div className="w-80 bg-white border-l overflow-y-auto">
          <div className="p-4">
            <h3 className="font-medium mb-4">Properties</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="template-name">Template Name</Label>
                <Input
                  id="template-name"
                  value={templateData.name}
                  onChange={(e) => setTemplateData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter template name"
                />
              </div>
              
              <div className="text-sm text-gray-600">
                <p>Select an element to edit its properties</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateCreator;
