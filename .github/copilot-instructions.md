# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Nuxt.js ranking website that displays cryptocurrency wallet address rankings based on daily API data.

## Key Features
- Daily API data fetching to obtain JSON files (yyyymmdd.json format)
- Ranking display showing address amounts in descending order
- Comparison with previous day rankings showing movement (↑3, ↓4, etc.)
- GitHub Pages deployment for free hosting

## Technical Stack
- Nuxt.js 4 with TypeScript
- GitHub Actions for daily API calls and data collection
- Static site generation for GitHub Pages hosting
- JSON data storage in git repository

## Project Structure
- `/data/` - Daily JSON files storage
- `/pages/` - Nuxt pages
- `/components/` - Vue components for ranking display
- `/.github/workflows/` - GitHub Actions for automated data fetching
- `/utils/` - Utility functions for data processing and ranking calculations

## Development Guidelines
- Use TypeScript for all new files
- Follow Vue.js composition API patterns
- Implement responsive design for mobile compatibility
- Keep data processing logic in utility functions
- Use semantic commit messages
