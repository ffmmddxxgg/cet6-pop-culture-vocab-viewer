import React from "react";
import "./styles.css";

function renderFatalError(error: unknown) {
  const root = document.getElementById("root");
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : "";

  if (!root) return;
  root.innerHTML = `
    <main style="min-height:100vh;padding:32px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f8fafc;color:#0f172a;">
      <section style="max-width:860px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;background:white;padding:24px;box-shadow:0 20px 60px rgba(15,23,42,.12);">
        <p style="margin:0 0 8px;font-size:12px;font-weight:800;text-transform:uppercase;color:#0891b2;">CET-6 Card Viewer</p>
        <h1 style="margin:0 0 12px;font-size:28px;line-height:1.2;">页面加载失败</h1>
        <p style="margin:0 0 16px;color:#475569;line-height:1.7;">前端已经启动，但 React 应用加载时遇到错误。请把下面的错误信息发给维护者，或先确认你已经下载了最新仓库并重新运行 <code>start-windows.bat</code>。</p>
        <pre style="white-space:pre-wrap;overflow:auto;border-radius:10px;background:#0f172a;color:#e2e8f0;padding:16px;font-size:13px;line-height:1.5;">${escapeHtml(message)}\n\n${escapeHtml(stack ?? "")}</pre>
      </section>
    </main>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

window.addEventListener("error", (event) => renderFatalError(event.error ?? event.message));
window.addEventListener("unhandledrejection", (event) => renderFatalError(event.reason));

try {
  const [{ default: App }, ReactDOMClient] = await Promise.all([import("./App"), import("react-dom/client")]);
  const root = document.getElementById("root");
  if (!root) throw new Error("Missing #root element in index.html");

  ReactDOMClient.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} catch (error) {
  renderFatalError(error);
}
