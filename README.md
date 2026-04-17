# Website Screenshot — OpenClaw Plugin

Capture website screenshots as PNG images using the [PDFAPIHub](https://pdfapihub.com) API. This OpenClaw plugin gives your AI agent the ability to screenshot any website with desktop, mobile, and tablet viewports.

## What It Does

Take pixel-perfect screenshots of any website URL — desktop, mobile, or tablet — with full control over viewport, quality, page loading, and cookie consent handling.

### Features

- **Desktop Screenshots** — 1920x1080 viewport with networkidle wait
- **Mobile Screenshots** — iPhone (375x812 @2x), Android (412x915 @2.6x), iPad (820x1180 @2x) presets
- **Full-Page Capture** — Screenshot the entire scrollable page, not just the viewport
- **Retina Quality** — 2x/3x device scale factor for crisp, high-DPI output
- **Cookie Consent** — Auto-click cookie banners before capturing
- **Wait Strategies** — Wait for `load`, `domcontentloaded`, `networkidle`, or `commit`
- **Extra Delay** — Wait for lazy-loaded content, animations, or delayed rendering
- **Image Compression** — Compress captured screenshots to reduce file size
- **Multiple Output Formats** — Download URL, base64 string, or raw PNG file

## Tools

| Tool | Description |
|------|-------------|
| `screenshot_website` | Full-featured screenshot with custom viewport, retina, full-page, cookie consent |
| `screenshot_mobile` | Mobile screenshot with device presets (iPhone, Android, iPad) |
| `screenshot_desktop` | Quick desktop screenshot at 1920x1080 |
| `compress_screenshot` | Compress a captured screenshot to reduce file size |

## Installation

```bash
openclaw plugins install clawhub:pdf-api-screenshot
```

## Configuration

Add your API key in `~/.openclaw/openclaw.json`:

```json
{
  "plugins": {
    "entries": {
      "pdf-api-screenshot": {
        "enabled": true,
        "env": {
          "PDFAPIHUB_API_KEY": "your-api-key-here"
        }
      }
    }
  }
}
```

Get your **free API key** at [https://pdfapihub.com](https://pdfapihub.com).

## Usage Examples

Just ask your OpenClaw agent:

- *"Take a screenshot of https://github.com"*
- *"Capture a full-page screenshot of https://news.ycombinator.com"*
- *"Take a mobile iPhone screenshot of https://example.com"*
- *"Screenshot this website at 2x retina quality"*
- *"Screenshot https://example.eu and click 'Accept All Cookies' first"*

## Use Cases

- **Website Monitoring** — Capture periodic screenshots to track visual changes
- **QA Testing** — Screenshot pages across desktop/mobile/tablet for cross-device testing
- **Client Reporting** — Capture website screenshots for status reports and presentations
- **Social Media Previews** — Generate preview images of web pages for sharing
- **Competitor Analysis** — Screenshot competitor websites for design comparison
- **Bug Documentation** — Capture screenshots to document visual bugs

## API Documentation

Full API docs: [https://pdfapihub.com/docs](https://pdfapihub.com/docs)

## License

MIT
