import { sign } from "jsonwebtoken";
import { serialize } from "cookie";
import { isVaild } from "../../helper/utils/fns";

export default async function (req, res) {
  const token = req.cookies["session-token"];
  if (token)
    if (isVaild(token))
      return res.status(200).json({ message: "already loged in!" });
  if (req.method === "GET") {
    return res.status(400).json({ error: { message: "sign in first!" } });
  }
  if (req.method === "POST") {
    const { accessKey } = req.body;
    if (!accessKey)
      return res.status(501).json({ error: { message: "enter the key!" } });

    if (accessKey !== process.env.ACCESS_KEY)
      return res.status(501).json({ error: { message: "invalid key!" } });

    if (accessKey === process.env.ACCESS_KEY) {
      const expiration = 60 * 60 * 24 * 7;
      const token = sign({ user: "Admin" }, process.env.SECRET_KEY, {
        expiresIn: expiration,
      });
      const serialized = serialize("session-token", token, {
        httpOnly: true,
        path: "/",
        maxAge: expiration,
      });
      return res
        .status(200)
        .setHeader("Set-Cookie", serialized)
        .json({ message: "welcome!" });
    }
  }
}
