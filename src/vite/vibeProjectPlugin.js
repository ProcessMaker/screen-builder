import fs from "fs";
import path from "path";
import { resolve } from "path";
import { loadEnv } from "vite";
import { getAiPublicConfig, runVibeAiChat } from "./vibeAiHandler.js";

const PROJECT_DIR = "src/vibe-project";

function resolveSafePath(rootDir, relativePath) {
  const normalized = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, "");
  const fullPath = resolve(rootDir, PROJECT_DIR, normalized);
  const projectRoot = resolve(rootDir, PROJECT_DIR);

  if (!fullPath.startsWith(projectRoot)) {
    throw new Error("Invalid path");
  }

  return { fullPath, relativePath: normalized };
}

function buildTree(dirPath, relativeBase = "") {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const nodes = entries
    .filter((entry) => !entry.name.startsWith("."))
    .map((entry) => {
      const relPath = relativeBase ? `${relativeBase}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        return {
          name: entry.name,
          path: relPath,
          type: "directory",
          children: buildTree(path.join(dirPath, entry.name), relPath),
        };
      }
      return {
        name: entry.name,
        path: relPath,
        type: "file",
      };
    })
    .sort((a, b) => {
      if (a.type !== b.type) {
        return a.type === "directory" ? -1 : 1;
      }
      return a.name.localeCompare(b.name);
    });

  return nodes;
}

function readBody(req) {
  return new Promise((resolvePromise, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolvePromise(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

export default function vibeProjectPlugin() {
  const rootDir = process.cwd();
  const env = loadEnv("development", rootDir, "");

  return {
    name: "vibe-project-plugin",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split("?")[0];

        try {
          if (url === "/api/vibe-project/ai/config" && req.method === "GET") {
            sendJson(res, 200, getAiPublicConfig(env));
            return;
          }

          if (url === "/api/vibe-project/ai/chat" && req.method === "POST") {
            const body = JSON.parse((await readBody(req)).toString());
            const result = await runVibeAiChat(body, env);
            sendJson(res, 200, result);
            return;
          }

          if (url === "/api/vibe-project/tree" && req.method === "GET") {
            const projectPath = resolve(rootDir, PROJECT_DIR);
            if (!fs.existsSync(projectPath)) {
              fs.mkdirSync(projectPath, { recursive: true });
            }
            sendJson(res, 200, { tree: buildTree(projectPath) });
            return;
          }

          if (url === "/api/vibe-project/file" && req.method === "GET") {
            const params = new URL(req.url, "http://localhost").searchParams;
            const filePath = params.get("path");
            if (!filePath) {
              sendJson(res, 400, { error: "path is required" });
              return;
            }
            const { fullPath } = resolveSafePath(rootDir, filePath);
            if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
              sendJson(res, 404, { error: "File not found" });
              return;
            }
            sendJson(res, 200, {
              path: filePath,
              content: fs.readFileSync(fullPath, "utf-8"),
            });
            return;
          }

          if (url === "/api/vibe-project/file" && req.method === "PUT") {
            const body = await readBody(req);
            const { path: filePath, content } = JSON.parse(body.toString());
            if (!filePath) {
              sendJson(res, 400, { error: "path is required" });
              return;
            }
            const { fullPath } = resolveSafePath(rootDir, filePath);
            fs.mkdirSync(path.dirname(fullPath), { recursive: true });
            fs.writeFileSync(fullPath, content ?? "", "utf-8");
            sendJson(res, 200, { path: filePath, saved: true });
            return;
          }

          if (url === "/api/vibe-project/mkdir" && req.method === "POST") {
            const body = await readBody(req);
            const { path: dirPath } = JSON.parse(body.toString());
            if (!dirPath) {
              sendJson(res, 400, { error: "path is required" });
              return;
            }
            const { fullPath } = resolveSafePath(rootDir, dirPath);
            fs.mkdirSync(fullPath, { recursive: true });
            sendJson(res, 200, { path: dirPath, created: true });
            return;
          }

          if (url === "/api/vibe-project/file" && req.method === "DELETE") {
            const params = new URL(req.url, "http://localhost").searchParams;
            const filePath = params.get("path");
            if (!filePath) {
              sendJson(res, 400, { error: "path is required" });
              return;
            }
            const { fullPath } = resolveSafePath(rootDir, filePath);
            if (!fs.existsSync(fullPath)) {
              sendJson(res, 404, { error: "Not found" });
              return;
            }
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
              fs.rmSync(fullPath, { recursive: true });
            } else {
              fs.unlinkSync(fullPath);
            }
            sendJson(res, 200, { path: filePath, deleted: true });
            return;
          }

          if (url === "/api/vibe-project/move" && req.method === "POST") {
            const body = JSON.parse((await readBody(req)).toString());
            const { from, to } = body;
            if (!from || !to) {
              sendJson(res, 400, { error: "from and to are required" });
              return;
            }
            const source = resolveSafePath(rootDir, from);
            const destination = resolveSafePath(rootDir, to);
            if (!fs.existsSync(source.fullPath)) {
              sendJson(res, 404, { error: `Not found: ${from}` });
              return;
            }
            if (fs.existsSync(destination.fullPath)) {
              sendJson(res, 409, { error: `Already exists: ${to}` });
              return;
            }
            fs.mkdirSync(path.dirname(destination.fullPath), { recursive: true });
            fs.renameSync(source.fullPath, destination.fullPath);
            sendJson(res, 200, { from, to, moved: true });
            return;
          }

          if (url === "/api/vibe-project/duplicate" && req.method === "POST") {
            const body = JSON.parse((await readBody(req)).toString());
            const { path: sourcePath, to } = body;
            if (!sourcePath) {
              sendJson(res, 400, { error: "path is required" });
              return;
            }
            const source = resolveSafePath(rootDir, sourcePath);
            if (!fs.existsSync(source.fullPath)) {
              sendJson(res, 404, { error: `Not found: ${sourcePath}` });
              return;
            }

            let targetRelative = to;
            if (!targetRelative) {
              const parts = source.relativePath.split("/");
              const fileName = parts.pop();
              const dot = fileName.lastIndexOf(".");
              const base = dot === -1 ? fileName : fileName.slice(0, dot);
              const ext = dot === -1 ? "" : fileName.slice(dot);
              targetRelative = [...parts, `${base}Copy${ext}`].join("/");
            }

            const destination = resolveSafePath(rootDir, targetRelative);
            if (fs.existsSync(destination.fullPath)) {
              sendJson(res, 409, { error: `Already exists: ${targetRelative}` });
              return;
            }

            const stat = fs.statSync(source.fullPath);
            if (stat.isDirectory()) {
              const copyRecursive = (src, dest) => {
                fs.mkdirSync(dest, { recursive: true });
                fs.readdirSync(src, { withFileTypes: true }).forEach((entry) => {
                  const srcPath = path.join(src, entry.name);
                  const destPath = path.join(dest, entry.name);
                  if (entry.isDirectory()) {
                    copyRecursive(srcPath, destPath);
                  } else {
                    fs.copyFileSync(srcPath, destPath);
                  }
                });
              };
              copyRecursive(source.fullPath, destination.fullPath);
            } else {
              fs.mkdirSync(path.dirname(destination.fullPath), { recursive: true });
              fs.copyFileSync(source.fullPath, destination.fullPath);
            }

            sendJson(res, 200, {
              from: sourcePath,
              path: destination.relativePath,
              duplicated: true,
            });
            return;
          }

          if (url === "/api/vibe-project/import" && req.method === "POST") {
            const body = await readBody(req);
            const { files } = JSON.parse(body.toString());
            if (!files || !Array.isArray(files)) {
              sendJson(res, 400, { error: "files array is required" });
              return;
            }
            files.forEach(({ path: filePath, content }) => {
              const { fullPath } = resolveSafePath(rootDir, filePath);
              fs.mkdirSync(path.dirname(fullPath), { recursive: true });
              fs.writeFileSync(fullPath, content ?? "", "utf-8");
            });
            sendJson(res, 200, { imported: files.length });
            return;
          }

          if (url === "/api/vibe-project/export" && req.method === "GET") {
            const projectPath = resolve(rootDir, PROJECT_DIR);
            const files = [];

            function walk(dir, relBase = "") {
              if (!fs.existsSync(dir)) return;
              fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
                const relPath = relBase ? `${relBase}/${entry.name}` : entry.name;
                const full = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                  walk(full, relPath);
                } else {
                  files.push({
                    path: relPath,
                    content: fs.readFileSync(full, "utf-8"),
                  });
                }
              });
            }

            walk(projectPath);
            sendJson(res, 200, { files });
            return;
          }
        } catch (err) {
          sendJson(res, 500, { error: err.message });
          return;
        }

        next();
      });
    },
  };
}
