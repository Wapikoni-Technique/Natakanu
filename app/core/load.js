import NatakanuCore from '.';

let coreInstance = null;
let coreLoading = null;

async function loadCore() {
  if (coreInstance) return coreInstance;
  if (coreLoading) return coreLoading;

  try {
    coreLoading = NatakanuCore.create();

    coreInstance = await coreLoading;

    coreLoading = null;

    return coreInstance;
  } catch (e) {
    coreLoading = null;
    throw e;
  }
}

global.loadCore = loadCore;
