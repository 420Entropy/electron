const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Fallback to blow away old cache keys
const FALLBACK_HASH_VERSION = 3;

// Per platform hash versions to bust the cache on different platforms
const HASH_VERSIONS = {
  darwin: 3,
  win32: 4,
  linux: 3
};

// Base files to hash
const filesToHash = [
  path.resolve(__dirname, '../DEPS'),
  path.resolve(__dirname, '../yarn.lock'),
  path.resolve(__dirname, '../script/sysroots.json')
];

async function addAllFiles (dir) {
  const children = (await fs.promises.readdir(dir)).sort();
  const childResults = await Promise.all(children.map(async (child) => {
    const childPath = path.resolve(dir, child);
    const stat = await fs.promises.stat(childPath);
    if (stat.isDirectory()) {
      return await addAllFiles(childPath);
    } else {
      return [childPath];
    }
  }));
  return childResults.flat();
}

async function main () {
  // Add all patch files to the hash
  const patchFiles = await addAllFiles(path.resolve(__dirname, '../patches'));
  filesToHash.push(...patchFiles);

  // Create Hash
  const hasher = crypto.createHash('SHA256');
  hasher.update(`HASH_VERSION:${HASH_VERSIONS[process.platform] || FALLBACK_HASH_VERSION}`);

  const fileContents = await Promise.all(filesToHash.map(file => fs.promises.readFile(file)));
  for (const content of fileContents) {
    hasher.update(content);
  }

  // Add the GCLIENT_EXTRA_ARGS variable to the hash
  const extraArgs = process.env.GCLIENT_EXTRA_ARGS || 'no_extra_args';
  hasher.update(extraArgs);

  const effectivePlatform = extraArgs.includes('host_os=mac') ? 'darwin' : process.platform;

  // Write the hash to disk
  await fs.promises.writeFile(path.resolve(__dirname, '../.depshash'), hasher.digest('hex'));

  let targetContent = `${effectivePlatform}\n${process.env.TARGET_ARCH}\n${process.env.GN_CONFIG}\n${undefined}\n${process.env.GN_EXTRA_ARGS}\n${process.env.GN_BUILDFLAG_ARGS}`;
  const argsDir = path.resolve(__dirname, '../build/args');
  const argFiles = (await fs.promises.readdir(argsDir)).sort();
  const argContents = await Promise.all(argFiles.map(argFile => fs.promises.readFile(path.resolve(argsDir, argFile))));

  for (let i = 0; i < argFiles.length; i++) {
    targetContent += `\n${argFiles[i]}--${crypto.createHash('SHA1').update(argContents[i]).digest('hex')}`;
  }

  await fs.promises.writeFile(path.resolve(__dirname, '../.depshash-target'), targetContent);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
