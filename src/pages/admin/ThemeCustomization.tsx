import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import AdminLayout from "@/components/admin/AdminLayout";
import { 
  Palette, 
  Type, 
  Layout, 
  Save, 
  RotateCcw, 
  Eye,
  Monitor,
  Smartphone,
  Tablet,
  Sun,
  Moon
} from "lucide-react";
import { toast } from "sonner";

const ThemeCustomization = () => {
  const [themeSettings, setThemeSettings] = useState({
    primaryColor: "#112250",
    secondaryColor: "#D8C18D",
    accentColor: "#3b82f6",
    fontFamily: "Inter",
    fontSize: 16,
    borderRadius: 8,
    darkMode: false,
    buttonStyle: "rounded",
    spacing: "normal"
  });

  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const colorPresets = [
    { name: "Default", primary: "#112250", secondary: "#D8C18D" },
    { name: "Ocean Blue", primary: "#0077be", secondary: "#00b4d8" },
    { name: "Forest Green", primary: "#2d6a4f", secondary: "#95d5b2" },
    { name: "Sunset Orange", primary: "#ff6b35", secondary: "#f7931e" },
    { name: "Royal Purple", primary: "#6a4c93", secondary: "#c77dff" },
    { name: "Modern Dark", primary: "#1f2937", secondary: "#6366f1" }
  ];

  const fontOptions = [
    "Inter",
    "Roboto",
    "Open Sans",
    "Poppins",
    "Montserrat",
    "Lato",
    "System UI"
  ];

  const buttonStyles = [
    { value: "rounded", label: "Rounded", class: "rounded-md" },
    { value: "pill", label: "Pill", class: "rounded-full" },
    { value: "square", label: "Square", class: "rounded-none" },
    { value: "sharp", label: "Sharp", class: "rounded-sm" }
  ];

  const spacingOptions = [
    { value: "compact", label: "Compact", multiplier: 0.75 },
    { value: "normal", label: "Normal", multiplier: 1 },
    { value: "relaxed", label: "Relaxed", multiplier: 1.25 },
    { value: "spacious", label: "Spacious", multiplier: 1.5 }
  ];

  const handleColorChange = (key: string, value: string) => {
    setThemeSettings(prev => ({ ...prev, [key]: value }));
    setUnsavedChanges(true);
  };

  const handleSave = () => {
    // Simulate saving theme settings
    toast.success("Theme saved successfully!", {
      description: "Your customizations have been applied to the platform."
    });
    setUnsavedChanges(false);
  };

  const handleReset = () => {
    setThemeSettings({
      primaryColor: "#112250",
      secondaryColor: "#D8C18D",
      accentColor: "#3b82f6",
      fontFamily: "Inter",
      fontSize: 16,
      borderRadius: 8,
      darkMode: false,
      buttonStyle: "rounded",
      spacing: "normal"
    });
    setUnsavedChanges(false);
    toast.info("Theme reset to defaults");
  };

  const applyPreset = (preset: typeof colorPresets[0]) => {
    setThemeSettings(prev => ({
      ...prev,
      primaryColor: preset.primary,
      secondaryColor: preset.secondary
    }));
    setUnsavedChanges(true);
    toast.success(`Applied ${preset.name} preset`);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 px-4 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Theme Customization</h1>
            <p className="text-muted-foreground mt-1">
              Customize the look and feel of your platform
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button onClick={handleSave} className="gap-2" disabled={!unsavedChanges}>
              <Save className="h-4 w-4" />
              Save Changes
              {unsavedChanges && <Badge variant="destructive" className="ml-2">!</Badge>}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customization Controls */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="colors" className="w-full">
              <TabsList className="grid w-full grid-cols-4 gap-2 h-auto p-1">
                <TabsTrigger value="colors" className="gap-2">
                  <Palette className="h-4 w-4" />
                  <span className="hidden sm:inline">Colors</span>
                </TabsTrigger>
                <TabsTrigger value="typography" className="gap-2">
                  <Type className="h-4 w-4" />
                  <span className="hidden sm:inline">Typography</span>
                </TabsTrigger>
                <TabsTrigger value="layout" className="gap-2">
                  <Layout className="h-4 w-4" />
                  <span className="hidden sm:inline">Layout</span>
                </TabsTrigger>
                <TabsTrigger value="advanced" className="gap-2">
                  {themeSettings.darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  <span className="hidden sm:inline">Mode</span>
                </TabsTrigger>
              </TabsList>

              {/* Colors Tab */}
              <TabsContent value="colors" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Color Presets</CardTitle>
                    <CardDescription>Quick apply pre-configured color schemes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {colorPresets.map((preset) => (
                        <Button
                          key={preset.name}
                          variant="outline"
                          onClick={() => applyPreset(preset)}
                          className="h-auto flex-col gap-2 p-4"
                        >
                          <div className="flex gap-2">
                            <div 
                              className="w-8 h-8 rounded-md border" 
                              style={{ backgroundColor: preset.primary }}
                            />
                            <div 
                              className="w-8 h-8 rounded-md border" 
                              style={{ backgroundColor: preset.secondary }}
                            />
                          </div>
                          <span className="text-xs">{preset.name}</span>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Custom Colors</CardTitle>
                    <CardDescription>Fine-tune your brand colors</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Primary Color</Label>
                      <div className="flex gap-3">
                        <Input
                          type="color"
                          value={themeSettings.primaryColor}
                          onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                          className="w-20 h-10"
                        />
                        <Input
                          type="text"
                          value={themeSettings.primaryColor}
                          onChange={(e) => handleColorChange("primaryColor", e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Secondary Color</Label>
                      <div className="flex gap-3">
                        <Input
                          type="color"
                          value={themeSettings.secondaryColor}
                          onChange={(e) => handleColorChange("secondaryColor", e.target.value)}
                          className="w-20 h-10"
                        />
                        <Input
                          type="text"
                          value={themeSettings.secondaryColor}
                          onChange={(e) => handleColorChange("secondaryColor", e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Accent Color</Label>
                      <div className="flex gap-3">
                        <Input
                          type="color"
                          value={themeSettings.accentColor}
                          onChange={(e) => handleColorChange("accentColor", e.target.value)}
                          className="w-20 h-10"
                        />
                        <Input
                          type="text"
                          value={themeSettings.accentColor}
                          onChange={(e) => handleColorChange("accentColor", e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Typography Tab */}
              <TabsContent value="typography" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Font Settings</CardTitle>
                    <CardDescription>Customize typography across the platform</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Font Family</Label>
                      <Select
                        value={themeSettings.fontFamily}
                        onValueChange={(value) => {
                          setThemeSettings(prev => ({ ...prev, fontFamily: value }));
                          setUnsavedChanges(true);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.map((font) => (
                            <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                              {font}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Base Font Size: {themeSettings.fontSize}px</Label>
                      <Slider
                        value={[themeSettings.fontSize]}
                        onValueChange={(value) => {
                          setThemeSettings(prev => ({ ...prev, fontSize: value[0] }));
                          setUnsavedChanges(true);
                        }}
                        min={12}
                        max={20}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Layout Tab */}
              <TabsContent value="layout" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Layout Settings</CardTitle>
                    <CardDescription>Adjust spacing, borders, and layout elements</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Button Style</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {buttonStyles.map((style) => (
                          <Button
                            key={style.value}
                            variant={themeSettings.buttonStyle === style.value ? "default" : "outline"}
                            onClick={() => {
                              setThemeSettings(prev => ({ ...prev, buttonStyle: style.value }));
                              setUnsavedChanges(true);
                            }}
                            className={style.class}
                          >
                            {style.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Border Radius: {themeSettings.borderRadius}px</Label>
                      <Slider
                        value={[themeSettings.borderRadius]}
                        onValueChange={(value) => {
                          setThemeSettings(prev => ({ ...prev, borderRadius: value[0] }));
                          setUnsavedChanges(true);
                        }}
                        min={0}
                        max={24}
                        step={2}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Spacing</Label>
                      <Select
                        value={themeSettings.spacing}
                        onValueChange={(value) => {
                          setThemeSettings(prev => ({ ...prev, spacing: value }));
                          setUnsavedChanges(true);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {spacingOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Advanced Tab */}
              <TabsContent value="advanced" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Settings</CardTitle>
                    <CardDescription>Dark mode and other advanced options</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable dark theme across the platform
                        </p>
                      </div>
                      <Switch
                        checked={themeSettings.darkMode}
                        onCheckedChange={(checked) => {
                          setThemeSettings(prev => ({ ...prev, darkMode: checked }));
                          setUnsavedChanges(true);
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Live Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Live Preview
                  </CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant={previewDevice === "desktop" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setPreviewDevice("desktop")}
                    >
                      <Monitor className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={previewDevice === "tablet" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setPreviewDevice("tablet")}
                    >
                      <Tablet className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={previewDevice === "mobile" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setPreviewDevice("mobile")}
                    >
                      <Smartphone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  className={`border rounded-lg p-6 space-y-4 transition-all ${
                    themeSettings.darkMode ? 'bg-gray-900 text-white' : 'bg-white'
                  }`}
                  style={{
                    fontFamily: themeSettings.fontFamily,
                    fontSize: `${themeSettings.fontSize}px`,
                    borderRadius: `${themeSettings.borderRadius}px`
                  }}
                >
                  <h3 className="text-lg font-bold">Preview Heading</h3>
                  <p className="text-sm opacity-80">
                    This is how your text will look with the current settings.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      style={{ 
                        backgroundColor: themeSettings.primaryColor,
                        borderRadius: buttonStyles.find(s => s.value === themeSettings.buttonStyle)?.class.includes('full') ? '9999px' : `${themeSettings.borderRadius}px`
                      }}
                    >
                      Primary
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      style={{ 
                        borderColor: themeSettings.secondaryColor,
                        color: themeSettings.secondaryColor,
                        borderRadius: buttonStyles.find(s => s.value === themeSettings.buttonStyle)?.class.includes('full') ? '9999px' : `${themeSettings.borderRadius}px`
                      }}
                    >
                      Secondary
                    </Button>
                  </div>
                  <Badge style={{ backgroundColor: themeSettings.accentColor }}>
                    Accent Badge
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Primary:</span>
                  <span className="font-mono">{themeSettings.primaryColor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Secondary:</span>
                  <span className="font-mono">{themeSettings.secondaryColor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Font:</span>
                  <span>{themeSettings.fontFamily}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Font Size:</span>
                  <span>{themeSettings.fontSize}px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Border Radius:</span>
                  <span>{themeSettings.borderRadius}px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dark Mode:</span>
                  <span>{themeSettings.darkMode ? "Enabled" : "Disabled"}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ThemeCustomization;
