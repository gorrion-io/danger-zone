import * as argon2 from 'argon2';
// TODO: Move password-related methods to auth service.
export async function verifyPassword(hash: string, plain: string): Promise<boolean> {
    return argon2.verify(hash, plain);
}
