# 📦 Product Management System

A web application for managing products with an intuitive dashboard, built with Node.js, Express, and MySQL.



## ✨ Features

- 📊 **Dashboard Overview** - Real-time statistics on products, inventory value, and stock
- ➕ **Product Management** - Create, read, update, and delete products
- 🖼️ **Image Upload** - Support for product images (JPEG, PNG, WEBP)
- 🔍 **Search & Filter** - Quick product search functionality
- 📄 **Pagination** - Efficient data loading with paginated results
- 🔐 **Admin Authentication** - Secure admin access control
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

**Backend:**
- Node.js
- Express.js
- MySQL  (Promise-based)
- Multer (File uploads)

**Frontend:**
- HTML5
- CSS3
- Vanilla JavaScript


## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd product-management
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
touch .env
```

Add the following configuration to `.env`:

```env
DB_PASSWORD=your_mysql_password
```

**Important:** Replace `your_mysql_password` with your actual MySQL root password.

### Step 4: Set Up the Database

#### Option A: Using MySQL Workbench (Recommended)

1. Open **MySQL Workbench**
2. Connect to your MySQL server
3. Create a new database:
   ```sql
   CREATE DATABASE product_management;
   ```
4. Select the database:
   ```sql
   USE product_management;
   ```
5. Import the SQL file:
   - Go to **Server** → **Data Import**
   - Select **Import from Self-Contained File**
   - Browse and select the `product_management.sql` file from the project
   - Click **Start Import**

#### Option B: Using MySQL Command Line

```bash
mysql -u root -p

# Enter your password when prompted

CREATE DATABASE product_management;
USE product_management;
SOURCE path/to/product_management.sql;
EXIT;
```

### Step 5: Verify Database Configuration

The application expects the following database connection settings:

- **Host:** localhost
- **User:** root
- **Password:** (from your `.env` file)
- **Database:** product_management

### Step 6: Start the Application

```bash
node app.js
```

You should see:

```
✓ MySQL connected successfully
Server running on http://localhost:3000
```

## 🌐 Access the Application

Once the server is running, open your browser and navigate to:

- **Dashboard:** [http://localhost:3000](http://localhost:3000)
- **Login Page:** [http://localhost:3000/login](http://localhost:3000/login)

### Default Credentials
Use these credentials to log in to the dashboard:

Email: admin@gmail.com
Password: admin123

## ⚠️ Important Warnings

### Database Configuration Required

**The application will NOT run without proper database configuration!**

If you encounter database connection errors:

1. ✅ Verify MySQL is running
2. ✅ Check your `.env` file has the correct `DB_PASSWORD`
3. ✅ Confirm the `product_management` database exists
4. ✅ Ensure the SQL file has been imported successfully
5. ✅ Verify your MySQL user (root) has proper permissions

### Common Errors

| Error Message | Solution |
|---------------|----------|
| `MySQL connection failed: ER_ACCESS_DENIED_ERROR` | Check your MySQL password in `.env` |
| `MySQL connection failed: ER_BAD_DB_ERROR` | Database doesn't exist - create it first |
| `ECONNREFUSED` | MySQL server is not running |
| `ER_NO_SUCH_TABLE` | SQL file not imported - import it |

## 📁 Project Structure

```
product-management/
│
├── config/
│   └── dbConnect.js          # Database connection configuration
│
├── controllers/
│   ├── productController.js  # Product CRUD operations
│   └── reportController.js   # Dashboard statistics
│
├── middlewares/
│   ├── adminAuth.js          # Authentication middleware
│   └── upload.js             # File upload configuration
│
├── public/
│   ├── css/
│   │   └── style.css         # Application styles
│   ├── js/
│   │   ├── dashboard.js      # Dashboard functionality
│   │   └── login.js          # Login functionality
│   └── uploads/              # Product images storage
│
├── routes/
│   ├── productRoutes.js      # Product API endpoints
│   └── reportRoutes.js       # Report API endpoints
│
├── views/
│   ├── dashboard.html        # Main dashboard page
│   └── login.html            # Login page
│
├── .env                      # Environment variables (create this)
├── .gitignore               # Git ignore rules
├── app.js                   # Application entry point
├── package.json             # Project dependencies
└── README.md                # This file
```

## 🔌 API Endpoints

### Products

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/products` | Create a new product | ✅ |
| GET | `/api/products` | Get all products (with pagination) | ❌ |
| GET | `/api/products/:id` | Get single product | ❌ |
| PUT | `/api/products/:id` | Update product | ✅ |
| DELETE | `/api/products/:id` | Soft delete product | ✅ |

### Reports

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/reports/summary` | Get dashboard statistics | ❌ |



## 🖼️ Image Upload Specifications

- **Allowed formats:** JPEG, JPG, PNG, WEBP
- **Max file size:** 5MB
- **Storage location:** `public/uploads/`
- **Naming convention:** `image-{timestamp}-{random}.{ext}`

## 🔒 Security Features

- Environment variable protection for sensitive data
- File type validation for uploads
- SQL injection prevention using parameterized queries
- Admin authentication middleware
- Soft delete for data integrity

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 is already in use, you can change it in `app.js`:

```javascript
const PORT = 3001; // Change to any available port
```

### File Upload Not Working

1. Check that `public/uploads/` directory exists
2. Verify file permissions
3. Ensure file size is under 5MB
4. Confirm file format is supported

### Database Connection Issues

Run this test query in MySQL:

```sql
SELECT 1;
```

If it fails, your MySQL server is not running properly.

## 📚 Database Schema

### Products Table

```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  image VARCHAR(255),
  stock_quantity INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```





**⚡ Quick Start Checklist**

- [ ] Node.js installed
- [ ] MySQL installed and running
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created with `DB_PASSWORD`
- [ ] Database `product_management` created
- [ ] SQL file imported
- [ ] Server started (`node app.js`)
- [ ] Browser opened to `http://localhost:3000`

