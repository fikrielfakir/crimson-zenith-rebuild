import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Languages, Pencil, Search } from "lucide-react";

const LANGUAGES = [
  { code: "ar", label: "العربية", flag: "🇲🇦" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

const ENTITY_CONFIGS: Record<
  string,
  { label: string; fields: { key: string; label: string; multiline?: boolean }[] }
> = {
  club: {
    label: "Clubs",
    fields: [
      { key: "name", label: "Name" },
      { key: "description", label: "Description", multiline: true },
      { key: "longDescription", label: "Long Description", multiline: true },
      { key: "location", label: "Location" },
    ],
  },
  event: {
    label: "Events",
    fields: [
      { key: "title", label: "Title" },
      { key: "subtitle", label: "Subtitle" },
      { key: "description", label: "Description", multiline: true },
      { key: "location", label: "Location" },
    ],
  },
  blog_post: {
    label: "Blog Posts",
    fields: [
      { key: "title", label: "Title" },
      { key: "excerpt", label: "Excerpt", multiline: true },
      { key: "content", label: "Content", multiline: true },
    ],
  },
  testimonial: {
    label: "Testimonials",
    fields: [
      { key: "name", label: "Name" },
      { key: "role", label: "Role" },
      { key: "feedback", label: "Feedback", multiline: true },
    ],
  },
  focus_item: {
    label: "Focus Areas",
    fields: [
      { key: "title", label: "Title" },
      { key: "description", label: "Description", multiline: true },
    ],
  },
  team_member: {
    label: "Team Members",
    fields: [
      { key: "name", label: "Name" },
      { key: "role", label: "Role" },
      { key: "bio", label: "Bio", multiline: true },
    ],
  },
  partner: {
    label: "Partners",
    fields: [
      { key: "name", label: "Name" },
      { key: "description", label: "Description", multiline: true },
    ],
  },
};

interface Translation {
  id: number;
  entityType: string;
  entityId: string;
  field: string;
  language: string;
  value: string;
}

async function apiRequest(method: string, url: string, body?: any) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export default function TranslationsManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeEntityType, setActiveEntityType] = useState("club");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingEntity, setEditingEntity] = useState<{
    id: string;
    label: string;
    entityType: string;
  } | null>(null);
  const [draftValues, setDraftValues] = useState<
    Record<string, Record<string, string>>
  >({});

  const entityConfig = ENTITY_CONFIGS[activeEntityType];

  function extractArray(d: any): any[] {
    if (Array.isArray(d)) return d;
    if (d && Array.isArray(d.data)) return d.data;
    if (d && Array.isArray(d.events)) return d.events;
    if (d && Array.isArray(d.posts)) return d.posts;
    if (d && Array.isArray(d.partners)) return d.partners;
    return [];
  }

  const { data: clubs = [] } = useQuery<any[]>({
    queryKey: ["/api/clubs"],
    queryFn: () => fetch("/api/clubs").then((r) => r.json()).then(extractArray),
    enabled: activeEntityType === "club",
  });
  const { data: events = [] } = useQuery<any[]>({
    queryKey: ["/api/events"],
    queryFn: () => fetch("/api/events").then((r) => r.json()).then(extractArray),
    enabled: activeEntityType === "event",
  });
  const { data: blogPosts = [] } = useQuery<any[]>({
    queryKey: ["/api/news"],
    queryFn: () => fetch("/api/news").then((r) => r.json()).then(extractArray),
    enabled: activeEntityType === "blog_post",
  });
  const { data: testimonials = [] } = useQuery<any[]>({
    queryKey: ["/api/cms/testimonials"],
    queryFn: () => fetch("/api/cms/testimonials").then((r) => r.json()).then(extractArray),
    enabled: activeEntityType === "testimonial",
  });
  const { data: focusItems = [] } = useQuery<any[]>({
    queryKey: ["/api/cms/focus-items"],
    queryFn: () => fetch("/api/cms/focus-items").then((r) => r.json()).then(extractArray),
    enabled: activeEntityType === "focus_item",
  });
  const { data: teamMembers = [] } = useQuery<any[]>({
    queryKey: ["/api/cms/team-members"],
    queryFn: () => fetch("/api/cms/team-members").then((r) => r.json()).then(extractArray),
    enabled: activeEntityType === "team_member",
  });
  const { data: partners = [] } = useQuery<any[]>({
    queryKey: ["/api/cms/partners"],
    queryFn: () => fetch("/api/cms/partners").then((r) => r.json()).then(extractArray),
    enabled: activeEntityType === "partner",
  });

  const entityLists: Record<string, any[]> = {
    club: clubs,
    event: events,
    blog_post: blogPosts,
    testimonial: testimonials,
    focus_item: focusItems,
    team_member: teamMembers,
    partner: partners,
  };

  const currentList = entityLists[activeEntityType] || [];

  const getEntityLabel = (entity: any) => {
    return entity.name || entity.title || entity.feedback?.slice(0, 40) || `#${entity.id}`;
  };

  const filteredList = currentList.filter((e) =>
    getEntityLabel(e).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { data: entityTranslations = [] } = useQuery<Translation[]>({
    queryKey: ["/api/translations", editingEntity?.entityType, editingEntity?.id],
    queryFn: () =>
      fetch(
        `/api/translations/${editingEntity!.entityType}/${editingEntity!.id}`
      ).then((r) => r.json()),
    enabled: !!editingEntity,
  });

  const saveMutation = useMutation({
    mutationFn: async (data: {
      entityType: string;
      entityId: string;
      field: string;
      language: string;
      value: string;
    }) => apiRequest("POST", "/api/admin/translations", data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "/api/translations",
          editingEntity?.entityType,
          editingEntity?.id,
        ],
      });
      queryClient.invalidateQueries({ queryKey: ["/api/translations/batch"] });
    },
    onError: () => toast({ title: "Save failed", variant: "destructive" }),
  });

  const openEdit = (entity: any) => {
    const id = String(entity.id);
    setEditingEntity({
      id,
      label: getEntityLabel(entity),
      entityType: activeEntityType,
    });
    const initial: Record<string, Record<string, string>> = {};
    for (const lang of LANGUAGES) {
      initial[lang.code] = {};
      for (const field of entityConfig.fields) {
        initial[lang.code][field.key] = "";
      }
    }
    setDraftValues(initial);
  };

  const handleDialogOpen = (open: boolean) => {
    if (!open) setEditingEntity(null);
  };

  const getValue = (lang: string, field: string) => {
    if (draftValues[lang]?.[field] !== undefined) {
      return draftValues[lang][field];
    }
    const existing = entityTranslations.find(
      (t) => t.language === lang && t.field === field
    );
    return existing?.value || "";
  };

  const setValue = (lang: string, field: string, value: string) => {
    setDraftValues((prev) => ({
      ...prev,
      [lang]: { ...(prev[lang] || {}), [field]: value },
    }));
  };

  const saveAll = async () => {
    if (!editingEntity) return;
    const saves: Promise<any>[] = [];
    for (const lang of LANGUAGES) {
      for (const field of entityConfig.fields) {
        const value = getValue(lang.code, field.key);
        if (value.trim()) {
          saves.push(
            saveMutation.mutateAsync({
              entityType: editingEntity.entityType,
              entityId: editingEntity.id,
              field: field.key,
              language: lang.code,
              value: value.trim(),
            })
          );
        }
      }
    }
    await Promise.all(saves);
    toast({ title: "Translations saved" });
  };

  const translationCount = (entityId: string) => {
    return 0;
  };

  return (
    <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Languages className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Content Translations</h1>
            <p className="text-muted-foreground mt-1">
              Add Arabic, French, and Spanish translations for database content
            </p>
          </div>
        </div>

        <Tabs
          value={activeEntityType}
          onValueChange={(v) => {
            setActiveEntityType(v);
            setSearchQuery("");
          }}
        >
          <TabsList className="flex-wrap h-auto gap-1">
            {Object.entries(ENTITY_CONFIGS).map(([key, cfg]) => (
              <TabsTrigger key={key} value={key}>
                {cfg.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(ENTITY_CONFIGS).map(([key]) => (
            <TabsContent key={key} value={key} className="mt-4">
              <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name / Title</TableHead>
                      <TableHead>Languages</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredList.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No items found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredList.map((entity) => (
                        <TableRow key={entity.id}>
                          <TableCell className="font-mono text-sm text-muted-foreground">
                            {entity.id}
                          </TableCell>
                          <TableCell className="font-medium">
                            {getEntityLabel(entity)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {LANGUAGES.map((lang) => (
                                <Badge
                                  key={lang.code}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {lang.flag} {lang.code.toUpperCase()}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEdit(entity)}
                            >
                              <Pencil className="w-4 h-4 mr-1" />
                              Translate
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <Dialog open={!!editingEntity} onOpenChange={handleDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Translate: {editingEntity?.label}
              </DialogTitle>
            </DialogHeader>
            {editingEntity && (
              <div className="space-y-4">
                <Tabs defaultValue="ar">
                  <TabsList>
                    {LANGUAGES.map((lang) => (
                      <TabsTrigger key={lang.code} value={lang.code}>
                        {lang.flag} {lang.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {LANGUAGES.map((lang) => (
                    <TabsContent
                      key={lang.code}
                      value={lang.code}
                      className="space-y-4 mt-4"
                    >
                      {ENTITY_CONFIGS[editingEntity.entityType].fields.map(
                        (field) => (
                          <div key={field.key} className="space-y-1">
                            <Label>{field.label}</Label>
                            {field.multiline ? (
                              <Textarea
                                value={getValue(lang.code, field.key)}
                                onChange={(e) =>
                                  setValue(lang.code, field.key, e.target.value)
                                }
                                rows={field.key === "content" ? 8 : 3}
                                dir={lang.code === "ar" ? "rtl" : "ltr"}
                                placeholder={`${field.label} in ${lang.label}`}
                              />
                            ) : (
                              <Input
                                value={getValue(lang.code, field.key)}
                                onChange={(e) =>
                                  setValue(lang.code, field.key, e.target.value)
                                }
                                dir={lang.code === "ar" ? "rtl" : "ltr"}
                                placeholder={`${field.label} in ${lang.label}`}
                              />
                            )}
                          </div>
                        )
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
                <div className="flex justify-end pt-2">
                  <Button
                    onClick={saveAll}
                    disabled={saveMutation.isPending}
                  >
                    {saveMutation.isPending ? "Saving..." : "Save Translations"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
    </div>
  );
}
