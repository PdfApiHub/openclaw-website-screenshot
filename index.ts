import type { PluginEntry } from "@anthropic/openclaw-plugin-sdk";

const API_BASE = "https://pdfapihub.com/api";

async function callApi(
  endpoint: string,
  body: Record<string, unknown>,
  apiKey: string
): Promise<unknown> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "CLIENT-API-KEY": apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error(`PDFAPIHub API error (${res.status}): ${text}`);
    }
    throw new Error(
      `PDFAPIHub API error (${res.status}): ${(parsed as any).error || text}`
    );
  }

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }
  return {
    success: true,
    message: "Binary file returned",
    content_type: contentType,
  };
}

function getApiKey(config: Record<string, unknown>): string {
  const key =
    (config.apiKey as string) ||
    process.env.PDFAPIHUB_API_KEY ||
    process.env.CLIENT_API_KEY ||
    "";
  if (!key) {
    throw new Error(
      "PDFAPIHub API key not configured. Set it in plugin config, or as PDFAPIHUB_API_KEY environment variable. Get a free key at https://pdfapihub.com"
    );
  }
  return key;
}

function buildBody(params: Record<string, unknown>): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      body[key] = value;
    }
  }
  return body;
}

const plugin: PluginEntry = {
  id: "website-screenshot",
  name: "Website Screenshot",
  register(api) {
    // ─── Screenshot Website ──────────────────────────────────
    api.registerTool({
      name: "screenshot_website",
      description:
        "Capture a screenshot of any website URL as a PNG image. Supports custom viewport dimensions, full-page scrollable screenshots, retina quality (2x/3x deviceScaleFactor), cookie consent auto-click, wait strategies for JS-rendered pages (networkidle, domcontentloaded), extra delay for lazy-loaded content, and custom User-Agent. Returns a download URL or base64.",
      parameters: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "URL of the website to screenshot.",
          },
          output_format: {
            type: "string",
            enum: ["url", "base64", "both", "image", "png", "file"],
            description:
              "Output format. 'url' returns a download URL (default), 'base64' returns base64 PNG, 'both' returns both.",
          },
          viewPortWidth: {
            type: "number",
            description: "Viewport width in pixels. Default: 1920.",
          },
          viewPortHeight: {
            type: "number",
            description: "Viewport height in pixels. Default: 1080.",
          },
          deviceScaleFactor: {
            type: "number",
            description:
              "Device pixel ratio (1-3). Use 2 for retina quality. Default: 1.",
          },
          quality: {
            type: "number",
            description: "Image quality (30-100). Default: 80.",
          },
          full_page: {
            type: "boolean",
            description:
              "Capture the full scrollable page instead of just the viewport. Default: false.",
          },
          wait_until: {
            type: "string",
            enum: ["load", "domcontentloaded", "networkidle", "commit"],
            description:
              "When to consider the page loaded. 'networkidle' waits for all network activity to settle. Default: 'load'.",
          },
          wait_for_timeout: {
            type: "number",
            description:
              "Extra delay in ms after page load before capturing. Useful for lazy-loaded content, animations, or delayed rendering.",
          },
          cookie_accept_text: {
            type: "string",
            description:
              "Text of the cookie consent button to auto-click before capturing. E.g. 'Accept All Cookies', 'I Agree'. Best-effort; proceeds normally if no button is found.",
          },
          output_filename: {
            type: "string",
            description: "Custom filename for the screenshot.",
          },
        },
        required: ["url"],
      },
      async execute(params, context) {
        const apiKey = getApiKey(context.config);
        const body = buildBody(params);
        // Default to desktop viewport if not specified
        if (!body.viewPortWidth) body.viewPortWidth = 1920;
        if (!body.viewPortHeight) body.viewPortHeight = 1080;
        return callApi("/v1/generateImage", body, apiKey);
      },
    });

    // ─── Screenshot Mobile ───────────────────────────────────
    api.registerTool({
      name: "screenshot_mobile",
      description:
        "Capture a mobile screenshot of a website. Uses iPhone viewport (375x812) with 2x retina quality by default. Supports full-page capture, cookie consent, and wait strategies.",
      parameters: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "URL of the website to screenshot.",
          },
          output_format: {
            type: "string",
            enum: ["url", "base64", "both"],
            description: "Output format. Default: 'url'.",
          },
          full_page: {
            type: "boolean",
            description: "Capture full scrollable page. Default: false.",
          },
          wait_until: {
            type: "string",
            enum: ["load", "domcontentloaded", "networkidle", "commit"],
            description: "Page load strategy. Default: 'load'.",
          },
          wait_for_timeout: {
            type: "number",
            description: "Extra delay in ms after page load.",
          },
          cookie_accept_text: {
            type: "string",
            description: "Cookie consent button text to auto-click.",
          },
          device: {
            type: "string",
            enum: ["iphone", "android", "ipad"],
            description:
              "Device preset. 'iphone' = 375x812 @2x (default), 'android' = 412x915 @2.6x, 'ipad' = 820x1180 @2x.",
          },
        },
        required: ["url"],
      },
      async execute(params, context) {
        const apiKey = getApiKey(context.config);
        const { device, ...rest } = params;

        const presets: Record<
          string,
          {
            w: number;
            h: number;
            scale: number;
            ua: string;
          }
        > = {
          iphone: {
            w: 375,
            h: 812,
            scale: 2,
            ua: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
          },
          android: {
            w: 412,
            h: 915,
            scale: 2.6,
            ua: "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
          },
          ipad: {
            w: 820,
            h: 1180,
            scale: 2,
            ua: "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
          },
        };

        const preset = presets[(device as string) || "iphone"];
        const body: Record<string, unknown> = {
          ...buildBody(rest),
          viewPortWidth: preset.w,
          viewPortHeight: preset.h,
          deviceScaleFactor: preset.scale,
        };

        return callApi("/v1/generateImage", body, apiKey);
      },
    });

    // ─── Screenshot Desktop ──────────────────────────────────
    api.registerTool({
      name: "screenshot_desktop",
      description:
        "Capture a standard desktop screenshot of a website at 1920x1080. Quick shortcut with sensible defaults — just pass the URL.",
      parameters: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description: "URL of the website to screenshot.",
          },
          output_format: {
            type: "string",
            enum: ["url", "base64", "both"],
            description: "Output format. Default: 'url'.",
          },
          full_page: {
            type: "boolean",
            description: "Capture full scrollable page. Default: false.",
          },
          wait_until: {
            type: "string",
            enum: ["load", "domcontentloaded", "networkidle", "commit"],
            description: "Page load strategy. Default: 'networkidle'.",
          },
          cookie_accept_text: {
            type: "string",
            description: "Cookie consent button text to auto-click.",
          },
        },
        required: ["url"],
      },
      async execute(params, context) {
        const apiKey = getApiKey(context.config);
        const body: Record<string, unknown> = {
          ...buildBody(params),
          viewPortWidth: 1920,
          viewPortHeight: 1080,
        };
        if (!body.wait_until) body.wait_until = "networkidle";
        return callApi("/v1/generateImage", body, apiKey);
      },
    });

    // ─── Compress Screenshot ─────────────────────────────────
    api.registerTool({
      name: "compress_screenshot",
      description:
        "Compress a screenshot or image to JPEG with configurable quality. Returns compression statistics: original size, compressed size, and reduction percentage.",
      parameters: {
        type: "object",
        properties: {
          image_url: {
            type: "string",
            description: "URL of the image to compress (e.g. a screenshot URL).",
          },
          base64_image: {
            type: "string",
            description: "Base64-encoded image to compress.",
          },
          quality: {
            type: "number",
            description:
              "Compression quality (1-100). Higher = better quality. Default: 85.",
          },
          output_format: {
            type: "string",
            enum: ["url", "base64"],
            description: "Output format. Default: 'url'.",
          },
        },
      },
      async execute(params, context) {
        const apiKey = getApiKey(context.config);
        return callApi("/v1/compress", buildBody(params), apiKey);
      },
    });
  },
};

export default plugin;
