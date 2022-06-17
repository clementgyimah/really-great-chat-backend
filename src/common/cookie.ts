export const cookieProps = Object.freeze({
    key: "ReallyGreatChat",
    secret: process.env.COOKIE_SECRET,
    options: {
      httpOnly: true,
      signed: true,
      path: process.env.COOKIE_PATH,
      maxAge: Number(process.env.COOKIE_EXP),
      domain: process.env.COOKIE_DOMAIN,
      secure: process.env.SECURE_COOKIE === "true",
    },
  });
  