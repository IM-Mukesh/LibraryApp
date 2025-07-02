// File: types/AppVersion.ts
export interface AppVersion {
  latestVersion: string;
  updateUrl: string;
  releaseNotes?: string;
  forceUpdate?: boolean;
}

// File: types/VersionData.ts
export interface VersionData {
  currentVersion: string; // ← only in app
  latestVersion: string;
  updateUrl: string;
  releaseNotes?: string;
  forceUpdate: boolean;
}
