# Hilmi Storefront - Custom Ecommerce Platform

A modern ecommerce storefront built with Medusa.js, Next.js, and Fabric.js for customizable product design.

## 🚀 Features

- **Medusa.js Backend**: Powerful headless commerce engine
- **Next.js Storefront**: Fast, SEO-optimized frontend
- **Product Customization**: Real-time design tools using Fabric.js
- **Stripe Integration**: Secure payment processing
- **Customizable Products**: Apparel, accessories, and more
- **Responsive Design**: Mobile-first approach

## 📁 Project Structure

```
├── backend/          # Medusa.js backend application
├── storefront/       # Next.js storefront application
├── shared/           # Shared types and utilities
├── docs/             # Documentation
└── .env.example      # Environment variables template
```

## 🛠️ Tech Stack

### Backend
- **Medusa.js** - Headless commerce platform
- **Node.js** - Runtime environment
- **PostgreSQL** - Primary database
- **Redis** - Sessions and caching

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Fabric.js** - Canvas-based product customization

### Payments
- **Stripe** - Payment processing and checkout

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL
- Redis
- Yarn or npm

### Installation

1. **Clone and setup environment**
   ```bash
   cp .env.example .env.local
   # Fill in your environment variables
   ```

2. **Start the backend**
   ```bash
   cd backend
   yarn install
   yarn dev
   ```

3. **Start the storefront**
   ```bash
   cd storefront
   yarn install
   yarn dev
   ```

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

- **Database**: PostgreSQL connection string
- **Redis**: Redis URL for sessions
- **Stripe**: Publishable and secret keys
- **Medusa**: Backend URL configuration

## 🎨 Product Customization

The platform supports extensive product customization through:

- **Text Customization**: Fonts, colors, positioning
- **Image Upload**: Custom graphics and logos
- **Design Areas**: Predefined customizable regions
- **Real-time Preview**: Live canvas updates

## 📖 Development

### Backend Development
```bash
cd backend
yarn dev          # Start development server
yarn build        # Build for production
yarn seed         # Seed database with sample data
```

### Storefront Development
```bash
cd storefront
yarn dev          # Start development server
yarn build        # Build for production
yarn lint         # Run linting
```

## 🧪 Testing

```bash
# Backend tests
cd backend
yarn test

# Frontend tests  
cd storefront
yarn test
```

## 📚 Documentation

- [Backend API Documentation](./docs/backend-api.md)
- [Storefront Components](./docs/storefront-components.md)
- [Customization System](./docs/customization-system.md)
- [Deployment Guide](./docs/deployment.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in this repository
- Check the documentation in the `docs/` folder
