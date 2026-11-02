import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Compass, MapPin, Eye, Sparkles } from 'lucide-react';

const HISTORIC_SITES = [
  {
    id: 'phunam',
    name: 'Phù Nam — Thương cảng Óc Eo',
    lat: 10.2,
    lon: 105.1,
    period: 'Thế kỷ I – VII',
    significance: 'Đầu mối giao thương quốc tế sầm uất nhất Đông Nam Á cổ đại.',
    color: '#e6ad4c',
    topicId: 4
  },
  {
    id: 'champa',
    name: 'Vương quốc Champa — Mỹ Sơn',
    lat: 15.8,
    lon: 108.1,
    period: 'Thế kỷ IV – XIII',
    significance: 'Thánh địa tôn giáo Hindu và nghệ thuật đền tháp gạch huyền bí.',
    color: '#ff7b54',
    topicId: 4
  },
  {
    id: 'angkor',
    name: 'Đế quốc Khmer — Angkor Wat',
    lat: 13.4,
    lon: 103.8,
    period: 'Thế kỷ IX – XV',
    significance: 'Đỉnh cao kiến trúc đền núi và hệ thống thủy lợi Đông Nam Á.',
    color: '#9b5de5',
    topicId: 4
  },
  {
    id: 'daiviet',
    name: 'Đại Việt — Thăng Long & Đông Sơn',
    lat: 21.0,
    lon: 105.8,
    period: 'Cổ – Trung đại',
    significance: 'Cái nôi văn minh sông Hồng và kỹ nghệ đúc trống đồng Đông Sơn.',
    color: '#00bbf9',
    topicId: 7
  },
  {
    id: 'srivijaya',
    name: 'Đế chế Hải đảo Srivijaya',
    lat: -2.9,
    lon: 104.7,
    period: 'Thế kỷ VII – XIII',
    significance: 'Trung tâm hàng hải kiểm soát eo biển Malacca và Phật giáo mật tông.',
    color: '#00f5d4',
    topicId: 4
  },
  {
    id: 'pagan',
    name: 'Vương quốc Pagan — Myanmar',
    lat: 21.1,
    lon: 94.8,
    period: 'Thế kỷ IX – XIII',
    significance: 'Vùng đất của vạn ngôi chùa tháp Phật giáo Theravada.',
    color: '#f15bb5',
    topicId: 4
  },
  {
    id: 'sailendra',
    name: 'Borobudur — Vương triều Sailendra',
    lat: -7.6,
    lon: 110.2,
    period: 'Thế kỷ VIII – IX',
    significance: 'Kỳ quan bảo tháp Phật giáo lớn nhất thế giới tại đảo Java.',
    color: '#fee440',
    topicId: 4
  }
];

