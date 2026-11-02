import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, ZoomIn, ZoomOut, Maximize2, Sun, Sparkles, Box, Info } from 'lucide-react';

export default function ThreeArtifactViewer({
  modelCode = 'dong_son_drum',
  artifactInfo = null,
  height = '500px',
  interactive = true,
  autoRotateInit = true,
  showControls = true
}) {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const modelGroupRef = useRef(null);
  const animFrameIdRef = useRef(null);

  const [autoRotate, setAutoRotate] = useState(autoRotateInit);
  const [wireframe, setWireframe] = useState(false);
  const [lightPreset, setLightPreset] = useState('museum'); // 'museum', 'sun', 'mystic'
  const [loading, setLoading] = useState(true);

  // Mouse interaction state
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x131a2a);

    // 2. Camera setup
    const width = container.clientWidth || 600;
    const heightPx = container.clientHeight || 500;
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 1000);
    camera.position.set(0, 3, 7.5);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    ambientLight.name = 'ambient';
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfff3db, 2.2);
    mainLight.position.set(5, 8, 5);
    mainLight.castShadow = true;
    mainLight.name = 'mainLight';
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x7da4ff, 1.2);
    fillLight.position.set(-5, 3, -4);
    fillLight.name = 'fillLight';
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xe6ad4c, 2.0, 20);
    rimLight.position.set(0, -2, -4);
    rimLight.name = 'rimLight';
    scene.add(rimLight);

    // 5. Pedestal / Shadow ground plane
    const groundGeo = new THREE.CylinderGeometry(3.5, 3.8, 0.25, 48);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x182238,
      roughness: 0.8,
      metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -1.6;
    ground.receiveShadow = true;
    scene.add(ground);

    // Pedestal glow ring
    const ringGeo = new THREE.RingGeometry(3.4, 3.6, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xe6ad4c,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -1.47;
    scene.add(ring);

    // 6. Build Procedural 3D Historical Artifact Model
    const modelGroup = new THREE.Group();
    modelGroupRef.current = modelGroup;

    buildArtifact(modelGroup, modelCode);
    scene.add(modelGroup);
    setLoading(false);

    // 7. Mouse / Touch Controls
    const onMouseDown = (e) => {
      isDraggingRef.current = true;
      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDraggingRef.current || !modelGroupRef.current) return;
      const deltaX = e.clientX - prevMousePosRef.current.x;
      const deltaY = e.clientY - prevMousePosRef.current.y;

      modelGroupRef.current.rotation.y += deltaX * 0.008;
      modelGroupRef.current.rotation.x = Math.max(
        -Math.PI / 4,
        Math.min(Math.PI / 4, modelGroupRef.current.rotation.x + deltaY * 0.008)
      );

      prevMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      const zoomSpeed = 0.002;
      cameraRef.current.position.z = Math.max(3.5, Math.min(14, cameraRef.current.position.z + e.deltaY * zoomSpeed));
    };

    if (interactive) {
      container.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      container.addEventListener('wheel', onWheel, { passive: false });
    }

    // 8. Resize listener
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 9. Animation loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      if (autoRotate && modelGroupRef.current && !isDraggingRef.current) {
        modelGroupRef.current.rotation.y += 0.005;
      }

      // Gentle floating animation
      ring.rotation.z += 0.002;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        container.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        container.removeEventListener('wheel', onWheel);
      }
      renderer.dispose();
    };
  }, [modelCode, interactive]);

  // Handle Wireframe Toggle
  useEffect(() => {
    if (!modelGroupRef.current) return;
    modelGroupRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m) => (m.wireframe = wireframe));
        } else {
          child.material.wireframe = wireframe;
        }
      }
    });
  }, [wireframe]);

  // Handle Lighting Preset
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;
    const mainLight = scene.getObjectByName('mainLight');
    const fillLight = scene.getObjectByName('fillLight');
    const rimLight = scene.getObjectByName('rimLight');

    if (!mainLight || !fillLight || !rimLight) return;

    if (lightPreset === 'museum') {
      mainLight.color.setHex(0xfff3db);
      mainLight.intensity = 2.2;
      fillLight.color.setHex(0x7da4ff);
      fillLight.intensity = 1.2;
      rimLight.color.setHex(0xe6ad4c);
      rimLight.intensity = 2.0;
      scene.background.setHex(0x131a2a);
    } else if (lightPreset === 'sun') {
      mainLight.color.setHex(0xffffff);
      mainLight.intensity = 2.8;
      fillLight.color.setHex(0xdde9ff);
      fillLight.intensity = 1.4;
      rimLight.color.setHex(0xffe6b3);
      rimLight.intensity = 1.0;
      scene.background.setHex(0x182438);
    } else if (lightPreset === 'mystic') {
      mainLight.color.setHex(0xff9955);
      mainLight.intensity = 2.5;
      fillLight.color.setHex(0x9955ff);
      fillLight.intensity = 2.0;
      rimLight.color.setHex(0x00ffcc);
      rimLight.intensity = 3.0;
      scene.background.setHex(0x0a0e1a);
    }
  }, [lightPreset]);

  // Zoom controls
  const handleZoom = (direction) => {
    if (!cameraRef.current) return;
    const delta = direction === 'in' ? -1 : 1;
    cameraRef.current.position.z = Math.max(3.5, Math.min(14, cameraRef.current.position.z + delta));
  };

  const handleReset = () => {
    if (!cameraRef.current || !modelGroupRef.current) return;
    cameraRef.current.position.set(0, 3, 7.5);
    modelGroupRef.current.rotation.set(0, 0, 0);
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-700/60 shadow-2xl bg-[#0f172a] group select-none">
      {/* 3D Canvas Container */}
      <div
        ref={containerRef}
        style={{ height }}
        className="w-full cursor-grab active:cursor-grabbing"
      />

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm text-white">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold tracking-wide">Đang dựng mô hình 3D cổ vật...</span>
          </div>
        </div>
      )}

      {/* Model Title Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold/20 text-gold border border-gold/40 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5" /> Không Gian Khám Phá 3D
        </span>
        {artifactInfo && (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white backdrop-blur-md border border-white/20">
            {artifactInfo.name}
          </span>
        )}
      </div>

      {/* Controls Overlay */}
      {showControls && (
        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/80 backdrop-blur-md p-1.5 rounded-xl border border-white/10 shadow-lg">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              title={autoRotate ? 'Dừng xoay tự động' : 'Bật xoay tự động'}
              className={`p-2 rounded-lg text-xs font-medium transition ${
                autoRotate ? 'bg-gold text-slate-900 font-bold' : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setWireframe(!wireframe)}
              title="Khung dây / Khối đặc"
              className={`p-2 rounded-lg text-xs font-medium transition ${
                wireframe ? 'bg-blue-500 text-white font-bold' : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              <Box className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom('in')}
              title="Phóng to"
              className="p-2 rounded-lg text-slate-300 hover:bg-white/10 transition"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleZoom('out')}
              title="Thu nhỏ"
              className="p-2 rounded-lg text-slate-300 hover:bg-white/10 transition"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleReset}
              title="Góc nhìn mặc định"
              className="px-2.5 py-1 text-xs text-slate-300 hover:bg-white/10 rounded-lg transition font-medium"
            >
              Đặt lại
            </button>
          </div>

          {/* Lighting Mode Selector */}
          <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-900/80 backdrop-blur-md p-1.5 rounded-xl border border-white/10 shadow-lg">
            <Sun className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
            <select
              value={lightPreset}
              onChange={(e) => setLightPreset(e.target.value)}
              className="bg-transparent text-xs text-slate-200 outline-none pr-2 font-medium cursor-pointer"
            >
              <option value="museum" className="bg-slate-900 text-white">Ánh sáng Bảo tàng</option>
              <option value="sun" className="bg-slate-900 text-white">Ánh sáng Mặt trời</option>
              <option value="mystic" className="bg-slate-900 text-white">Huyền ảo Cổ đại</option>
            </select>
          </div>
        </div>
      )}

      {/* Interactive Helper Hint */}
      <div className="absolute top-4 right-4 z-10 pointer-events-none opacity-60 text-[11px] text-slate-300 flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-sm">
        <span>🖱️ Kéo để xoay 360° • Cuộn để phóng to</span>
      </div>
    </div>
  );
}

