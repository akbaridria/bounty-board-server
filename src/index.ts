import { Hono } from "hono";
import { cors } from 'hono/cors';
import { getFile, uploadFile } from "./pinata";

interface Bindings {
  PINATA_GATEWAY: string;
  PINATA_JWT: string;
}

const app = new Hono<{ Bindings: Bindings }>();

// Add CORS middleware
app.use('/*', cors({
  origin: '*', // In production, you might want to restrict this to specific domains
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
  maxAge: 600,
  credentials: true,
}));

app.post("/upload", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return c.json({ error: "No file provided" }, 400);
    }

    const upload = await uploadFile(file, c.env.PINATA_JWT, c.env.PINATA_GATEWAY);

    return c.json({
      success: true,
      data: upload,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return c.json({ error: "Failed to upload file" }, 500);
  }
});

app.get("/files/:cid", async (c) => {
  const { cid } = c.req.param();
  const file = await getFile(cid, c.env.PINATA_JWT, c.env.PINATA_GATEWAY);
  if (file.data) {
    return c.json(file);
  }

  return c.json(
    {
      error: "File not found",
    },
    404
  );
});

export default app;
