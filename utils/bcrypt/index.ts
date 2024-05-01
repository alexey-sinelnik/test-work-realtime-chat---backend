import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string): Promise<string> {
  const salt: string = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(
  password: string,
  comparePassword: string,
): Promise<boolean> {
  return bcrypt.compare(comparePassword, password);
}
