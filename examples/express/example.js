// Example: Redact data before sending externally
// This is a usage pattern, not an official SDK
import express from "express";
import { redactMiddleware } from "./redact-middleware.js";

const app = express();

app.use(express.json());
app.use(redactMiddleware());

app.post("/test", (req, res) => {
  res.json(req.body);
});

app.listen(3000);
