# Test Structure

This directory follows React testing best practices:

## Directory Structure

```
src/__tests__/
├── components/           # Component tests mirroring src/components structure
├── __mocks__/           # Manual mocks for external dependencies
├── utils/               # Test utilities and helpers
├── setup/               # Test setup and configuration
└── README.md           # This file
```

## Guidelines

- **Component Tests**: Mirror the `src/components` directory structure
- **Mocks**: Place manual mocks in `__mocks__` directory
- **Utilities**: Shared test helpers and mock data in `utils`
- **Setup**: Test configuration and global setup in `setup`

## Naming Conventions

- Test files: `ComponentName.test.js`
- Mock files: `moduleName.js` (in `__mocks__`)
- Utilities: `descriptiveName.js`