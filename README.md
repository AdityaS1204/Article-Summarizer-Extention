# AI Article Summarizer - Chrome Extension

A lightweight Chrome extension that uses Google's Gemini AI to instantly summarize articles and web content with one click.

## What It Does

Automatically extracts and summarizes article text from any webpage using Google's Gemini AI. No more reading long articles—get the key points in seconds!

## Requirements

- Google Chrome browser
- Free Google Gemini API key

## Quick Setup

### 1. Clone/Download the Extension
**Option A: Using Git**
```bash
git clone https://github.com/yourusername/summarizer-extension.git
cd summarizer-extension
```

**Option B: Download as ZIP**
- Download the repository as ZIP file
- Extract/unzip the file to your desired location
- Navigate to the extracted folder

### 2. Get Gemini API Key
- Visit [Google AI Studio](https://aistudio.google.com/api-keys)
- Click **"Create API key"** and copy it

### 3. Load Extension in Chrome
- Open Chrome and navigate to `chrome://extensions/`
- Enable **"Developer mode"** (top right toggle)
- Click **"Load unpacked"**
- Select the `summarizer-extension` folder from your computer
- The extension will appear in your toolbar

### 4. Add API Key
- Click the extension icon → Settings icon (gear)
- Paste your Gemini API key
- Click **"Save"**

## Usage

1. Go to any article or webpage
2. Click the extension icon
3. Select summary type from dropdown
4. Click **"Summarize"**
5. View your summary instantly

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Please add your API key" | Go to settings and add your Gemini API key |
| "Cannot access this page" | Try refreshing the page |
| "No article text found" | The page may not contain readable article content |
| "Failed to generate summary" | Check if your API key is valid and has quota remaining |

## Files

- `manifest.json` - Extension configuration
- `popup.html/js` - Main UI and summarization logic
- `content.js` - Extracts article text from webpages
- `background.js` - Extension background service worker
- `options.html/js` - API key settings page