// ==========================================
// PROCEDURAL 3D ARTIFACT GENERATOR
// ==========================================
function buildArtifact(group, code) {
  // Clear previous
  while (group.children.length > 0) {
    group.remove(group.children[0]);
  }

  if (code === 'dong_son_drum') {
    buildDongSonDrum(group);
  } else if (code === 'borobudur_stupa') {
    buildBorobudurStupa(group);
  } else if (code === 'linga_yoni') {
    buildLingaYoni(group);
  } else if (code === 'vo_canh_stele') {
    buildVoCanhStele(group);
  } else if (code === 'that_luang') {
    buildThatLuang(group);
  } else {
    buildDongSonDrum(group);
  }
}

// 1. TRỐNG ĐỒNG ĐÔNG SƠN (NGỌC LŨ)
function buildDongSonDrum(group) {
  const bronzeMat = new THREE.MeshStandardMaterial({
    color: 0x8c6d3b,
    roughness: 0.35,
    metalness: 0.85
  });

  const darkBronzeMat = new THREE.MeshStandardMaterial({
    color: 0x5a4524,
    roughness: 0.5,
    metalness: 0.75
  });

  const goldDetailMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.25,
    metalness: 0.95
  });

  // Top Drumhead (Mặt trống)
  const headGeo = new THREE.CylinderGeometry(2.1, 2.05, 0.2, 64);
  const head = new THREE.Mesh(headGeo, bronzeMat);
  head.position.y = 1.0;
  head.castShadow = true;
  group.add(head);

  // Concentric Rings on Drumhead
  for (let r = 0.4; r <= 1.9; r += 0.28) {
    const ringGeo = new THREE.TorusGeometry(r, 0.018, 16, 64);
    const ring = new THREE.Mesh(ringGeo, goldDetailMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 1.105;
    group.add(ring);
  }

  // Center Star (Ngôi sao 14 cánh Ngọc Lũ)
  const starGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.03, 14);
  const star = new THREE.Mesh(starGeo, goldDetailMat);
  star.position.y = 1.11;
  group.add(star);

  // Drum Upper Flare (Tang trống phình rộng)
  const flareGeo = new THREE.CylinderGeometry(2.0, 1.45, 0.85, 64);
  const flare = new THREE.Mesh(flareGeo, bronzeMat);
  flare.position.y = 0.5;
  flare.castShadow = true;
  group.add(flare);

  // Drum Waist (Lưng trống thon)
  const waistGeo = new THREE.CylinderGeometry(1.45, 1.5, 0.9, 64);
  const waist = new THREE.Mesh(waistGeo, darkBronzeMat);
  waist.position.y = -0.35;
  waist.castShadow = true;
  group.add(waist);

  // Drum Foot (Chân đế loe)
  const footGeo = new THREE.CylinderGeometry(1.5, 2.05, 0.7, 64);
  const foot = new THREE.Mesh(footGeo, bronzeMat);
  foot.position.y = -1.1;
  foot.castShadow = true;
  group.add(foot);

  // Dual Arched Handles (Quai trống kép hình bím thừng)
  const handleGeo = new THREE.TorusGeometry(0.35, 0.07, 16, 32, Math.PI);
  
  const handle1 = new THREE.Mesh(handleGeo, bronzeMat);
  handle1.position.set(1.55, 0.15, 0);
  handle1.rotation.y = Math.PI / 2;
  handle1.rotation.z = Math.PI / 2;
  group.add(handle1);

  const handle2 = new THREE.Mesh(handleGeo, bronzeMat);
  handle2.position.set(-1.55, 0.15, 0);
  handle2.rotation.y = -Math.PI / 2;
  handle2.rotation.z = Math.PI / 2;
  group.add(handle2);
}

