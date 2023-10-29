## Description

Authentication service repository for megrulad.ge.

## Installation

```bash
# Install required Node version
nvm i
# Use required Node version
nvm use
# Install required dependencies
npm install
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

### Database


Generate migrations from entities

```bash
# Requires `npm build` but prebuild hook should take care of it
npm run migration:generate migrations/<migration-name>
```

Run migrations

```bash
# This will run all pending migrations
npm run migtrations
```

Revert migration

```bash
# This will revert the last migration only
# To revert all migrations, run this command multiple times
npm run migration:revert
```

Show migration status

```bash
# This will show the status of migrations
npm run migration:show
```

### Asymmetric key pairs

Generate keys

```bash
# This will generate a key pair in `.keys` directory
# It will skip the process if the keys already exist
npm run gen:key-pairs

# This will generate and replace the key pair in `.keys` directory if it already exists
npm run re-gen:key-pairs
```
