# Real Estate Reservation System

A modern real estate reservation system built with React and Laravel, featuring a beautiful UI and comprehensive property management capabilities.

## Features

### Frontend (React + TypeScript)
- Modern, responsive UI with Tailwind CSS
- Property listing with filtering and sorting
- Detailed property views with image galleries
- User authentication and profile management
- Reservation system with multiple payment methods
- Interactive calendar for date selection
- Real-time status updates for reservations

### Backend (Laravel)
- RESTful API endpoints
- User authentication and authorization
- Property management
- Reservation handling
- Payment processing (cash, cheque, bank transfer)
- Receipt generation
- Flexible discount system
- Premium reservation features

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- React DatePicker
- Headless UI
- Heroicons

### Backend
- Laravel 10
- MySQL/PostgreSQL
- JWT Authentication
- RESTful API

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PHP 8.1 or higher
- Composer
- MySQL/PostgreSQL

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
VITE_API_URL=http://localhost:8000/api
```

4. Start the development server:
```bash
npm run dev
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
composer install
```

3. Create a `.env` file:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=real_estate
DB_USERNAME=root
DB_PASSWORD=

JWT_SECRET=your-secret-key
```

4. Run migrations:
```bash
php artisan migrate
```

5. Start the development server:
```bash
php artisan serve
```

## Project Structure

```
real-estate-system/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── hooks/
│   │   └── utils/
│   ├── public/
│   └── package.json
└── backend/
    ├── app/
    ├── config/
    ├── database/
    ├── routes/
    └── composer.json
```

## API Endpoints

### Authentication
- POST /api/auth/login
- POST /api/auth/register
- GET /api/auth/profile
- PUT /api/auth/profile

### Properties
- GET /api/properties
- GET /api/properties/{id}
- POST /api/properties
- PUT /api/properties/{id}
- DELETE /api/properties/{id}

### Reservations
- GET /api/reservations
- GET /api/reservations/{id}
- POST /api/reservations
- PUT /api/reservations/{id}
- POST /api/reservations/{id}/cancel

### Payments
- POST /api/payments/receipts
- GET /api/payments/receipts/{id}
- PUT /api/payments/receipts/{id}/status

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
#   r e a l - e s t a t e - s y s t e m  
 #   r e a l - e s t a t e - s y s t e m  
 