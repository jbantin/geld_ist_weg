import bcrypt from "bcrypt";

export const hashPassword = async (plainPassword: string) => {
  return await bcrypt.hash(plainPassword, 12);
};

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
