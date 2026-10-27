export const GENERIC_500 = "Something went wrong. Please try again.";

export const hide500Details = (req, res, next) => {
  const json = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode === 500 && body && typeof body === "object" && !Array.isArray(body)) {
      const leaked = typeof body.message === "string" ? body.message : typeof body.error === "string" ? body.error : null;
      if (leaked !== null) {
        console.error(`[500] ${req.method} ${req.originalUrl}: ${leaked}`);
        body = { ...body, ...(typeof body.message === "string" ? { message: GENERIC_500 } : {}), ...(typeof body.error === "string" ? { error: GENERIC_500 } : {}) };
        delete body.stack;
      }
    }
    return json(body);
  };
  next();
};