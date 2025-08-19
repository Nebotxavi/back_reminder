const ALPHABET =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const BASE = BigInt(ALPHABET.length);

export function encodeBase62(num: bigint): string {
  if (num === 0n) return ALPHABET[0];
  let str = "";
  while (num > 0n) {
    const rem = num % BASE;
    str = ALPHABET[Number(rem)] + str;
    num = num / BASE;
  }
  return str;
}

export function decodeBase62(str: string): bigint {
  let num = 0n;
  for (const char of str) {
    num = num * BASE + BigInt(ALPHABET.indexOf(char));
  }
  return num;
}
