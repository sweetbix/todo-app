# **To do list (MERN + TailwindCSS)**

# Access site [here](https://todo-frontend-a8kc.onrender.com/)

Nothing much here... go check out frontend [here](https://github.com/sweetbix/todo-frontend)

## File structure

```bash
backend/
│── models/         # Mongoose models
│── routes/         # API route handlers
│── middleware/     # Auth middleware
│── server.js       # Main server file
│── package.json    # Dependencies
```

## API Endpoints
### Auth routes
| Method | Endpoint | Description |
| ----- | ----- | ---- |
| POST | /api/auth/register | Create new user on database, and automatically sign in |
| POST | /api/auth/login  | Log in to existing account |
| POST | /api/auth/logout | Log out and clear cookies |
| GET  | /api/auth/check | Check if user was last logged in |

### Todos routes 
| Method | Endpoint | Description |
| ----- | ----- | ---- |
| GET | /api/todos | Retrieve all todos from user |
| POST | /api/todos  | Create a new todo |
| PUT | /api/todos/:id | Mark specified todo as completed or update todo text |
| DELETE  | /api/todos/:id | Delete specified todo |
| DELETE | /api/todos | Clear all todos |

## Development
Need to have [Node.js](https://nodejs.org/en) installed
```bash
node server.js
```