export default function GlobeViewer3D({ onSelectSite = null, height = '460px' }) {
  const containerRef = useRef(null);
  const [activeSite, setActiveSite] = useState(HISTORIC_SITES[0]);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const heightPx = container.clientHeight || 460;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / heightPx, 0.1, 100);
    camera.position.set(0, 0, 4.8);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);
    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.5);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    // 4. Globe Mesh (Ocean)
    const globeRadius = 1.6;
    const globeGeo = new THREE.SphereGeometry(globeRadius, 48, 48);
    const globeMat = new THREE.MeshStandardMaterial({
      color: 0x1a2b4c,
      roughness: 0.6,
      metalness: 0.2
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globe);

    // Globe Atmosphere Glow
    const glowGeo = new THREE.SphereGeometry(globeRadius * 1.04, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x3366cc,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glow);

    // Add coordinate grid lines (Latitude & Longitude)
    const gridMat = new THREE.LineBasicMaterial({ color: 0x2e446d, transparent: true, opacity: 0.4 });
    for (let lat = -60; lat <= 60; lat += 30) {
      const r = globeRadius * Math.cos((lat * Math.PI) / 180);
      const y = globeRadius * Math.sin((lat * Math.PI) / 180);
      const circleGeo = new THREE.BufferGeometry();
      const pts = [];
      for (let a = 0; a <= 360; a += 10) {
        const rad = (a * Math.PI) / 180;
        pts.push(new THREE.Vector3(r * Math.cos(rad), y, r * Math.sin(rad)));
      }
      circleGeo.setFromPoints(pts);
      const line = new THREE.Line(circleGeo, gridMat);
      globe.add(line);
    }

    // Function: convert lat/lon to 3D point on globe
    const latLonToVector3 = (lat, lon, radius) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    // 5. Add Maritime Trade Routes (Glowing Arcs)
    const routePairs = [
      ['phunam', 'srivijaya'],
      ['phunam', 'champa'],
      ['champa', 'daiviet'],
      ['phunam', 'angkor'],
      ['srivijaya', 'sailendra'],
      ['angkor', 'pagan']
    ];

    routePairs.forEach(([fromId, toId]) => {
      const s1 = HISTORIC_SITES.find((s) => s.id === fromId);
      const s2 = HISTORIC_SITES.find((s) => s.id === toId);
      if (!s1 || !s2) return;

      const p1 = latLonToVector3(s1.lat, s1.lon, globeRadius);
      const p2 = latLonToVector3(s2.lat, s2.lon, globeRadius);
      const mid = p1.clone().add(p2).multiplyScalar(0.5);
      mid.normalize().multiplyScalar(globeRadius * 1.15); // elevated arc

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const points = curve.getPoints(30);
      const routeGeo = new THREE.BufferGeometry().setFromPoints(points);
      const routeMat = new THREE.LineBasicMaterial({
        color: 0xe6ad4c,
        transparent: true,
        opacity: 0.7
      });
      const routeLine = new THREE.Line(routeGeo, routeMat);
      globe.add(routeLine);
    });

    // 6. Add Historical Site Pins
    const pinsGroup = new THREE.Group();
    globe.add(pinsGroup);

    HISTORIC_SITES.forEach((site) => {
      const pos = latLonToVector3(site.lat, site.lon, globeRadius * 1.01);

      // Pin core
      const pinGeo = new THREE.SphereGeometry(0.045, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(site.color) });
      const pin = new THREE.Mesh(pinGeo, pinMat);
      pin.position.copy(pos);
      pinsGroup.add(pin);

      // Pulse ring
      const ringGeo = new THREE.RingGeometry(0.05, 0.075, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(site.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
      });
      const pulseRing = new THREE.Mesh(ringGeo, ringMat);
      pulseRing.position.copy(pos);
      pulseRing.lookAt(new THREE.Vector3(0, 0, 0));
      pinsGroup.add(pulseRing);
    });

    // Orient globe to center on Southeast Asia (approx lat 12, lon 105)
    globe.rotation.y = -Math.PI / 1.6;
    globe.rotation.x = 0.25;

    // Mouse drag interaction
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };

    const onDown = (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      globe.rotation.y += dx * 0.006;
      globe.rotation.x = Math.max(-0.6, Math.min(0.6, globe.rotation.x + dy * 0.006));
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onUp = () => (isDragging = false);

    container.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    // Animation Loop
    let reqId;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      if (autoRotate && !isDragging) {
        globe.rotation.y += 0.0018;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(reqId);
      container.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      renderer.dispose();
    };
  }, [autoRotate]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-700/60 bg-gradient-to-br from-slate-900 to-[#101c36] shadow-2xl">
      {/* 3D Canvas */}
      <div ref={containerRef} style={{ height }} className="w-full cursor-grab active:cursor-grabbing" />

      {/* Header Overlay */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold/20 text-gold border border-gold/40 backdrop-blur-md">
          <Compass className="w-3.5 h-3.5" /> Hải Trình Văn Minh Đông Nam Á 3D
        </div>
        <h3 className="text-white font-extrabold text-base mt-2 drop-shadow-md">
          Con Đường Tơ Lụa & Gia Vị Trên Biển
        </h3>
        <p className="text-slate-300 text-xs max-w-sm drop-shadow">
          Không gian giao lưu kinh tế, văn hóa và các vương quốc cổ đại Đông Nam Á thời cổ – trung đại.
        </p>
      </div>

      {/* Site Selector Buttons (Click to inspect site) */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 max-w-[210px]">
        {HISTORIC_SITES.map((site) => (
          <button
            key={site.id}
            onClick={() => {
              setActiveSite(site);
              if (onSelectSite) onSelectSite(site);
            }}
            className={`text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition backdrop-blur-md flex items-center justify-between border ${
              activeSite.id === site.id
                ? 'bg-gold text-slate-950 font-bold border-gold shadow-md'
                : 'bg-slate-900/60 text-slate-300 border-white/10 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <span className="truncate">{site.name.split('—')[0]}</span>
            <span className="w-2 h-2 rounded-full ml-1" style={{ backgroundColor: site.color }} />
          </button>
        ))}
      </div>

      {/* Bottom Info Card for Selected Site */}
      <div className="absolute bottom-4 left-4 right-4 z-10 bg-slate-950/85 backdrop-blur-md p-3.5 rounded-xl border border-white/15 shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-950 font-black text-sm shrink-0 shadow-md"
            style={{ backgroundColor: activeSite.color }}
          >
            <MapPin className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-sm">{activeSite.name}</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-white/10 text-gold font-semibold">
                {activeSite.period}
              </span>
            </div>
            <p className="text-slate-300 text-xs mt-0.5 line-clamp-1">{activeSite.significance}</p>
          </div>
        </div>

        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className="text-xs px-3 py-1.5 rounded-lg border border-white/20 text-slate-200 hover:bg-white/10 transition shrink-0 font-medium"
        >
          {autoRotate ? 'Dừng xoay' : 'Tự xoay'}
        </button>
      </div>
    </div>
  );
}

