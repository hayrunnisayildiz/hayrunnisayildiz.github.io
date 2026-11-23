export type AppType = "terminal" | "safari" | "photos" | "blog" | "projects" | "contacts" | "maps";

export interface wType {
    id: string;
    type: AppType;
    minimized: boolean;
    maximized: boolean;
    position: { x: number; y: number };
    size: { width: number; height: number };
    zIndex: number;
    /** Size/position to restore when un-maximizing */
  restore?: { position: { x: number; y: number }; size: { width: number; height: number } };
}