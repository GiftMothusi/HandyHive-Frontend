# HandyHive Frontend

## Overview
HandyHive's frontend application is built with Next.js 14, TypeScript, and Tailwind CSS. It serves as the client-side interface for connecting South African households with verified domestic service providers.

## Tech Stack
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- React Query
- NextAuth.js
- Pusher.js
- Google Maps React
- React Hook Form with Zod
- Jest & React Testing Library

## Prerequisites
- Node.js 20.x or higher
- npm 9.x or higher
- Git

## Installation

1. Clone the repository:
```bash
git clone git@github.com:your-organization/handyhive-frontend.git
cd handyhive-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Update the `.env.local` file with your configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_PUSHER_APP_KEY=your_pusher_key
NEXT_PUBLIC_PUSHER_CLUSTER=mt1
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run type-check` - Run TypeScript type checking

## Testing
We maintain a minimum of 85% test coverage. Run tests with:
```bash
npm run test
```

Generate coverage report:
```bash
npm run test:coverage
```

## Code Quality
We follow the Airbnb JavaScript Style Guide. Ensure your code passes all checks:
```bash
npm run lint
npm run type-check
```

## Project Structure
```
src/
├── app/               # App router pages and layouts
├── components/        # Reusable React components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions and configurations
├── services/         # API service functions
├── store/            # Global state management
├── styles/           # Global styles and Tailwind configuration
├── types/            # TypeScript type definitions
└── utils/            # Helper functions
```

## Deployment
The application is configured for deployment on Vercel:
1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy

## Performance Requirements
- Page load time: < 2 seconds
- Time to Interactive: < 3 seconds
- First Contentful Paint: < 1.5 seconds

## Contributing
1. Create a feature branch from `develop`:
```bash
git checkout -b feature/your-feature-name
```

2. Commit your changes:
```bash
git commit -m "feat: add your feature"
```

3. Push to your branch:
```bash
git push origin feature/your-feature-name
```

4. Create a Pull Request to `develop`

### Branch Naming Convention
- Feature: `feature/descriptive-name`
- Bugfix: `bugfix/descriptive-name`
- Hotfix: `hotfix/descriptive-name`

### Commit Message Convention
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes
- refactor: Code refactoring
- test: Test changes
- chore: Build process or auxiliary tool changes

## Documentation
- [Component Documentation](./docs/components.md)
- [API Integration Guide](./docs/api.md)
- [State Management Guide](./docs/state.md)
- [Testing Guide](./docs/testing.md)

## Support
For support, contact the development team at [dev@handyhive.co.za](mailto:dev@handyhive.co.za)

## License
[MIT License](./LICENSE)
