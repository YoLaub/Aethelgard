// src/components/Island3D.jsx
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles, Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { makeNoise2D } from 'open-simplex-noise';

// Interpolation linéaire entre deux couleurs hex
const lerpColor = (a, b, t) => {
  const ca = new THREE.Color(a);
  return '#' + ca.lerp(new THREE.Color(b), Math.max(0, Math.min(1, t))).getHexString();
};

// --- FLAMME : trois cônes animés qui scintillent ---
const Flame = ({ position, scale = 1 }) => {
  const r1 = useRef(), r2 = useRef(), r3 = useRef(), rLight = useRef();

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (r1.current) {
      r1.current.scale.y  = 0.8 + Math.sin(t * 8.3)          * 0.35;
      r1.current.scale.x  = 0.9 + Math.sin(t * 6.1)          * 0.15;
      r1.current.rotation.y = t * 1.2;
    }
    if (r2.current) {
      r2.current.scale.y  = 0.6 + Math.sin(t * 11.7 + 1.0)   * 0.4;
      r2.current.scale.x  = 0.7 + Math.sin(t *  7.3 + 0.5)   * 0.2;
      r2.current.rotation.y = -t * 0.9;
    }
    if (r3.current) {
      r3.current.scale.y  = 0.5 + Math.sin(t *  9.1 + 2.0)   * 0.3;
      r3.current.scale.x  = 0.6 + Math.cos(t *  5.5 + 1.5)   * 0.15;
    }
    if (rLight.current) {
      rLight.current.intensity = 0.9 + Math.sin(t * 7.2) * 0.5;
    }
  });

  return (
    <group position={position} scale={scale}>
      {/* Base orange */}
      <mesh ref={r1} position={[0, 0.3, 0]}>
        <coneGeometry args={[0.20, 0.60, 6]} />
        <meshStandardMaterial color="#ff6600" emissive="#ff4400" emissiveIntensity={2.5} transparent opacity={0.92} depthWrite={false} />
      </mesh>
      {/* Milieu orange clair */}
      <mesh ref={r2} position={[0.05, 0.55, 0.05]}>
        <coneGeometry args={[0.12, 0.50, 5]} />
        <meshStandardMaterial color="#ff9900" emissive="#ff7700" emissiveIntensity={3.0} transparent opacity={0.82} depthWrite={false} />
      </mesh>
      {/* Pointe jaune */}
      <mesh ref={r3} position={[-0.04, 0.72, -0.04]}>
        <coneGeometry args={[0.07, 0.35, 5]} />
        <meshStandardMaterial color="#ffdd00" emissive="#ffaa00" emissiveIntensity={3.5} transparent opacity={0.70} depthWrite={false} />
      </mesh>
      <pointLight ref={rLight} color="#ff6600" intensity={1.0} distance={4} />
    </group>
  );
};

// --- ARBRE : double couche de feuillage, réagit à bio et thermal ---
const Tree = ({ position, scale, bio, thermal }) => {
  const isDead     = bio < 15;
  const isDying    = bio < 40;
  const isBurning  = thermal > 75;
  const isScorched = thermal > 85;   // feuillage consumé

  // Couleur du feuillage : chaleur brûle la couleur vers le brun/noir
  const foliage = isScorched ? '#1a0f00'
    : isBurning  ? '#4a2a08'
    : isDead     ? '#2d2a1a'
    : isDying    ? '#3d6b30'
    : '#065f46';

  const showFoliage = !isDead && !isScorched;
  return (
    <group position={position} scale={scale}>
      {/* Tronc */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.13, 1, 6]} />
        <meshStandardMaterial color={isScorched ? '#1a0800' : '#4a3b2c'} roughness={0.9} />
      </mesh>

      {showFoliage && (
        <>
          <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
            <coneGeometry args={[0.55, 1.5, 7]} />
            <meshStandardMaterial color={foliage} roughness={0.8} />
          </mesh>
          <mesh position={[0, 1.75, 0]} castShadow receiveShadow>
            <coneGeometry args={[0.37, 1.1, 7]} />
            <meshStandardMaterial color={foliage} roughness={0.75} />
          </mesh>
        </>
      )}

      {/* Flammes sur le feuillage */}
      {isBurning && <Flame position={[0, 1.1, 0]}  scale={0.9} />}
      {isBurning && <Flame position={[0.15, 1.55, 0.1]} scale={0.6} />}
      {isScorched && <Flame position={[0, 0.9, 0]} scale={1.1} />}
    </group>
  );
};

