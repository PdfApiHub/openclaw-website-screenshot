---
name: website-screenshot
description: "Capture website screenshots as PNG images. Supports full-page scrolling, desktop/mobile/tablet viewports, retina quality, cookie consent auto-click, and wait strategies for JS-rendered pages. Powered by PDFAPIHub."
---

# Website Screenshot

Capture screenshots of any website as PNG images with full control over viewport, quality, and page loading.

## Tools

| Tool | Description |
|------|-------------|
| `screenshot_website` | Full-featured screenshot with custom viewport, retina, full-page, cookie consent |
| `screenshot_mobile` | Mobile screenshot with device presets (iPhone, Android, iPad) |
| `screenshot_desktop` | Quick desktop screenshot at 1920x1080 with networkidle |
| `compress_screenshot` | Compress a captured screenshot to reduce file size |

## Setup

Get your **free API key** at [https://pdfapihub.com](https://pdfapihub.com).

Configure in `~/.openclaw/openclaw.json`:

```json
{
  "plugins": {
    "entries": {
      "website-screenshot": {
        "enabled": true,
        "env": {
          "PDFAPIHUB_API_KEY": "your-api-key-here"
        }
      }
    }
  }
}
```

Or set the environment variable in config: `"env": { "PDFAPIHUB_API_KEY": "your-key" }`

## Usage Examples

**Desktop screenshot:**
> Take a screenshot of https://github.com

**Full-page screenshot:**
> Capture a full-page scrollable screenshot of https://news.ycombinator.com

**Mobile screenshot:**
> Take a mobile iPhone screenshot of https://example.com

**Retina quality:**
> Screenshot https://example.com at 2x retina quality

**With cookie consent:**
> Screenshot https://example.eu and auto-click "Accept All Cookies"

**Compress a screenshot:**
> Compress this screenshot to 75% quality: https://cdn.pdfapihub.com/png/abc123.png

## Documentation

Full API docs: [https://pdfapihub.com/docs](https://pdfapihub.com/docs)
