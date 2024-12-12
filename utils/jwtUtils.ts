import { create, verify, getNumericDate } from "https://deno.land/x/djwt@v3.0.2/mod.ts";

const secretKey = "your-secret-key";

export async function createJwt(userId: number) {
  const payload = {
    sub: userId.toString(),
    iat: getNumericDate(0),
    exp: getNumericDate(60 * 60), // 1 Stunde gültig
  };
  return await create({ alg: "HS256", typ: "JWT" }, payload, secretKey);
}

export async function verifyJwt(token: string) {
  try {
    return await verify(token, secretKey, "HS256");
  } catch {
    return null;
  }
}
