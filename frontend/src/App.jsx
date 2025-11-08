import React, { useRef, useState, useEffect } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import { MotionConfig, motion } from 'framer-motion';
import { Camera, Zap, Settings, CameraOff } from 'lucide-react';

function formatCount(n){ return n===0?'—':n; }

export default function App(){
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);
  const [running, setRunning] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Loading smart vision...');
  const [objects, setObjects] = useState([]);
  const [threshold, setThreshold] = useState(0.45);
  const [fps, setFps] = useState(0);
  const [mode, setMode] = useState('client'); // client or server
  const rafRef = useRef(null);

  useEffect(()=>{
    // friendly loading microcopy
    setLoadingMsg('Preparing the vision model...');
    cocoSsd.load().then(m=>{
      setModel(m);
      setLoadingMsg('Ready — press "Begin" to start');
    }).catch(err=>{
      console.error(err);
      setLoadingMsg('Failed to load model in browser. You can enable server mode.');
    });
  },[]);

  useEffect(()=>{
    let last = performance.now();
    async function detectLoop(){
      if(!model || !running) return;
      const video = videoRef.current;
      if(video && video.readyState===4){
        const preds = await model.detect(video);
        const filtered = preds.filter(p => p.score >= threshold);
        draw(filtered);
        setObjects(filtered.map(p=>({class:p.class,score:p.score})));
        // non-blocking log
        fetch('/api/log', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({timestamp:Date.now(),predictions:filtered})}).catch(()=>{});
      }
      const now = performance.now();
      setFps(Math.round(1000/(now-last)));
      last = now;
      rafRef.current = requestAnimationFrame(detectLoop);
    }
    if(running) detectLoop();
    return ()=> cancelAnimationFrame(rafRef.current);
  },[model,running,threshold]);

  function draw(predictions){
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if(!canvas || !video) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.font = '600 14px "Plus Jakarta Sans", Inter, sans-serif';
    for(const p of predictions){
      const [x,y,w,h] = p.bbox;
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.strokeStyle = 'rgba(75,85,99,0.95)';
      ctx.lineWidth = 2;
      // rounded rect
      const r = 8;
      ctx.beginPath();
      ctx.moveTo(x+r,y);
      ctx.arcTo(x+w,y,x+w,y+h,r);
      ctx.arcTo(x+w,y+h,x,y+h,r);
      ctx.arcTo(x,y+h,x,y,r);
      ctx.arcTo(x,y,x+w,y,r);
      ctx.closePath();
      ctx.stroke();
      // label pill
      const label = `${p.class} ${(p.score*100).toFixed(0)}%`;
      const textW = ctx.measureText(label).width + 18;
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.fillRect(x, Math.max(0,y-28), textW, 28);
      ctx.fillStyle = '#111827';
      ctx.fillText(label, x+9, Math.max(0,y-10));
    }
  }

  async function startCamera(){
    try{
      const s = await navigator.mediaDevices.getUserMedia({video:{width:{ideal:1280}, height:{ideal:720}}});
      videoRef.current.srcObject = s;
      await videoRef.current.play();
      setRunning(true);
    }catch(e){
      alert('Cannot access camera: ' + e.message);
    }
  }
  function stopCamera(){
    setRunning(false);
    const s = videoRef.current?.srcObject;
    if(s) s.getTracks().forEach(t=>t.stop());
    videoRef.current.srcObject = null;
    const ctx = canvasRef.current?.getContext('2d');
    if(ctx) ctx.clearRect(0,0,canvasRef.current.width, canvasRef.current.height);
    setObjects([]);
  }

  return (
    <MotionConfig transition={{duration:0.35}}>
      <div className="app">
        <header className="header">
          <div className="brand">
            <Zap size={22} /> <div className="title">ObjectAI</div>
          </div>
          <div className="actions">
            <div className="status">Status: <strong>{running ? 'Live' : 'Idle'}</strong></div>
            <div className="meta">FPS <strong>{fps}</strong> • Objects <strong>{formatCount(objects.length)}</strong></div>
          </div>
        </header>

        <main className="main">
          <section className="viewer">
            {!model && <div className="empty">{loadingMsg}</div>}
            <div className="videoWrap">
              <video ref={videoRef} className="video" playsInline muted />
              <canvas ref={canvasRef} className="overlay" />
              {!running && <div className="onboard">
                <h3>Welcome 👋</h3>
                <p>Click <strong>Begin</strong> to activate your camera and start smart detection.</p>
                <div className="onboard-actions">
                  <button className="cta" onClick={startCamera}><Camera size={16}/> Begin</button>
                  <button className="ghost" onClick={()=>alert('Try the snapshot or server-mode features in README.')}>How it works</button>
                </div>
              </div>}
            </div>
          </section>

          <aside className="side">
            <div className="card">
              <h4>Controls</h4>
              <div className="controlRow">
                <label>Mode</label>
                <div className="seg">
                  <button className={`seg-btn ${mode==='client'?'active':''}`} onClick={()=>setMode('client')}>Client</button>
                  <button className={`seg-btn ${mode==='server'?'active':''}`} onClick={()=>setMode('server')}>Server</button>
                </div>
              </div>
              <div className="controlRow">
                <label>Confidence</label>
                <input type="range" min="0" max="1" step="0.01" value={threshold} onChange={e=>setThreshold(parseFloat(e.target.value))} />
                <div className="tiny">{Math.round(threshold*100)}%</div>
              </div>

              <div className="controlRow">
                <label>Snapshot</label>
                <div className="row">
                  <button className="btn" onClick={()=>{ // snapshot
                    const c = canvasRef.current; const v = videoRef.current;
                    if(!c||!v) return;
                    const tmp = document.createElement('canvas'); tmp.width = v.videoWidth; tmp.height = v.videoHeight;
                    const tctx = tmp.getContext('2d'); tctx.drawImage(v,0,0,tmp.width,tmp.height); tctx.drawImage(c,0,0);
                    const data = tmp.toDataURL('image/png');
                    const a = document.createElement('a'); a.href=data; a.download='snapshot.png'; a.click();
                  }}>Save image</button>
                  <button className="btn ghost" onClick={()=>{ stopCamera(); }}>Stop camera</button>
                </div>
              </div>

              <div className="help">Tip: Switch to <strong>Server</strong> for higher-accuracy detection (see README).</div>
            </div>

            <div className="card">
              <h4>Detected</h4>
              <ul className="list">
                {objects.length===0 && <li className="muted">No objects detected yet</li>}
                {objects.map((o, i)=>(
                  <li key={i}><strong>{o.class}</strong> <span className="score">{Math.round(o.score*100)}%</span></li>
                ))}
              </ul>
            </div>

          </aside>
        </main>

        <footer className="footer">ObjectAI • Demo build • Designed for a global audience</footer>
      </div>
    </MotionConfig>
  );
}
