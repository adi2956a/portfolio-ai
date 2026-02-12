# API Overview

Base URL: `http://localhost:5000/api`

## Auth

- `POST /auth/login`
  - body: `{ "email": "...", "password": "..." }`
  - returns: `{ token, admin }`

## Posts

- `GET /posts`
- `GET /posts/:slug`
- `POST /posts` (admin)
- `PUT /posts/:id` (admin)
- `DELETE /posts/:id` (admin)

## Comments

- `POST /comments`
- `GET /comments` (admin)
- `PATCH /comments/:id/approve` (admin)
- `DELETE /comments/:id` (admin)

## Ratings

- `POST /ratings`
  - body: `{ "postId": "...", "value": 1-5 }`
  - returns average/count

## Auth Header

`Authorization: Bearer <token>`
