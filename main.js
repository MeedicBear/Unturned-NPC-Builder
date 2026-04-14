const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Handle export from renderer
ipcMain.handle('export-npc', async (event, npcData) => {
  const exportDir = path.join(__dirname, 'exports');
  if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir);

  const npcFolderName = `npc_${npcData.npcID || 'unnamed'}`;
  const npcFolderPath = path.join(exportDir, npcFolderName);
  if (!fs.existsSync(npcFolderPath)) fs.mkdirSync(npcFolderPath);

  // Build .dat contents
  const npcDat = buildNpcDat(npcData);
  const dialogueDat = buildDialogueDat(npcData);
  const vendorDat = buildVendorDat(npcData);
  const flagsDat = buildFlagsDat(npcData);

  fs.writeFileSync(path.join(npcFolderPath, 'NPC.dat'), npcDat, 'utf8');
  fs.writeFileSync(path.join(npcFolderPath, 'Dialogue.dat'), dialogueDat, 'utf8');
  fs.writeFileSync(path.join(npcFolderPath, 'Vendor.dat'), vendorDat, 'utf8');
  fs.writeFileSync(path.join(npcFolderPath, 'Flags.dat'), flagsDat, 'utf8');

  // Zip it
  const zip = new AdmZip();
  zip.addLocalFolder(npcFolderPath);
  const zipPath = path.join(exportDir, `${npcFolderName}.zip`);
  zip.writeZip(zipPath);

  return { folderPath: npcFolderPath, zipPath };
});

// --- Simple builders (you can expand these later) ---

function buildNpcDat(npc) {
  return [
    `ID ${npc.npcID || 0}`,
    `Name "${npc.name || 'Unnamed NPC'}"`,
    `Type Dialogue`,
    `Dialogue_ID ${npc.dialogueID || 1}`,
    npc.flags && npc.flags.length
      ? npc.flags.map(f => `Flag ${f.id} ${f.value}`).join('\n')
      : ''
  ].filter(Boolean).join('\n') + '\n';
}

function buildDialogueDat(npc) {
  // Single dialogue node for now
  const lines = [];
  lines.push('Dialogue');
  lines.push('{');
  lines.push(`\tID ${npc.dialogueID || 1}`);
  lines.push(`\tMessage "${npc.dialogueMessage || 'Hello survivor.'}"`);

  npc.responses.forEach((r, i) => {
    lines.push('\tResponse');
    lines.push('\t{');
    lines.push(`\t\tText "${r.text}"`);
    if (r.nextDialogueID) {
      lines.push(`\t\tDialogue ${r.nextDialogueID}`);
    }
    lines.push('\t}');
  });

  lines.push('}');
  return lines.join('\n') + '\n';
}

function buildVendorDat(npc) {
  const lines = [];
  lines.push('Vendor');
  lines.push('{');

  npc.vendorBuy.forEach(item => {
    lines.push(`\tBuy ${item.id} ${item.price}`);
  });

  npc.vendorSell.forEach(item => {
    lines.push(`\tSell ${item.id} ${item.price}`);
  });

  lines.push('}');
  return lines.join('\n') + '\n';
}

function buildFlagsDat(npc) {
  const lines = [];
  npc.flags.forEach(f => {
    lines.push(`Flag ${f.id} ${f.value}`);
  });
  return lines.join('\n') + '\n';
}
