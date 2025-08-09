import crypto from 'crypto';
const key = Buffer.from(process.env.DATA_ENCRYPTION_KEY || '0000000000000000000000000000000000000000000000000000000000000000', 'hex');
export function encrypt(text: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString('base64');
}
export function decrypt(payloadB64: string) {
  const payload = Buffer.from(payloadB64, 'base64');
  const iv = payload.subarray(0, 12);
  const tag = payload.subarray(12, 28);
  const data = payload.subarray(28);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(data), decipher.final()]);
  return dec.toString('utf8');
}