// 2. BẢO THÁP BOROBUDUR
function buildBorobudurStupa(group) {
  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0x5a5852,
    roughness: 0.9,
    metalness: 0.1
  });

  const carvedStoneMat = new THREE.MeshStandardMaterial({
    color: 0x484641,
    roughness: 0.85,
    metalness: 0.15
  });

  // 6 Stepped Square Terraces (Tầng vuông)
  const sizes = [3.4, 3.0, 2.6, 2.2, 1.8, 1.4];
  sizes.forEach((sz, i) => {
    const boxGeo = new THREE.BoxGeometry(sz, 0.22, sz);
    const box = new THREE.Mesh(boxGeo, i % 2 === 0 ? stoneMat : carvedStoneMat);
    box.position.y = -1.3 + i * 0.22;
    box.castShadow = true;
    box.receiveShadow = true;
    group.add(box);
  });

  // 3 Circular Upper Terraces (3 tầng tròn Vô sắc giới)
  const circularRadii = [1.15, 0.9, 0.65];
  circularRadii.forEach((r, i) => {
    const cylGeo = new THREE.CylinderGeometry(r, r + 0.08, 0.2, 32);
    const cyl = new THREE.Mesh(cylGeo, stoneMat);
    cyl.position.y = 0.1 + i * 0.22;
    cyl.castShadow = true;
    group.add(cyl);

    // Mini bell stupas around each circle
    const numStupas = 8 - i * 2;
    for (let s = 0; s < numStupas; s++) {
      const angle = (s / numStupas) * Math.PI * 2;
      const stupaGeo = new THREE.ConeGeometry(0.1, 0.22, 12);
      const miniStupa = new THREE.Mesh(stupaGeo, carvedStoneMat);
      miniStupa.position.set(
        Math.cos(angle) * (r - 0.08),
        0.2 + i * 0.22,
        Math.sin(angle) * (r - 0.08)
      );
      group.add(miniStupa);
    }
  });

  // Main Central Grand Stupa (Bảo tháp trung tâm tối thượng)
  const mainStupaBase = new THREE.CylinderGeometry(0.48, 0.52, 0.4, 32);
  const stupaBase = new THREE.Mesh(mainStupaBase, stoneMat);
  stupaBase.position.y = 0.95;
  group.add(stupaBase);

  const mainStupaDome = new THREE.SphereGeometry(0.48, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.6);
  const stupaDome = new THREE.Mesh(mainStupaDome, stoneMat);
  stupaDome.position.y = 1.05;
  group.add(stupaDome);

  const spireGeo = new THREE.CylinderGeometry(0.04, 0.12, 0.8, 16);
  const spire = new THREE.Mesh(spireGeo, stoneMat);
  spire.position.y = 1.7;
  group.add(spire);
}

