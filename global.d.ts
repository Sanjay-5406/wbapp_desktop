// global.d.ts
export {};

declare global {
  interface Window {
    electronAPI?: {
      isElectron: boolean;
      runCommand: (cmd: string) => Promise<{ success: boolean; output?: string; error?: string }>;
      downloadFile: (url: string, destPath: string) => Promise<{ success: boolean; message?: string; error?: string }>;
      // for execute btn 
      executePythonDocker: (url: string, filename: string) => Promise<{
        success: boolean;
        message?: string;
        output?: string;
        error?: string;
        savedFile?: string;
      }>;
    };
  }
}