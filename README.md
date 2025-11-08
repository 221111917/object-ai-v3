# ObjectAI v3 — Premium UI & Optional Server Detection

This package includes:
- frontend/ (React + Vite) — premium UI, framer-motion, client-side TFJS detection (COCO-SSD)
- backend/ (Node.js Express) — logging endpoint and scaffold for server-side detection

## Quick start (local)

### Frontend
1. cd frontend
2. npm install
3. npm run dev
4. Open http://localhost:5173 and click Begin

### Backend (optional)
1. cd backend
2. npm install
3. npm start
4. Backend available at http://localhost:5000

## About detection & accuracy
- The frontend uses COCO-SSD TFJS for client-side detection (reliable & fast). For better accuracy, follow "Server-side YOLOv8 guide" below.
- Server-side YOLOv8 (recommended for production): set up a Python server (Ultralytics/YOLOv8) and enable `/api/detect` to accept base64 frames and return JSON predictions. Instructions below.

## Server-side YOLOv8 (short guide)
1. Create a Python env and install ultralytics: `pip install ultralytics fastapi uvicorn python-multipart`
2. Example server (not included): load model `from ultralytics import YOLO; model = YOLO('yolov8n.pt')` and expose POST `/detect` that accepts an image and returns `model.predict(source=image)` JSON.
3. Point frontend mode "Server" to your server and implement `/api/detect` to accept `{ image: "data:image/png;base64,..." }` and return predictions.
4. Pros: much higher accuracy, ability to use custom-trained weights.

## Notes
- This repo is packaged as a demo. You can replace client model with converted YOLO TFJS builds if you have one.
- No server-side inference is enabled by default to keep the package lightweight and deployable.
