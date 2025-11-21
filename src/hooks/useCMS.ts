import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface NavbarSettings {
  id: string;
  logoType: 'image' | 'text';
  logoImageId: number | null;
  logoSvg: string | null;
  logoText: string | null;
  logoSize?: number;
  logoLink?: string;
  navigationLinks: any;
  showLanguageSwitcher: boolean;
  availableLanguages: any;
  showDarkModeToggle: boolean;
  loginButtonText: string;
  loginButtonLink: string;
  showLoginButton: boolean;
  joinButtonText: string;
  joinButtonLink: string;
  joinButtonStyle: string;
  showJoinButton: boolean;
  backgroundColor?: string;
  textColor?: string;
  hoverColor?: string;
  fontFamily?: string;
  fontSize?: string;
  isSticky?: boolean;
  isTransparent?: boolean;
  transparentBg?: string;
  scrolledBg?: string;
  height?: number;
  updatedAt: Date;
}

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

export function useNavbarSettings() {
  return useQuery({
    queryKey: ["cms", "navbar"],
    queryFn: async () => {
      const res = await fetch("/api/cms/navbar");
      if (!res.ok) throw new Error("Failed to fetch navbar settings");
      return res.json() as Promise<NavbarSettings>;
    },
  });
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

export function useUpdateNavbarSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (settings: Partial<NavbarSettings>) => {
      const res = await fetch("/api/admin/cms/navbar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update navbar settings");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms", "navbar"] });
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

export function useFocusItems() {
  return useQuery({
    queryKey: ["cms", "focus-items"],
    queryFn: async () => {
      const res = await fetch("/api/cms/focus-items");
      if (!res.ok) throw new Error("Failed to fetch focus items");
      return res.json();
    },
  });
}

export function useStats() {
  return useQuery({
    queryKey: ["cms", "stats"],
    queryFn: async () => {
      const res = await fetch("/api/cms/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });
}

export function useTeamMembers() {
  return useQuery({
    queryKey: ["cms", "team-members"],
    queryFn: async () => {
      const res = await fetch("/api/cms/team-members");
      if (!res.ok) throw new Error("Failed to fetch team members");
      return res.json();
    },
  });
}

export function useTestimonials() {
  return useQuery({
    queryKey: ["cms", "testimonials"],
    queryFn: async () => {
      const res = await fetch("/api/cms/testimonials");
      if (!res.ok) throw new Error("Failed to fetch testimonials");
      return res.json();
    },
  });
}

export function useContactSettings() {
  return useQuery({
    queryKey: ["cms", "contact"],
    queryFn: async () => {
      const res = await fetch("/api/cms/contact");
      if (!res.ok) throw new Error("Failed to fetch contact settings");
      return res.json();
    },
  });
}

export function useFooterSettings() {
  return useQuery({
    queryKey: ["cms", "footer"],
    queryFn: async () => {
      const res = await fetch("/api/cms/footer");
      if (!res.ok) throw new Error("Failed to fetch footer settings");
      return res.json();
    },
  });
}