// --- CRISTAL : cluster de 4 éclats, octahedron detail=1, animation flottante ---
const CrystalShard = ({ position, rotation, scale, intensity }) => (
  <mesh position={position} rotation={rotation} scale={scale} castShadow>
    <octahedronGeometry args={[0.7, 1]} />
    <meshStandardMaterial
      color="#818cf8"
      emissive="#6366f1"
      emissiveIntensity={intensity}
      roughness={0.05}
      metalness={0.85}
      transparent
      opacity={0.88}
    />
  </mesh>
);

const Crystal = ({ position, manaLevel }) => {
  const groupRef = useRef();
  const baseY = position[1];

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.007;
    groupRef.current.position.y = baseY + Math.sin(clock.elapsedTime * 1.8) * 0.08;
  });

  const scale     = Math.max(0.15, manaLevel / 50);
  const intensity = manaLevel / 20;

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Éclat principal */}
      <CrystalShard position={[0, 0, 0]}       rotation={[0, 0, 0]}          scale={1}    intensity={intensity} />
      {/* Satellites */}
      <CrystalShard position={[0.55, 0.2, 0.1]}  rotation={[0.4,  0.3,  0.2]} scale={0.55} intensity={intensity * 0.8} />
      <CrystalShard position={[-0.45, 0.1, 0.3]} rotation={[-0.3, 0.7, -0.2]} scale={0.45} intensity={intensity * 0.7} />
      <CrystalShard position={[0.15, 0.35, -0.5]} rotation={[0.5, -0.4,  0.4]} scale={0.4}  intensity={intensity * 0.6} />
      {manaLevel > 50 && (
        <pointLight color="#818cf8" intensity={intensity * 2} distance={6} />
      )}
    </group>
  );
};

// --- TRÔNE ---
const Throne = ({ position, scale }) => {
  const { scene } = useGLTF('/siege.glb');
  return <primitive object={scene} position={position} scale={scale} rotation={[0, Math.PI, 0]} castShadow />;
};

// --- DALLE HEXAGONALE : couleur réactive aux jauges bio / thermal ---
const Tile = ({ x, z, height, terrainType, tileRadius, bio, thermal, isDenseForest }) => {
  const tileHeight = height > 0 ? height : 0.2;
  const riverDepth = 0.3;

  const hexGeometry = useMemo(
    () => new THREE.CylinderGeometry(tileRadius, tileRadius, tileHeight, 6),
    [tileRadius, tileHeight]
  );

  let color, emissiveColor = '#000000', emissiveIntensity = 0;

  if (terrainType === 'herbe') {
    const bioColor  = isDenseForest
      ? lerpColor('#1a3a12', '#0a5c35', bio / 100)
      : lerpColor('#6b4226', '#10b981', bio / 100);
    // thermal > 60 : le terrain brunit / se craquelle vers le brun-noir
    const heatT = Math.max(0, (thermal - 60) / 40);
    color = lerpColor(bioColor, '#3d1a00', heatT);
  } else if (terrainType === 'roche') {
    color = '#4b5563';
  } else if (terrainType === 'rivière') {
    // thermal chaud = reflet turquoise, froid = bleu vif
    const t = Math.max(0, (thermal - 50) / 50);
    color = lerpColor('#0ea5e9', '#0e9f8a', t);
    emissiveColor = '#0284c7';
    emissiveIntensity = 0.2 + (thermal / 100) * 0.4;
  } else if (terrainType === 'canyon') {
    color = '#1e293b';
  }

  return (
    <group position={[x, terrainType === 'rivière' ? -riverDepth / 2 : tileHeight / 2, z]}>
      <mesh geometry={hexGeometry} castShadow receiveShadow>
        <meshStandardMaterial color={color} roughness={0.8} emissive={emissiveColor} emissiveIntensity={emissiveIntensity} />
      </mesh>
      {terrainType === 'canyon' && (
        <mesh position={[0, -5, 0]}>
          <coneGeometry args={[tileRadius * 1.5, 10, 6, 1]} />
          <meshStandardMaterial color="#0f172a" roughness={1} />
        </mesh>
      )}
    </group>
  );
};

