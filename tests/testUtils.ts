export function setEnv() {
  process.env.REGION = 'eu-north-1';
  process.env.TABLE_NAME = 'gitmetrix';
}

export function clearEnv() {
  process.env.REGION = '';
  process.env.TABLE_NAME = '';
}
