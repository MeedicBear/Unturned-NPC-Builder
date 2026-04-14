const npcState = {
  npcID: '',
  name: '',
  dialogueID: 1,
  dialogueMessage: 'Hello survivor.',
  responses: [],
  vendorBuy: [],
  vendorSell: [],
  flags: []
};

const el = (id) => document.getElementById(id);

function renderDynamicLists() {
  // Responses
  const responsesDiv = el('responses');
  responsesDiv.innerHTML = '';
  npcState.responses.forEach((r, idx) => {
    const row = document.createElement('div');
    row.className = 'dynamic-row';
    row.innerHTML = `
      <input type="text" placeholder="Response text" value="${r.text}">
      <input type="number" placeholder="Next Dialogue ID (optional)" value="${r.nextDialogueID || ''}">
      <button data-idx="${idx}" data-type="response">X</button>
    `;
    const [textInput, idInput, btn] = row.querySelectorAll('input,button');
    textInput.addEventListener('input', e => {
      npcState.responses[idx].text = e.target.value;
      updatePreview();
    });
    idInput.addEventListener('input', e => {
      npcState.responses[idx].nextDialogueID = e.target.value ? Number(e.target.value) : null;
      updatePreview();
    });
    btn.addEventListener('click', () => {
      npcState.responses.splice(idx, 1);
      renderDynamicLists();
      updatePreview();
    });
    responsesDiv.appendChild(row);
  });

  // Vendor Buy
  const vendorBuyDiv = el('vendorBuy');
  vendorBuyDiv.innerHTML = '';
  npcState.vendorBuy.forEach((item, idx) => {
    const row = document.createElement('div');
    row.className = 'dynamic-row';
    row.innerHTML = `
      <input type="number" placeholder="Item ID" value="${item.id}">
      <input type="number" placeholder="Price" value="${item.price}">
      <button data-idx="${idx}" data-type="vendorBuy">X</button>
    `;
    const [idInput, priceInput, btn] = row.querySelectorAll('input,button');
    idInput.addEventListener('input', e => {
      npcState.vendorBuy[idx].id = Number(e.target.value) || 0;
      updatePreview();
    });
    priceInput.addEventListener('input', e => {
      npcState.vendorBuy[idx].price = Number(e.target.value) || 0;
      updatePreview();
    });
    btn.addEventListener('click', () => {
      npcState.vendorBuy.splice(idx, 1);
      renderDynamicLists();
      updatePreview();
    });
    vendorBuyDiv.appendChild(row);
  });

  // Vendor Sell
  const vendorSellDiv = el('vendorSell');
  vendorSellDiv.innerHTML = '';
  npcState.vendorSell.forEach((item, idx) => {
    const row = document.createElement('div');
    row.className = 'dynamic-row';
    row.innerHTML = `
      <input type="number" placeholder="Item ID" value="${item.id}">
      <input type="number" placeholder="Price" value="${item.price}">
      <button data-idx="${idx}" data-type="vendorSell">X</button>
    `;
    const [idInput, priceInput, btn] = row.querySelectorAll('input,button');
    idInput.addEventListener('input', e => {
      npcState.vendorSell[idx].id = Number(e.target.value) || 0;
      updatePreview();
    });
    priceInput.addEventListener('input', e => {
      npcState.vendorSell[idx].price = Number(e.target.value) || 0;
      updatePreview();
    });
    btn.addEventListener('click', () => {
      npcState.vendorSell.splice(idx, 1);
      renderDynamicLists();
      updatePreview();
    });
    vendorSellDiv.appendChild(row);
  });

  // Flags
  const flagsDiv = el('flags');
  flagsDiv.innerHTML = '';
  npcState.flags.forEach((f, idx) => {
    const row = document.createElement('div');
    row.className = 'dynamic-row';
    row.innerHTML = `
      <input type="number" placeholder="Flag ID" value="${f.id}">
      <input type="number" placeholder="Value" value="${f.value}">
      <button data-idx="${idx}" data-type="flag">X</button>
    `;
    const [idInput, valueInput, btn] = row.querySelectorAll('input,button');
    idInput.addEventListener('input', e => {
      npcState.flags[idx].id = Number(e.target.value) || 0;
      updatePreview();
    });
    valueInput.addEventListener('input', e => {
      npcState.flags[idx].value = Number(e.target.value) || 0;
      updatePreview();
    });
    btn.addEventListener('click', () => {
      npcState.flags.splice(idx, 1);
      renderDynamicLists();
      updatePreview();
    });
    flagsDiv.appendChild(row);
  });
}

