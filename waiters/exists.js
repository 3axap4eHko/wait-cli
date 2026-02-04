import { access, constants } from 'node:fs/promises';
import { glob } from 'glob';

const modeMap = {
  r: constants.R_OK,
  w: constants.W_OK,
  x: constants.X_OK,
};

function getMode(mode) {
  return Array.from(mode).reduce((result, name) => result | (modeMap[name] | 0), 0);
}

export async function exists({ path, mode = '' }) {
  const fsMode = getMode(mode);
  console.log(`Waiting for existing path '${path}' with mode '${mode}' ...`);
  const filenames = await glob(path);
  if (filenames.length > 0) {
    await access(filenames[0], fsMode);
    console.log(`Path '${path}' with mode '${mode}' exists`);
    return;
  }
  throw new Error(`Path '${path}' not found`);
}
