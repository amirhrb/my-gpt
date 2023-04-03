import { serialize } from "cookie";
import { isVaildToken, isVaildKey } from "../../helper/utils/fns";

const emptyCookie = serialize("session-token", "", {
  httpOnly: true,
  path: "/",
  maxAge: 1,
});

async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(403).json({ status: "failure", message: "bad request" });
  const token = req.cookies["session-token"];
  if (!token) {
    return res.status(401).json({
      status: "failure",
      message: "Please enter an apiKey",
    });
  }
  const tokenResult = isVaildToken(token);
  if (!tokenResult) {
    return res.status(401).setHeader("Set-Cookie", emptyCookie).json({
      status: "failure",
      message: "Please enter an apiKey",
    });
  }
  const keyResult = await isVaildKey(tokenResult.userKey);
  if (keyResult.status === "OK") {
    return res.status(200).json({
      status: "successful",
      message: "You are authorized",
    });
  }
  return res.status(401).setHeader("Set-Cookie", emptyCookie).json({
    status: "failure",
    message: keyResult.message,
  });
}
export default handler;
