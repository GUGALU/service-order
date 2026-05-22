import {
  createHash,
  randomBytes,
  pbkdf2Sync,
  timingSafeEqual,
} from "node:crypto";

const HASH_ALGORITHM = "sha256";
const HASH_ITERATIONS = 120000;
const HASH_KEY_LENGTH = 32;

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(
    password,
    salt,
    HASH_ITERATIONS,
    HASH_KEY_LENGTH,
    HASH_ALGORITHM,
  ).toString("hex");

  return `pbkdf2$${HASH_ITERATIONS}$${salt}$${hash}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [scheme, iterations, salt, hash] = storedHash.split("$");
  if (scheme !== "pbkdf2" || !iterations || !salt || !hash) {
    return false;
  }

  const derivedHash = pbkdf2Sync(
    password,
    salt,
    Number(iterations),
    Buffer.from(hash, "hex").length,
    HASH_ALGORITHM,
  );
  const expectedHash = Buffer.from(hash, "hex");

  if (derivedHash.length !== expectedHash.length) {
    return false;
  }

  return timingSafeEqual(derivedHash, expectedHash);
}

export function createSessionToken() {
  return randomBytes(32).toString("hex");
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
