# Cultural Ministry POS System

> A modern, full-stack Point of Sale system designed for the Moroccan Ministry of Culture, featuring real-time transactions, secure authentication, and comprehensive receipt management.

[![Node.js](https://img.shields.io/badge/Node.js-16.x-green.svg)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-5.7-blue.svg)](https://mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Supported-blue.svg)](https://docker.com/)
[![Express.js](https://img.shields.io/badge/Express.js-4.19.2-lightgrey.svg)](https://expressjs.com/)

## Overview

This sophisticated POS system revolutionizes ticket sales for cultural events and exhibitions. Built with modern web technologies, it provides a seamless experience for staff while maintaining robust backend operations and comprehensive transaction tracking.

### Key Highlights

- **🔐 Secure Authentication**: Role-based access control with encrypted user codes
- **💳 Multi-Payment Support**: Cash, Card, and E-Wallet payment processing
- **📊 Real-time Analytics**: Live transaction tracking and reporting
- **🎯 Category Management**: Organized ticket categorization (Exhibitions, Concerts, Workshops, etc.)
- **📱 Responsive Design**: Optimized for desktop and tablet use
- **🧾 Digital Receipts**: Professional receipt generation with printing capabilities
- **🐳 Docker Ready**: Containerized deployment for scalability

## 🏗Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│                 │    │                 │    │                 │
│ • Alpine.js     │◄──►│ • Express.js    │◄──►│ • MySQL 5.7     │
│ • Bootstrap 4   │    │ • RESTful APIs  │    │ • Transaction   │
│ • Responsive    │    │ • CORS Enabled  │    │   Management    │
│ • Real-time UI  │    │ • Error Handling│    │ • User Auth     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

##  Features

### Business Operations
- **Inventory Management**: Dynamic ticket loading and category filtering
- **Cart Management**: Real-time cart updates with quantity controls
- **Payment Processing**: Multiple payment methods with change calculation
- **Receipt Generation**: Professional receipts with business details
- **User Authentication**: Secure login system for staff access

### Technical Features
- **RESTful API Design**: Clean, maintainable backend architecture
- **Database Integration**: Robust MySQL integration with connection pooling
- **Error Handling**: Comprehensive error management and logging
- **CORS Configuration**: Secure cross-origin resource sharing
- **Responsive Layout**: Mobile-first design principles
- **State Management**: Efficient client-side state handling

###  Analytics & Reporting
- **Transaction Tracking**: Complete transaction history with timestamps
- **Payment Method Analytics**: Breakdown by payment types
- **User Activity Logs**: Staff authentication and activity tracking
- **Receipt Management**: Digital receipt storage and retrieval

##  Technology Stack

### Backend
- **Runtime**: Node.js 14+
- **Framework**: Express.js 4.19.2
- **Database**: MySQL 5.7
- **Middleware**: Body-parser, CORS
- **Container**: Docker & Docker Compose

### Frontend
- **Framework**: Alpine.js 2.8.2
- **UI Library**: Bootstrap 4.5.2
- **Icons**: Material Icons
- **Fonts**: Google Fonts (Roboto)
- **Styling**: Custom CSS with CSS Variables

### Development Tools
- **Containerization**: Docker Compose
- **Database Management**: MySQL Workbench compatible
- **Version Control**: Git (GitLab)
- **Package Management**: npm

## Database Schema

```sql
-- Core Tables
├── users (Authentication)
│   ├── id (PRIMARY KEY)
│   ├── auth_code (UNIQUE)
│   └── created_at
│
├── tickets (Product Catalog)
│   ├── id (PRIMARY KEY)
│   ├── name
│   ├── category
│   ├── price
│   └── image
│
├── transactions (Sales Records)
│   ├── id (PRIMARY KEY)
│   ├── date_time
│   ├── total_amount
│   ├── payment_method
│   └── auth_code (FOREIGN KEY)
│
└── details (Transaction Items)
    ├── id (PRIMARY KEY)
    ├── transaction_id (FOREIGN KEY)
    ├── ticket_id
    ├── ticket_name
    └── quantity
```

##  Quick Start

### Prerequisites
- Node.js 14+ installed
- MySQL 5.7+ running
- Docker & Docker Compose (optional)

### Option 1: Docker Deployment (Recommended)

```bash
# Clone the repository
git clone https://gitlab.com/zakaria0011/yancaisse.git
cd yancaisse

# Start the application
docker-compose up -d

# Access the application
open http://localhost:4000
```

### Option 2: Manual Setup

```bash
# Clone and install dependencies
git clone https://gitlab.com/zakaria0011/yancaisse.git
cd yancaisse
npm install

# Configure database (update backend/db.js with your credentials)
mysql -u root -p < database/schema.sql

# Start the application
npm start

# Access the application
open http://localhost:4000
```

## Configuration

### Environment Variables
```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=base
PORT=4000
```

### Database Setup
```sql
CREATE DATABASE base;
USE base;

-- Create required tables
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    auth_code VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add sample data
INSERT INTO users (auth_code) VALUES ('ADMIN123');
```

##  Usage

### Authentication
1. Navigate to `/login.html`
2. Enter your authentication code
3. Access the main POS interface

### Making Sales
1. **Select Products**: Browse tickets by category
2. **Add to Cart**: Click tickets to add to cart
3. **Manage Quantities**: Use +/- buttons to adjust quantities
4. **Process Payment**: Choose payment method (Cash/Card/E-Wallet)
5. **Generate Receipt**: Automatic receipt generation with print option

### Admin Functions
- View transaction history via API endpoints
- Monitor sales analytics
- Manage user access codes

##  API Endpoints

```http
POST /api/login
# Authenticate user with auth code

GET /api/tickets
# Retrieve all available tickets

GET /api/data
# Get transaction history

POST /api/checkout
# Process payment and create transaction
Content-Type: application/json
{
  "paymentMethod": "Cash|Card|E-Wallet",
  "total": 25.50,
  "cart": [...],
  "auth_code": "USER123"
}
```

##  Testing

```bash
# Test database connection
curl http://localhost:4000/api/data

# Test authentication
curl -X POST http://localhost:4000/api/login \
  -H "Content-Type: application/json" \
  -d '{"auth_code":"ADMIN123"}'

# Test ticket retrieval
curl http://localhost:4000/api/tickets
```

## Performance Features

- **Efficient Queries**: Optimized database queries with proper indexing
- **Caching Strategy**: Client-side cart persistence
- **Responsive Design**: Fast loading times across devices
- **Error Recovery**: Graceful error handling and user feedback
- **Connection Pooling**: Efficient database connection management

## Security Features

- **Authentication Required**: Secure access control
- **SQL Injection Prevention**: Parameterized queries
- **CORS Protection**: Configured cross-origin policies
- **Input Validation**: Client and server-side validation
- **Secure Headers**: Proper HTTP security headers

##  UI/UX Highlights

- **Modern Design**: Clean, professional interface
- **Intuitive Navigation**: User-friendly category sidebar
- **Real-time Updates**: Live cart and total calculations
- **Mobile Responsive**: Optimized for various screen sizes
- **Accessibility**: Proper contrast and semantic markup

##  Deployment

### Production Deployment
```bash
# Build production image
docker build -t cultural-pos .

# Deploy with Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose scale app=3
```

### Environment Setup
- Configure production database credentials
- Set up SSL certificates for HTTPS
- Configure reverse proxy (Nginx/Apache)
- Set up monitoring and logging

##  License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

##  Developer

**Youssef Abd**
- Email: [Contact Information]
- LinkedIn: [Your LinkedIn Profile]
- Portfolio: [Your Portfolio Website]
