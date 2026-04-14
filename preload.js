const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('npcAPI', {
  exportNPC: (npcData) => ipcRenderer.invoke('export-npc', npcData)
});
