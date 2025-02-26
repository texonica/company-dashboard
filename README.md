# Company Dashboard

A modern dashboard application for interacting with AITable.ai data.

## Project Structure

- `/app-src`: The Next.js application
- `/docs`: Documentation files
  - `/api`: API documentation for AITable.ai

## Getting Started

1. Navigate to the app-src directory:

```bash
cd app-src
```

2. Follow the instructions in the app-src/README.md file to set up and run the application.

## Environment Variables

The application requires environment variables for API authentication. Create a `.env.local` file in the `app-src` directory with the following variables:

```
NEXT_PUBLIC_AITABLE_API_TOKEN=your_api_token_here
NEXT_PUBLIC_AITABLE_DEFAULT_SPACE_ID=your_default_space_id_here
```

> **Security Note:** The `.env.local` file is automatically excluded from git commits. Never commit your API tokens or other sensitive information to version control.

## Documentation

The `/docs` directory contains documentation for the AITable.ai API, which is used by the dashboard application. This documentation is also accessible from within the application. 