// 3. ĐÀI THỜ LINGA - YONI CHAMPA
function buildLingaYoni(group) {
  const sandstoneMat = new THREE.MeshStandardMaterial({
    color: 0x8a725d,
    roughness: 0.8,
    metalness: 0.1
  });

  const darkSandstone = new THREE.MeshStandardMaterial({
    color: 0x6e5947,
    roughness: 0.85,
    metalness: 0.1
  });

  // Base Altar Pedestal (Bệ đài thờ giật cấp)
  const base1 = new THREE.BoxGeometry(2.8, 0.4, 2.8);
  const mBase1 = new THREE.Mesh(base1, sandstoneMat);
  mBase1.position.y = -1.2;
  mBase1.castShadow = true;
  group.add(mBase1);

  const base2 = new THREE.BoxGeometry(2.4, 0.35, 2.4);
  const mBase2 = new THREE.Mesh(base2, darkSandstone);
  mBase2.position.y = -0.85;
  group.add(mBase2);

  // Yoni Tray (Phiến đá Yoni có rãnh thoát nước Somasutra)
  const yoniGeo = new THREE.BoxGeometry(2.1, 0.3, 2.1);
  const yoni = new THREE.Mesh(yoniGeo, sandstoneMat);
  yoni.position.y = -0.55;
  group.add(yoni);

  // Somasutra Spout (Vòi dẫn nước thiêng kéo dài)
  const spoutGeo = new THREE.BoxGeometry(0.5, 0.25, 0.9);
  const spout = new THREE.Mesh(spoutGeo, sandstoneMat);
  spout.position.set(0, -0.55, 1.4);
  group.add(spout);

  // Linga Bottom (Phần vuông thờ Brahma)
  const lingaBrahma = new THREE.BoxGeometry(0.8, 0.45, 0.8);
  const mBrahma = new THREE.Mesh(lingaBrahma, darkSandstone);
  mBrahma.position.y = -0.2;
  group.add(mBrahma);

  // Linga Middle (Phần bát giác thờ Vishnu)
  const lingaVishnu = new THREE.CylinderGeometry(0.42, 0.42, 0.45, 8);
  const mVishnu = new THREE.Mesh(lingaVishnu, sandstoneMat);
  mVishnu.position.y = 0.25;
  group.add(mVishnu);

  // Linga Top (Phần tròn đầu vòm thờ Shiva)
  const lingaShiva = new THREE.CylinderGeometry(0.4, 0.4, 0.65, 32);
  const mShiva = new THREE.Mesh(lingaShiva, sandstoneMat);
  mShiva.position.y = 0.75;
  group.add(mShiva);

  const lingaDome = new THREE.SphereGeometry(0.4, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
  const mDome = new THREE.Mesh(lingaDome, sandstoneMat);
  mDome.position.y = 1.07;
  group.add(mDome);
}

// 4. BIA ĐÁ VÕ CẠNH
function buildVoCanhStele(group) {
  const basaltMat = new THREE.MeshStandardMaterial({
    color: 0x484846,
    roughness: 0.92,
    metalness: 0.08
  });

  const inscripMat = new THREE.MeshStandardMaterial({
    color: 0x2e2e2c,
    roughness: 0.8,
    metalness: 0.15
  });

  // Base Rock
  const rockBase = new THREE.CylinderGeometry(1.6, 1.8, 0.45, 7);
  const mRock = new THREE.Mesh(rockBase, basaltMat);
  mRock.position.y = -1.2;
  group.add(mRock);

  // 3-Sided Natural Monolith Stele (Khối đá 3 cạnh bazan)
  const steleGeo = new THREE.CylinderGeometry(0.7, 0.95, 2.4, 3);
  const stele = new THREE.Mesh(steleGeo, basaltMat);
  stele.position.y = 0.2;
  stele.rotation.y = Math.PI / 6;
  stele.castShadow = true;
  group.add(stele);

  // Engraved Sanskrit Inscription Bands
  for (let y = -0.5; y <= 0.9; y += 0.22) {
    const lineGeo = new THREE.BoxGeometry(0.75, 0.04, 0.04);
    const line = new THREE.Mesh(lineGeo, inscripMat);
    line.position.set(0, y, 0.5);
    group.add(line);
  }
}

// 5. ĐẠI THÁP THẠT LUỔNG (LÀO)
function buildThatLuang(group) {
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.25,
    metalness: 0.9
  });

  const redGoldBaseMat = new THREE.MeshStandardMaterial({
    color: 0x8a6021,
    roughness: 0.5,
    metalness: 0.6
  });

  // Square Multi-Tiered Pedestal Base
  const baseSizes = [3.2, 2.7, 2.2, 1.8];
  baseSizes.forEach((sz, idx) => {
    const bGeo = new THREE.BoxGeometry(sz, 0.22, sz);
    const bMesh = new THREE.Mesh(bGeo, idx === 0 ? redGoldBaseMat : goldMat);
    bMesh.position.y = -1.2 + idx * 0.22;
    bMesh.castShadow = true;
    group.add(bMesh);
  });

  // Surrounding 30 Small Stupas
  for (let s = 0; s < 12; s++) {
    const angle = (s / 12) * Math.PI * 2;
    const miniGeo = new THREE.ConeGeometry(0.08, 0.35, 12);
    const mini = new THREE.Mesh(miniGeo, goldMat);
    mini.position.set(Math.cos(angle) * 1.05, -0.4, Math.sin(angle) * 1.05);
    group.add(mini);
  }

  // Bell-shaped Gourde Main Stupa Body (Hình nậm rượu)
  const bellGeo = new THREE.CylinderGeometry(0.45, 0.85, 0.9, 32);
  const bell = new THREE.Mesh(bellGeo, goldMat);
  bell.position.y = 0.15;
  bell.castShadow = true;
  group.add(bell);

  // Soaring Spire (Chóp tháp búp sen vút cao)
  const spireGeo = new THREE.ConeGeometry(0.45, 1.6, 32);
  const spire = new THREE.Mesh(spireGeo, goldMat);
  spire.position.y = 1.35;
  spire.castShadow = true;
  group.add(spire);

  // Top Finial
  const topGeo = new THREE.SphereGeometry(0.08, 16, 16);
  const top = new THREE.Mesh(topGeo, goldMat);
  top.position.y = 2.2;
  group.add(top);
}

