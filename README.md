# Production GitHub Portfolio (SpyderDave)

## Features
- No runtime API calls
- Uses GitHub Actions to refresh data hourly
- Fast + reliable GitHub Pages site

## Setup
1. Create repo: SpyderDave.github.io
2. Upload all files
3. Enable GitHub Pages (main / root)
4. Ensure Actions are enabled

## How it works
- GitHub Actions pulls repo list → saves to repos.json
- Website reads repos.json (no API limits)

## Manual refresh
Go to Actions → "Update Repo List" → Run workflow
