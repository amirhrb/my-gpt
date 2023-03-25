import { verify } from "jsonwebtoken";
export function isVaild(token) {
  try {
    const result = verify(token, process.env.SECRET_KEY);
    return result.user;
  } catch (err) {
    return err;
  }
}
