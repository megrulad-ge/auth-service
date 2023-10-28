const {2: replace = ''} = process.argv;

const { generateKeyPairSync }  = require('crypto');
const { writeFileSync, existsSync } = require('fs');
const { join } = require('path');

const targetDir = join( __dirname, '../.keys');

if(!existsSync(targetDir)) {
  console.error(`${targetDir} does not exist!`);
  process.exit(1);
}

const privateKeysExists = existsSync(targetDir + '/private.key');
const publicKeysExists = existsSync(targetDir + '/public.key');

if(privateKeysExists && publicKeysExists) {
  if(replace === 'replace') generateAndWriteKeyPairs('re-generated');
  else console.log('Key-pairs did NOT generate. Already present!');
  process.exit(0);
} else {
  generateAndWriteKeyPairs();
}

function generateAndWriteKeyPairs(operation = 'generated'){
  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });

  writeFileSync(targetDir + '/private.key', privateKey, 'utf8');
  writeFileSync(targetDir + '/public.key', publicKey, 'utf8');

  console.log(`Key-pairs ${operation} successfully.`);
}