// --- UTILITAIRE ---
const pseudoRandom = (x, z) => {
  const n = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453123;
  return n - Math.floor(n);
};

// --- ORBE DE CHAOS : une sphère qui se déplace de façon erratique ---
const ChaosOrb = ({ seed, chaos, psyche }) => {
  const ref = useRef();

  // Paramètres uniques à cet orbe, stables entre les renders
  const params = useMemo(() => ({
    radius:  3 + (seed % 7),
    speed:   0.4 + (seed % 5) * 0.18,
    yBase:   0.5 + (seed % 4) * 0.6,
    phase:   seed * 1.37,
    freqX:   0.7 + (seed % 3) * 0.4,
    freqZ:   0.9 + (seed % 4) * 0.3,
    freqY:   1.1 + (seed % 5) * 0.25,
  }), [seed]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t     = clock.elapsedTime * params.speed + params.phase;
    // Intensité de l'errance : chaos élevé + psyche basse = mouvement amplifié
    const frenzy = 1 + (chaos / 5) + Math.max(0, (50 - psyche) / 20);

    ref.current.position.x = Math.sin(t * params.freqX) * params.radius * frenzy * 0.5
                            + Math.cos(t * params.freqZ * 1.3) * 1.2 * frenzy;
    ref.current.position.z = Math.cos(t * params.freqZ) * params.radius * frenzy * 0.5
                            + Math.sin(t * params.freqX * 0.7) * 1.5 * frenzy;
    ref.current.position.y = params.yBase
                            + Math.sin(t * params.freqY) * 1.2 * frenzy
                            + Math.abs(Math.sin(t * 2.3)) * 0.8;

    // Pulsation de la lumière
    const pulse = 0.5 + Math.sin(t * 4.1 + params.phase) * 0.5;
    ref.current.children[1].intensity = (1 + chaos / 5) * pulse * Math.max(0.2, (100 - psyche) / 60);
  });

  const baseIntensity = (chaos / 10) * Math.max(0.1, (100 - psyche) / 80);

  return (
    <group ref={ref}>
      {/* Sphère émissive rouge */}
      <mesh castShadow>
        <sphereGeometry args={[0.18 + (chaos / 200), 8, 8]} />
        <meshStandardMaterial
          color="#ff2020"
          emissive="#ff0000"
          emissiveIntensity={baseIntensity * 3}
          roughness={0.1}
          metalness={0.3}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Lumière ponctuelle portée par l'orbe */}
      <pointLight color="#ff3300" intensity={baseIntensity * 2} distance={5} />
    </group>
  );
};

// Conteneur : spawne N orbes selon chaos + psyche
const ChaosOrbs = ({ chaos, psyche }) => {
  // Apparaissent à partir de psyche < 70 ou chaos > 3
  const count = useMemo(() => {
    const fromPsyche = Math.max(0, Math.floor((70 - psyche) / 12));
    const fromChaos  = Math.max(0, Math.floor((chaos - 3) / 1.5));
    return Math.min(8, fromPsyche + fromChaos);
  }, [chaos, psyche]);

  if (count === 0) return null;

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <ChaosOrb key={i} seed={i * 17 + 3} chaos={chaos} psyche={psyche} />
      ))}
    </>
  );
};

