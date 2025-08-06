# Getting Started with Hilmi Storefront

## Initial Setup

### 1. Environment Configuration

Copy the environment template and configure your settings:

```bash
cp .env.example .env.local
```

### 2. Database Setup

The Medusa backend requires PostgreSQL and Redis:

```bash
# Install PostgreSQL (macOS with Homebrew)
brew install postgresql redis

# Start services
brew services start postgresql
brew services start redis

# Create database
createdb medusa_store
```

### 3. Install Dependencies

From the root directory:

```bash
yarn install:all
```

Or install individually:

```bash
# Root dependencies
yarn install

# Backend dependencies
cd backend && yarn install

# Storefront dependencies
cd storefront && yarn install
```

### 4. Backend Setup

Configure your Medusa backend:

```bash
cd backend

# Run migrations
yarn medusa migrations run

# Create admin user
yarn medusa user -e admin@example.com -p password

# Seed with sample data (optional)
yarn seed
```

### 5. Start Development Servers

Start both backend and storefront:

```bash
# From root directory
yarn dev
```

Or start individually:

```bash
# Backend (port 9000)
yarn dev:backend

# Storefront (port 3000) 
yarn dev:storefront
```

## Access Points

- **Storefront**: http://localhost:3000
- **Medusa Backend**: http://localhost:9000
- **Admin Dashboard**: http://localhost:9000/app

## Next Steps

1. Configure Stripe keys in your environment
2. Set up product catalog with customizable products
3. Implement custom design areas for products
4. Configure Fabric.js canvas components
5. Test the full checkout flow

## Development Workflow

1. **Backend Changes**: Modify files in `/backend/src/`
2. **Storefront Changes**: Modify files in `/storefront/src/`
3. **Shared Types**: Update `/shared/types.ts`
4. **Testing**: Run `yarn test` to ensure everything works

## Common Issues

### Database Connection
- Ensure PostgreSQL is running
- Check DATABASE_URL in your .env file
- Run migrations if needed

### Redis Connection
- Ensure Redis is running on port 6379
- Check REDIS_URL in your .env file

### Port Conflicts
- Backend runs on port 9000
- Storefront runs on port 3000
- Admin runs on port 7001 (if separate)

## Production Deployment

See [deployment.md](./deployment.md) for production setup instructions.