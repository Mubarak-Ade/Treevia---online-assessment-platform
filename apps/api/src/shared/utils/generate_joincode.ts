import { randomInt } from 'node:crypto';

const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

const JOIN_CODE_LENGTH = 6;

export function generateJoinCode(): string {
  let code = '';

  for (let i = 0; i < JOIN_CODE_LENGTH; i++) {
    const index = randomInt(ALPHABET.length);
    code += ALPHABET[index];
  }

  return code;
}