// --- ÉCLAIRAGE DYNAMIQUE : réagit à thermal et psyche ---
const SceneLighting = ({ thermal, psyche }) => {
  const thermalT      = thermal / 100;
  const ambientColor  = thermalT > 0.7 ? '#ffb870' : thermalT < 0.3 ? '#a8d8f0' : '#ffffff';
  const ambientInt    = 0.1 + (psyche / 100) * 0.25;

  return (
    <>
      <ambientLight color={ambientColor} intensity={ambientInt} />
      <directionalLight position={[10, 15, 5]} intensity={1.8} castShadow shadow-mapSize={[2048, 2048]} />
    </>
  );
};

// --- CARTE PROCÉDURALE ---
const ProceduralMap = ({ state }) => {
  const mapRadius  = 7;
  const tileRadius = 0.75;

  const mapData = useMemo(() => {
    const noise2D     = makeNoise2D(12345);
    const forestNoise = makeNoise2D(54321); // couche de densité forestière
    const tiles       = [];
    const highPoints  = [];

    for (let q = -mapRadius; q <= mapRadius; q++) {
      const r1 = Math.max(-mapRadius, -q - mapRadius);
      const r2 = Math.min(mapRadius,  -q + mapRadius);
      for (let r = r1; r <= r2; r++) {
        const x      = tileRadius * Math.sqrt(3) * (q + r / 2);
        const z      = tileRadius * (3 / 2) * r;
        const height = noise2D(x * 0.1, z * 0.1) * 2 + 1;
        tiles.push({
          q, r, x, z, height,
          terrainType: '',
          hasTree: false,  treeOffsetX: 0, treeOffsetZ: 0, treeScale: 1,
          hasTree2: false, tree2OffsetX: 0, tree2OffsetZ: 0, tree2Scale: 1,
          hasTree3: false, tree3OffsetX: 0, tree3OffsetZ: 0, tree3Scale: 1,
          hasCrystal: false, isDenseForest: false,
        });
        highPoints.push({ x, z, height });
      }
    }

    highPoints.sort((a, b) => b.height - a.height);
    const highestTile = tiles.find(t => t.x === highPoints[0].x && t.z === highPoints[0].z);

    const canyonPath  = [[-5, 0], [5, 0]];
    const canyonWidth = 2;

    tiles.forEach(tile => {
      const distToCanyon = Math.min(...canyonPath.map(p =>
        Math.sqrt((tile.x - p[0]) ** 2 + (tile.z - p[1]) ** 2)
      ));

      if (distToCanyon < canyonWidth) {
        tile.terrainType = 'canyon';
        tile.height = -1.5;
      } else if (tile.height < 0.2) {
        tile.terrainType = 'rivière';
        tile.height = -0.5;
      } else if (tile.height > 1.5) {
        tile.terrainType = 'roche';
        tile.hasCrystal  = pseudoRandom(tile.x, tile.z) < 0.2;
      } else {
        tile.terrainType = 'herbe';

        // Densité forestière : fréquence basse = grandes zones cohérentes
        const fDensity     = forestNoise(tile.x * 0.13, tile.z * 0.13);
        tile.isDenseForest = fDensity > 0.2;
        const isCorForest  = fDensity > 0.55; // cœur de forêt très dense
        const treeProb     = isCorForest ? 0.98 : tile.isDenseForest ? 0.90 : 0.38;

        tile.hasTree     = pseudoRandom(tile.x, tile.z + 1) < treeProb;
        tile.treeOffsetX = (pseudoRandom(tile.x + 2, tile.z)     - 0.5) * 0.42;
        tile.treeOffsetZ = (pseudoRandom(tile.x,     tile.z + 2) - 0.5) * 0.42;
        tile.treeScale   = isCorForest
          ? 0.32 + pseudoRandom(tile.x + 3, tile.z + 3) * 0.20
          : tile.isDenseForest
            ? 0.28 + pseudoRandom(tile.x + 3, tile.z + 3) * 0.18
            : 0.35 + pseudoRandom(tile.x + 3, tile.z + 3) * 0.25;

        // Deuxième arbre en zone dense
        if (tile.isDenseForest) {
          tile.hasTree2     = pseudoRandom(tile.x + 5, tile.z + 5) < 0.82;
          tile.tree2OffsetX = (pseudoRandom(tile.x + 6, tile.z)     - 0.5) * 0.38;
          tile.tree2OffsetZ = (pseudoRandom(tile.x,     tile.z + 6) - 0.5) * 0.38;
          tile.tree2Scale   = 0.24 + pseudoRandom(tile.x + 7, tile.z + 7) * 0.20;
        }

        // Troisième arbre uniquement dans le cœur de forêt
        if (isCorForest) {
          tile.hasTree3     = pseudoRandom(tile.x + 9, tile.z + 9) < 0.70;
          tile.tree3OffsetX = (pseudoRandom(tile.x + 10, tile.z)      - 0.5) * 0.30;
          tile.tree3OffsetZ = (pseudoRandom(tile.x,      tile.z + 10) - 0.5) * 0.30;
          tile.tree3Scale   = 0.20 + pseudoRandom(tile.x + 11, tile.z + 11) * 0.16;
        }
      }
    });

    highestTile.terrainType = 'roche';
    highestTile.height      = 3.5;
    highestTile.hasTree     = false;
    highestTile.hasCrystal  = false;

    return { tiles, highestTile };
  }, [mapRadius, tileRadius]);

  const floatSpeed = 0.5 + state.chaos / 10;

  return (
    <Float speed={floatSpeed} rotationIntensity={0.1} floatIntensity={0.3}>
      <group position={[0, -1.5, 0]}>

        {mapData.tiles.map((tile, i) => (
          <Tile
            key={`tile-${i}`}
            {...tile}
            tileRadius={tileRadius}
            bio={state.bio}
            thermal={state.thermal}
          />
        ))}

        <Throne
          position={[mapData.highestTile.x, mapData.highestTile.height + 0.1, mapData.highestTile.z]}
          scale={0.8}
        />

        {mapData.tiles.map((tile, i) => (
          <React.Fragment key={`decor-${i}`}>
            {tile.hasTree && (
              <Tree
                position={[tile.x + tile.treeOffsetX, tile.height, tile.z + tile.treeOffsetZ]}
                scale={tile.treeScale}
                bio={state.bio}
                thermal={state.thermal}
              />
            )}
            {tile.hasTree2 && (
              <Tree
                position={[tile.x + tile.tree2OffsetX, tile.height, tile.z + tile.tree2OffsetZ]}
                scale={tile.tree2Scale}
                bio={state.bio}
                thermal={state.thermal}
              />
            )}
            {tile.hasTree3 && (
              <Tree
                position={[tile.x + tile.tree3OffsetX, tile.height, tile.z + tile.tree3OffsetZ]}
                scale={tile.tree3Scale}
                bio={state.bio}
                thermal={state.thermal}
              />
            )}
            {tile.hasCrystal && state.mana > 15 && (
              <Crystal position={[tile.x, tile.height + 0.5, tile.z]} manaLevel={state.mana} />
            )}
          </React.Fragment>
        ))}

        {state.mana > 40 && (
          <Sparkles count={state.chaos * 10} scale={15} size={6} speed={0.4} color="#a5b4fc" />
        )}

        <ChaosOrbs chaos={state.chaos} psyche={state.psyche} />

      </group>
    </Float>
  );
};

// --- SCÈNE PRINCIPALE ---
export const Island3D = ({ state }) => {
  // psyche basse = brouillard dense
  const fogFar = state.psyche < 30 ? 38 : state.psyche < 60 ? 65 : 110;

  return (
    <div
      className="bg-[#020617] rounded-[2rem] border border-white/5 overflow-hidden cursor-move"
      style={{ width: '100%', height: '600px' }}
    >
      <Canvas camera={{ position: [0, 15, 20], fov: 45 }} shadows>
        <fog attach="fog" args={['#020617', 25, fogFar]} />
        <Environment files="/sky.hdr" />
        <SceneLighting thermal={state.thermal} psyche={state.psyche} />
        <ProceduralMap state={state} />
        <OrbitControls enableZoom={true} minDistance={10} maxDistance={35} maxPolarAngle={Math.PI / 2 + 0.1} />
      </Canvas>
    </div>
  );
};

useGLTF.preload('/siege.glb');
