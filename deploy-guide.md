# Deploy Guide (Vercel / Netlify + Render)

- Frontend: Deploy the `frontend/` folder to Vercel or Netlify (build command `npm run build`, publish `dist/`)
- Backend: Deploy `backend/` to Render/Heroku/Railway (Node.js server). Ensure CORS and body size limits are set if sending images.
- For production accuracy: run a GPU-enabled YOLOv8 server and connect the frontend to it via `/api/detect`.
