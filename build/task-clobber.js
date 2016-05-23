
import fs from 'fs-promise';
import * as BuildConst from './const.js';

export default async function(opts) {
  await fs.remove(BuildConst.NODE_MODULES_DIR);
  await fs.remove(BuildConst.ELECTRON_DIR);
  await fs.remove(BuildConst.BUILD_CONFIG_FILE);
}
