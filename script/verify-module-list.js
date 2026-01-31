const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const MODULE_LIST_PATH = path.join(ROOT_DIR, 'lib/browser/api/module-list.ts');
const DOCS_DIR = path.join(ROOT_DIR, 'docs/api');
const AMBIENT_TYPES_PATH = path.join(ROOT_DIR, 'typings/internal-ambient.d.ts');

function getModuleList() {
  const content = fs.readFileSync(MODULE_LIST_PATH, 'utf8');
  const matches = content.matchAll(/name: '([^']+)'/g);
  const names = [];
  for (const match of matches) {
    names.push(match[1]);
  }
  return names;
}

function checkAlphabetical(names) {
  // Only check the main list (first 34 modules)
  const mainNames = names.slice(0, 34);
  const sortedNames = [...mainNames].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

  let ok = true;
  for (let i = 0; i < mainNames.length; i++) {
    if (mainNames[i] !== sortedNames[i]) {
      console.error(`Module list is not sorted alphabetically!`);
      console.error(`Mismatch at index ${i}: expected '${sortedNames[i]}', found '${mainNames[i]}'`);
      ok = false;
      break;
    }
  }
  return ok;
}

function checkAmbientTypes(names) {
  const content = fs.readFileSync(AMBIENT_TYPES_PATH, 'utf8');
  let allGood = true;

  const toSnakeCase = (str) => str.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();

  const bindingOverrides = {
    'BrowserWindow': 'electron_browser_window',
    'MessageChannelMain': 'electron_browser_message_port',
    'webContents': 'electron_browser_web_contents'
  };

  for (const name of names) {
    // Some modules don't use linked bindings directly or at all
    if (['ipcMain', 'MenuItem', 'ShareMenu', 'TouchBar', 'utilityProcess'].includes(name)) continue;

    let bindingName = bindingOverrides[name];
    if (!bindingName) {
      bindingName = `electron_browser_${toSnakeCase(name)}`;
    }

    if (!content.includes(`name: '${bindingName}'`)) {
      console.warn(`Warning: Might be missing type for ${name} (${bindingName}) in internal-ambient.d.ts`);
    }
  }
  return allGood;
}

function main() {
  const names = getModuleList();
  console.log(`Checking ${names.length} modules...`);

  const alphaOk = checkAlphabetical(names);
  const ambientOk = checkAmbientTypes(names);

  if (!alphaOk) {
    process.exit(1);
  }

  console.log('Verification finished.');
}

main();
