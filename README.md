# Inventory Management System
  
## Features
-  Dashboard overview of inventory, low stock, and total sales  
-  Product management (Add / List / Low stock highlight)  
-  Record sales transactions with real-time stock update  
-  Built with *Vite* for ultra-fast development  
-  Styled with *TailwindCSS* (no custom CSS, only utilities)  
-  API handled using *Axios* 
-  Navigation handled via *React Router DOM*

---

## Tech Stack

| Layer                 | Technology |

| Frontend Framework    | [React 18+ (Vite)](https://vitejs.dev) |
| CSS Framework         | [TailwindCSS](https://tailwindcss.com) |
| Routing               | [React Router DOM](https://reactrouter.com) |
| HTTP Client           | [Axios](https://axios-http.com) |
| Backend (connected)   | Node.js + Express + MongoDB |

---

## Setup Instructions

###  Clone the Repository

git@github.com:tilak9606/Inventory_Management_System.git

###  install dependencies both for fronend and backend seperately

npm install

### Configure Environment

### fronend .env
VITE_API_URL=http://localhost:5173/api/v1

### backend .env
PORT=8000 
MONGO_URI=mongodb+srv://username:password@cluster0.0ox33hr.mongodb.net/IMS

### Backend Connection
#### Method	``Endpoint	               Description
#### GET	    /api/products	           Fetch all products
#### POST	    /api/products	           Add new product
#### DELETE	  /api/products/:id	       Delete a product
#### GET	    /api/dashboard/overview	 Fetch dashboard summary
#### POST	    /api/sales	             Record a new sale

### run in both frontend and backend seperately
npm run dev

