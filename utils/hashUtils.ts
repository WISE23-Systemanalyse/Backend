import { hash, compare } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts"; 

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 10); // Die Zahl "10" ist der Salt-Work-Faktor
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await compare(password, hash);
}
