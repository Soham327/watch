# Responsive Watches Website ⌚
## [Watch it on youtube](https://youtu.be/QPxYdbbCjhQ)
### Responsive Watches Website ⌚

- Responsive Watches Website Using HTML CSS & JavaScript
- Smooth scrolling in each section.
- Includes a dark and light mode.
- Developed first with the Mobile First methodology, then for desktop.
- Compatible with all mobile devices and with a beautiful and pleasant user interface.

Join the channel to see more videos like this. [Bedimcode](https://www.youtube.com/c/Bedimcode)

![preview img](/preview.png)

## Admin Panel

An admin panel scaffold is available at `/admin/index.html`. It provides a simple client-side product editor that stores data in `localStorage` and can export/import JSON. This is a static, client-side tool (not secure for production).

## Local database (optional)

A minimal Node.js backend is included to provide a tiny JSON-backed database and simple API endpoints for product sync. This is optional — the admin panel still works client-side with `localStorage`.

To run the backend locally:

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

The server listens on `http://localhost:3000` and exposes:

- `GET /api/products` — list all products
- `POST /api/products/bulk` — replace/add multiple products (array payload)
- `POST /api/products` — add/update a single product
- `DELETE /api/products/:id` — delete product by id

In the admin UI (`/admin/index.html`) use the "Pull From Server" and "Push To Server" buttons to sync between `localStorage` and the server.
