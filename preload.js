const { contextBridge, ipcRenderer } = require('electron');

// Expose safe desktop capabilities to your Next.js React frontend
contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  runCommand: (cmd) => ipcRenderer.invoke('run-terminal-cmd', cmd),
  downloadFile: (url, destPath) => ipcRenderer.invoke('download-file', { url, destPath }),
  executePythonDocker: (url, filename) => 
    ipcRenderer.invoke('execute-python-docker', { url, filename }),
});