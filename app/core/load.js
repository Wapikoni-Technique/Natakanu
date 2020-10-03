import minimist from 'minimist';
import NatakanuCore from '.';

let coreInstance = null;
let coreLoading = null;

async function loadCore() {
  if (coreInstance) return coreInstance;
  if (coreLoading) return coreLoading;
  const args = minimist(process.argv.slice(2));
  console.log(args);
  try {
    coreLoading = NatakanuCore.create(args);

    coreInstance = await coreLoading;

    coreLoading = null;

    return coreInstance;
  } catch (e) {
    console.error('Error loading core', e.stack);
    coreLoading = null;
    throw e;
  }
}

global.loadCore = loadCore;
