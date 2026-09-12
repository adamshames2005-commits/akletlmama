import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "./user.model.js";
import type { LoginInput, SignUpInput } from "./auth.schema.js";
import { normalizePhone } from "./auth.schema.js";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  return secret;
};

const publicUser = (user: { _id: unknown; name: string; phone: string; role: string }) => ({
  id: String(user._id),
  name: user.name,
  phone: user.phone,
  role: user.role,
});

const createToken = (user: { _id: unknown; role: string }) =>
  jwt.sign({ sub: String(user._id), role: user.role }, getJwtSecret(), { expiresIn: "7d" });

export const registerUser = async (input: SignUpInput) => {
  const phone = normalizePhone(input.phone);
  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await User.create({ name: input.name, phone, passwordHash, role: "customer" });
  return { token: createToken(user), user: publicUser(user) };
};

export const loginUser = async (input: LoginInput) => {
  const phone = normalizePhone(input.phone);
  const user = await User.findOne({ phone });
  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) return null;
  return { token: createToken(user), user: publicUser(user) };
};

export const ensureAdminAccount = async () => {
  const phone = process.env.ADMIN_PHONE;
  const password = process.env.ADMIN_PASSWORD;
  if (!phone || !password) {
    console.warn("Admin account not seeded: ADMIN_PHONE and ADMIN_PASSWORD are missing");
    return;
  }

  const normalizedPhone = normalizePhone(phone);
  const passwordHash = await bcrypt.hash(password, 12);
  await User.findOneAndUpdate(
    { phone: normalizedPhone },
    { name: "Admin", phone: normalizedPhone, passwordHash, role: "admin" },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};
