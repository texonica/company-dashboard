# AITable Dashboard

A modern dashboard application for interacting with AITable.ai data. This application allows you to:

- View and manage AITable spaces, nodes, and datasheets
- Search for nodes across your AITable spaces
- View, create, update, and delete records in datasheets
- Manage links between tables

## Features

- **Dashboard Overview**: Get a quick overview of your AITable spaces and datasheets
- **Datasheet Management**: View and interact with your datasheets
- **Search**: Search for nodes across your AITable spaces
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm or yarn
- AITable API token

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/aitable-dashboard.git
cd aitable-dashboard
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with your AITable API token:

```
AITABLE_API_TOKEN=your_api_token_here
NEXT_PUBLIC_AITABLE_DEFAULT_SPACE_ID=your_default_space_id_here
```

> **Note:** The `.env.local` file is automatically excluded from git commits for security reasons. Never commit your API tokens or other sensitive information to version control.

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/app`: Next.js app router pages and layouts
  - `/api`: Server-side API routes
  - `/components`: React components
  - `/lib`: Utility functions and services
- `/lib`: Utility functions, API clients, and services
  - `/api`: API clients for external services
  - `/contexts`: React contexts for state management
  - `/services`: Service layer for business logic
- `/docs`: Documentation files
  - `/api`: API documentation

## Environment Variables

The application uses the following environment variables:

| Variable | Description | Required | Access |
|----------|-------------|----------|---------|
| `AITABLE_API_TOKEN` | Your AITable API token | Yes | Server-side only |
| `NEXT_PUBLIC_AITABLE_DEFAULT_SPACE_ID` | Default space ID to use | No | Client & Server |

For development, you can set these in a `.env.local` file. For production, set them according to your hosting provider's instructions.

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Axios](https://axios-http.com/) - HTTP client

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [AITable.ai](https://aitable.ai) - For providing the API
- [Next.js](https://nextjs.org/) - For the amazing React framework