function buildNpcDatPreview() {
  const lines = [];
  lines.push(`ID ${npcState.npcID || 0}`);
  lines.push(`Name "${npcState.name || 'Unnamed NPC'}"`);
  lines.push(`Type Dialogue`);
  lines.push(`Dialogue_ID ${npcState.dialogueID || 1}`);
  npcState.flags.forEach(f => {
    lines.push(`Flag ${f.id} ${f.value}`);
  });
  return lines.join('\n');
}

function buildDialogueDatPreview() {
  const lines = [];
  lines.push('Dialogue');
  lines.push('{');
  lines.push(`\tID ${npcState.dialogueID || 1}`);
  lines.push(`\tMessage "${npcState.dialogueMessage || 'Hello survivor.'}"`);
  npcState.responses.forEach(r => {
    lines.push('\tResponse');
    lines.push('\t{');
    lines.push(`\t\tText "${r.text || ''}"`);
    if (r.nextDialogueID) {
      lines.push(`\t\tDialogue ${r.nextDialogueID}`);
    }
    lines.push('\t}');
  });
  lines.push('}');
  return lines.join('\n');
}

function buildVendorDatPreview() {
  const lines = [];
  lines.push('Vendor');
  lines.push('{');
  npcState.vendorBuy.forEach(item => {
    lines.push(`\tBuy ${item.id} ${item.price}`);
  });
  npcState.vendorSell.forEach(item => {
    lines.push(`\tSell ${item.id} ${item.price}`);
  });
  lines.push('}');
  return lines.join('\n');
}

function buildFlagsDatPreview() {
  return npcState.flags.map(f => `Flag ${f.id} ${f.value}`).join('\n');
}

function updatePreview() {
  el('previewNpc').textContent = buildNpcDatPreview();
  el('previewDialogue').textContent = buildDialogueDatPreview();
  el('previewVendor').textContent = buildVendorDatPreview();
  el('previewFlags').textContent = buildFlagsDatPreview();
}

// Wire up base inputs
el('npcID').addEventListener('input', e => {
  npcState.npcID = Number(e.target.value) || 0;
  updatePreview();
});
el('npcName').addEventListener('input', e => {
  npcState.name = e.target.value;
  updatePreview();
});
el('dialogueID').addEventListener('input', e => {
  npcState.dialogueID = Number(e.target.value) || 1;
  updatePreview();
});
el('dialogueMessage').addEventListener('input', e => {
  npcState.dialogueMessage = e.target.value;
  updatePreview();
});

// Add buttons
el('addResponseBtn').addEventListener('click', () => {
  npcState.responses.push({ text: '', nextDialogueID: null });
  renderDynamicLists();
  updatePreview();
});

el('addVendorBuyBtn').addEventListener('click', () => {
  npcState.vendorBuy.push({ id: 0, price: 0 });
  renderDynamicLists();
  updatePreview();
});

el('addVendorSellBtn').addEventListener('click', () => {
  npcState.vendorSell.push({ id: 0, price: 0 });
  renderDynamicLists();
  updatePreview();
});

el('addFlagBtn').addEventListener('click', () => {
  npcState.flags.push({ id: 0, value: 0 });
  renderDynamicLists();
  updatePreview();
});

// Export
el('exportBtn').addEventListener('click', async () => {
  el('exportStatus').textContent = 'Exporting...';
  try {
    const result = await window.npcAPI.exportNPC(npcState);
    el('exportStatus').textContent =
      `Exported to folder: ${result.folderPath}\nZIP: ${result.zipPath}`;
  } catch (err) {
    console.error(err);
    el('exportStatus').textContent = 'Export failed. Check console.';
  }
});

// Initial render
renderDynamicLists();
updatePreview();
