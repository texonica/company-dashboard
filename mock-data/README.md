# Mock AITable API Data

This directory contains mock data for testing the application when the AITable API
is not accessible or when testing without a valid token.

## How to Use

1. In your `.env.local` file, add the following:

```
USE_MOCK_DATA=true
```

2. Update your AITable API client to use this mock data when the environment variable is set.
