# Restaurant Management System

This is a comprehensive restaurant management system built using [Next.js](https://nextjs.org/). The system is designed to streamline various aspects of restaurant operations, including menu management, table management, order processing, billing, and customer loyalty.

## Features

### Core Features
- [x] **Menu Management**: Admins can add, edit, and remove menu items.
- [x] **Table Management**: Admins can manage tables and assign orders to them.
- [x] **Order Management**: Admins can manage orders, including temporary orders and final orders.
- [x] **Billing System**: Generates bills for orders and tracks total sales and revenue.
- [x] **Payment Methods**: Allows for different payment methods, including loyalty points redemption.
- [x] **Loyalty Program**: Calculates and manages loyalty points based on customer spending.
- [x] **Customer Management**: Manages customer details, including mobile number, email, loyalty points, and total amount spent.

### Additional Features (Upcoming)
- [ ] **Inventory Management**: Tracks ingredients and manages stock levels.
- [ ] **Statistics Dashboard**: Provides an overview of sales, revenue, and other key metrics.
- [ ] **Reporting**: Generates monthly reports for analysis.
- [ ] **Real-Time Updates**: Order updates and table management in real-time.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/restaurant-management-system.git
    ```
2. Navigate to the project directory:
    ```bash
    cd restaurant-management-system
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```
4. Set up the environment variables by creating a `.env` file in the root directory:
    ```env
    DATABASE_URL=database_url
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=clerk_public_key
    CLERK_SECRET_KEY=clerk_secret_key
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_OUT_URL=/sign-out
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
    ```
5. Run the development server:
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application in action.

## Usage

After logging in, users can create a restaurant and manage it through the following sections:

- **Menu Management**: Add and update items in the menu.
- **Table Management**: Manage tables by adding them with their respective number of seats. Each table's orders can be managed separately.
- **Order Processing**: Add food items to tables as customers order. Submit orders when customers are ready to pay.
- **Billing**: Generate bills when the order is finalized. Payments can be made via cash, card, UPI, split payments, or loyalty points (customer phone number or email required).
- **Customer Management**: Access customer details, manage loyalty points, and view the total amount spent by customers.

## Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: Clerk
- **Deployment**: Vercel

## Contributing

Contributions are welcome! Please fork this repository and submit a pull request for any features, bug fixes, or enhancements.

## License

This project is licensed under the MIT License.
