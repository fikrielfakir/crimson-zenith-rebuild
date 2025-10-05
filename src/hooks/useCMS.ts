import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface HeroSettings {
  id: string;
  title: string;
  subtitle: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  backgroundType: string;
  backgroundMediaId: number | null;
  backgroundOverlayColor: string;
  backgroundOverlayOpacity: number;
  titleFontSize: string;
  titleColor: string;
  subtitleFontSize: string;
  subtitleColor: string;
  enableTypewriter: boolean;
  typewriterTexts: any;
  updatedAt: Date;
}

export interface ThemeSettings {
  id: string;
  primaryColor: string;
  secondaryColor: string;
  customCss: string | null;
  updatedAt: Date;
}

export interface MediaAsset {
  id: number;
  fileName: string;
  fileType: string;
  fileUrl: string;
  thumbnailUrl: string | null;
  altText: string | null;
  focalPoint: any;
  metadata: any;
  createdAt: Date;
}

export function useHeroSettings() {
  return useQuery({
    queryKey: ["cms", "hero"],
    queryFn: async () => {
      const res = await fetch("/api/cms/hero");
      if (!res.ok) throw new Error("Failed to fetch hero settings");
      return res.json() as Promise<HeroSettings>;
    },
  });
}

export function useThemeSettings() {
  return useQuery({
    queryKey: ["cms", "theme"],
    queryFn: async () => {
      const res = await fetch("/api/cms/theme");
      if (!res.ok) throw new Error("Failed to fetch theme settings");
      return res.json() as Promise<ThemeSettings>;
    },
  });
}

export function useUpdateHeroSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (settings: Partial<HeroSettings>) => {
      const res = await fetch("/api/admin/cms/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update hero settings");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", "hero"] });
    },
  });
}

export function useUpdateThemeSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (settings: Partial<ThemeSettings>) => {
      const res = await fetch("/api/admin/cms/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update theme settings");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", "theme"] });
    },
  });
}

export function useMediaAssets() {
  return useQuery({
    queryKey: ["cms", "media"],
    queryFn: async () => {
      const res = await fetch("/api/admin/cms/media", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch media assets");
      return res.json() as Promise<MediaAsset[]>;
    },
  });
}
