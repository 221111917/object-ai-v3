# Real-Time Object Recognition Web App

**Aplikasi Object Recognition Real-Time** – Sistem deteksi objek secara langsung di browser menggunakan **TensorFlow.js** dan model **COCO-SSD**. Dibangun dengan arsitektur full-stack modern: **React.js (Vite)** untuk frontend dan **Node.js + Express** untuk backend (opsional).

> **Demo Live**: [https://your-app.vercel.app](https://your-app.vercel.app) *(ganti dengan link deployment Anda)*  
> **Repository**: `https://github.com/yourusername/object-recognition-realtime`

---

## Anggota Tim

| Nama                  | NIM          |
|-----------------------|--------------|
| Artolito Chandra      | 221110767    |
| Bryan Yapiter         | 221110930    |
| Nicholas Tio          | 221111917    |

---

## Fitur Utama

- **Deteksi Objek Real-Time** (80+ kelas dari dataset COCO)
- **Client-side & Server-side Processing** (hybrid mode)
- **Akses Kamera via Browser** (`getUserMedia`)
- **Bounding Box + Confidence Score** pada setiap objek
- **UI Responsif & Intuitif** (Desktop & Mobile)
- **Pengaturan Threshold & Mode Deteksi**
- **Snapshot & FPS Monitoring**
- **Siap Integrasi YOLOv8** di masa depan

---

## Deskripsi Proyek

Aplikasi ini adalah sistem **object detection real-time** berbasis web yang memungkinkan pengguna mengidentifikasi objek di sekitar melalui kamera perangkat (laptop/smartphone) secara langsung di browser — **tanpa instalasi apapun**.

Menggunakan:
- **TensorFlow.js** sebagai engine ML di browser
- **COCO-SSD** (pre-trained model) untuk deteksi 80+ objek umum
- **React + Vite** untuk performa frontend cepat
- **Node.js + Express** untuk server-side inference (opsional)

---

## Tujuan Pengembangan

1. Implementasi object detection real-time di platform web
2. Arsitektur hybrid (client & server processing)
3. Aksesibilitas tinggi tanpa instalasi
4. UI/UX edukatif & interaktif
5. Demonstrasi penerapan computer vision di dunia nyata

---

## Teknologi yang Digunakan

### Frontend
| Teknologi | Versi |
|---------|-------|
| React.js | `^18.2.0` |
| Vite | `^5.0.0` |
| TensorFlow.js | `^4.0.0` |
| @tensorflow-models/coco-ssd | `^2.2.2` |
| Framer Motion | `^10.0.0` |

### Backend *(Opsional)*
| Teknologi | Versi |
|---------|-------|
| Node.js | `>=16.0.0` |
| Express.js | `^4.18.0` |

### Deployment
- **Frontend**: [Vercel](https://vercel.com) / [Netlify](https://netlify.com)
- **Backend**: [Render](https://render.com) / [Heroku](https://heroku.com)

---

## Persyaratan Sistem

- **Node.js** `v16` atau lebih tinggi
- **NPM** atau **Yarn**
- **Browser Modern** (Chrome, Firefox, Safari, Edge) dengan:
  - Dukungan **WebGL**
  - Dukungan **getUserMedia API**
- **Kamera / Webcam**

---

## Instalasi & Setup Lokal

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/object-recognition-realtime.git
cd object-recognition-realtime
```
### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
### 3. Setup Backend (Opsional - untuk Server Mode)
```bash
cd ../backend
npm install
npm start
```
Cara Penggunaan

1. Buka Aplikasi di Browser
Tunggu loading model COCO-SSD (~10–30 detik)

2. Klik "Begin"
Izinkan akses kamera
Stream video akan dimulai

3. Pilih Mode Deteksi
Client → diproses di browser (default)
Server → kirim frame ke backend

4. Atur Confidence Threshold
Geser slider (0% – 100%) untuk sensitivitas

5. Gunakan Fitur
Snapshot: Simpan gambar hasil deteksi
Stop Camera: Hentikan stream
FPS Counter: Pantau performa real-time

6. Lihat Hasil
Bounding box warna-warni + label
Panel "Detected Objects" dengan confidence score

Hasil yang Dicapai

Metrik,Hasil
| Kelas Objek           | 80+ (COCO Dataset)  |
| FPS (Desktop)         | 20–30 FPS           |
| FPS (Mobile)          | 15–25 FPS           |
| Latensi Deteksi       | <100ms (client mode)  |
| Akurasi Umum          | "Baik untuk objek umum (person, car, chair, dll)"  |
| Kondisi Pencahayaan   | Konsisten di cahaya normal hingga redup            |


## 🏗️ Arsitektur Sistem

flowchart TD
    
    A[User Browser] --> B(Camera Stream<br>getUserMedia API)
    
    B --> C{Mode Deteksi}
    
    C -->|Client Mode| D[TensorFlow.js + COCO-SSD<br>Processing di Browser]
    C -->|Server Mode| E[POST Frame ke /detect]
    
    E --> F[Backend: Node.js + Express]
    F --> G[@tensorflow/tfjs-node<br>Inference di Server]
    G --> H[Response: Bounding Boxes + Scores]
    H --> A
    
    style D fill:#e3f2fd,stroke:#1976d2,color:#000
    style G fill:#f3e5f5,stroke:#7b1fa2,color:#000

Kelebihan Sistem:

Aksesibilitas Tinggi – Buka di browser mana saja
Tanpa Instalasi – Cukup buka link
Performa Optimal – Client-side mengurangi latency
UI Intuitif – Cocok untuk demo & edukasi
Scalable – Siap upgrade ke YOLOv8

Terima Kasih
Kepada:

TensorFlow.js Team
Microsoft COCO Dataset
Vite & React Community



Tugas Akhir – Teknik Informatika
Artolito Chandra, Bryan Yapiter, Nicholas Tio
2025
