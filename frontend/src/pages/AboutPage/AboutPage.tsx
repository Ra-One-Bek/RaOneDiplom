import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Html, MeshReflectorMaterial, Text } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import Header from "../../components/layout/Header";
import TshirtModel from "../../components/ui/TshirtModel";

const SCROLL_PAGES = 4.5;

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

const range = (progress: number, start: number, end: number) =>
  clamp((progress - start) / (end - start));

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function SceneCamera({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree();
  const lookAtRef = useRef(new THREE.Vector3(0, 1, 0));

  useFrame(() => {
    let targetPosition = new THREE.Vector3(0, 1.2, 8);
    let targetLookAt = new THREE.Vector3(0, 0.8, 0);

    const p1 = range(scrollProgress, 0.0, 0.28);
    const p2 = range(scrollProgress, 0.28, 0.58);
    const p3 = range(scrollProgress, 0.58, 0.82);
    const p4 = range(scrollProgress, 0.82, 1.0);

    if (scrollProgress <= 0.28) {
      targetPosition = new THREE.Vector3(
        lerp(0, 0.5, p1),
        lerp(1.2, 1.0, p1),
        lerp(8, 4.6, p1)
      );
      targetLookAt = new THREE.Vector3(
        lerp(0, 0.2, p1),
        lerp(0.8, 1.0, p1),
        0
      );
    } else if (scrollProgress <= 0.58) {
      targetPosition = new THREE.Vector3(
        lerp(0.5, -4.2, p2),
        lerp(1.0, 1.8, p2),
        lerp(4.6, 3.9, p2)
      );
      targetLookAt = new THREE.Vector3(
        lerp(0.2, -0.6, p2),
        lerp(1.0, 1.2, p2),
        0
      );
    } else if (scrollProgress <= 0.82) {
      targetPosition = new THREE.Vector3(
        lerp(-4.2, 2.8, p3),
        lerp(1.8, 4.4, p3),
        lerp(3.9, 5.4, p3)
      );
      targetLookAt = new THREE.Vector3(
        lerp(-0.6, 0.4, p3),
        lerp(1.2, 1.9, p3),
        lerp(0, -1.2, p3)
      );
    } else {
      targetPosition = new THREE.Vector3(
        lerp(2.8, 0, p4),
        lerp(4.4, 2.2, p4),
        lerp(5.4, 7.5, p4)
      );
      targetLookAt = new THREE.Vector3(
        lerp(0.4, 0, p4),
        lerp(1.9, 1.0, p4),
        lerp(-1.2, 0, p4)
      );
    }

    camera.position.x += (targetPosition.x - camera.position.x) * 0.045;
    camera.position.y += (targetPosition.y - camera.position.y) * 0.045;
    camera.position.z += (targetPosition.z - camera.position.z) * 0.045;

    lookAtRef.current.x += (targetLookAt.x - lookAtRef.current.x) * 0.05;
    lookAtRef.current.y += (targetLookAt.y - lookAtRef.current.y) * 0.05;
    lookAtRef.current.z += (targetLookAt.z - lookAtRef.current.z) * 0.05;

    camera.lookAt(lookAtRef.current);
  });

  return null;
}

function Atmosphere() {
  const particles = useMemo(() => {
    return Array.from({ length: 70 }, () => ({
      position: [
        THREE.MathUtils.randFloatSpread(20),
        THREE.MathUtils.randFloat(0.5, 8),
        THREE.MathUtils.randFloatSpread(20),
      ] as [number, number, number],
      scale: THREE.MathUtils.randFloat(0.03, 0.12),
    }));
  }, []);

  return (
    <>
      {particles.map((item, index) => (
        <mesh key={index} position={item.position}>
          <sphereGeometry args={[item.scale, 10, 10]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.16} />
        </mesh>
      ))}
    </>
  );
}

function Runway() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.15, 0]}>
        <planeGeometry args={[60, 60]} />
        <MeshReflectorMaterial
          blur={[300, 60]}
          resolution={1024}
          mixBlur={1}
          mixStrength={18}
          roughness={0.85}
          depthScale={0.8}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0c0c12"
          metalness={0.35}
        />
      </mesh>

      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[1.6, 1.9, 0.28, 64]} />
        <meshStandardMaterial color="#15151d" metalness={0.65} roughness={0.3} />
      </mesh>

      <mesh position={[0, -0.18, 0]}>
        <torusGeometry args={[2.15, 0.04, 16, 100]} />
        <meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={1.4} />
      </mesh>
    </>
  );
}

function LightColumns() {
  const columns = [
    [-5, 1.8, -2],
    [-3.5, 2.2, 2],
    [3.5, 2.2, 1.5],
    [5, 1.8, -1.5],
  ] as const;

  return (
    <>
      {columns.map((pos, index) => (
        <group key={index} position={pos}>
          <mesh>
            <boxGeometry args={[0.08, 4.4, 0.08]} />
            <meshStandardMaterial
              color="#f9a8d4"
              emissive="#ec4899"
              emissiveIntensity={1.5}
              transparent
              opacity={0.9}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

function FashionTitles({ scrollProgress }: { scrollProgress: number }) {
  const introOpacity = 1 - range(scrollProgress, 0.18, 0.32);
  const midOpacity = range(scrollProgress, 0.34, 0.46) * (1 - range(scrollProgress, 0.56, 0.68));
  const endOpacity = range(scrollProgress, 0.72, 0.88);

  return (
    <>
      <Text
        position={[0, 3.1, -3]}
        fontSize={0.42}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fillOpacity={introOpacity}
      >
        RAONE
      </Text>

      <Text
        position={[-3.8, 2.8, 0.5]}
        rotation={[0, 0.32, 0]}
        fontSize={0.22}
        color="#f9a8d4"
        anchorX="left"
        anchorY="middle"
        fillOpacity={midOpacity}
        maxWidth={3.4}
      >
        3D fashion experience
      </Text>

      <Text
        position={[0, 4.6, -0.8]}
        fontSize={0.24}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fillOpacity={endOpacity}
        maxWidth={4.5}
      >
        style • fitting • intelligence
      </Text>
    </>
  );
}

function HeroShirt({ scrollProgress }: { scrollProgress: number }) {
  const groupRef = useRef<THREE.Group | null>(null);

  useFrame(() => {
    if (!groupRef.current) return;

    const floatY = Math.sin(performance.now() * 0.0012) * 0.08;
    const targetY = 0.55 + floatY + scrollProgress * 0.18;
    const targetRotY = 0.2 + scrollProgress * Math.PI * 0.95;
    const targetRotX = 0.04 + scrollProgress * 0.18;

    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.045;
    groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.05;
  });

  return (
    <group ref={groupRef} position={[0, 0.55, 0]}>
      <Float speed={1.1} rotationIntensity={0.15} floatIntensity={0.22}>
        <Suspense fallback={null}>
          <TshirtModel scrollProgress={0} />
        </Suspense>
      </Float>
    </group>
  );
}

function SceneWorld({ scrollProgress }: { scrollProgress: number }) {
  return (
    <>
      <fog attach="fog" args={["#07070a", 8, 22]} />
      <color attach="background" args={["#050507"]} />

      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 7, 5]} intensity={2.1} color="#ffffff" />
      <directionalLight position={[-5, 4, 3]} intensity={1.4} color="#fbcfe8" />
      <spotLight
        position={[0, 8, 2]}
        angle={0.28}
        penumbra={0.9}
        intensity={26}
        color="#ffffff"
        castShadow
      />

      <SceneCamera scrollProgress={scrollProgress} />
      <Atmosphere />
      <Runway />
      <LightColumns />
      <FashionTitles scrollProgress={scrollProgress} />
      <HeroShirt scrollProgress={scrollProgress} />
    </>
  );
}

function OverlayCopy({ scrollProgress }: { scrollProgress: number }) {
  const introOpacity = 1 - range(scrollProgress, 0.2, 0.34);
  const secondOpacity = range(scrollProgress, 0.26, 0.4) * (1 - range(scrollProgress, 0.52, 0.66));
  const thirdOpacity = range(scrollProgress, 0.58, 0.72) * (1 - range(scrollProgress, 0.82, 0.92));
  const finalOpacity = range(scrollProgress, 0.84, 0.96);

  return (
    <div className="pointer-events-none fixed inset-0 z-20 text-white">
      <div className="relative h-full w-full">
        <div
          className="absolute left-6 top-24 max-w-xl transition-opacity duration-500 md:left-12 md:top-28"
          style={{ opacity: introOpacity }}
        >
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-pink-400">
            About RAONE
          </p>
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            Не просто магазин.
            <br />
            Сцена, в которой движется стиль.
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-neutral-300 md:text-base">
            Скролл ведёт пользователя по пространству бренда: объект, свет,
            движение камеры и атмосфера становятся частью истории.
          </p>
        </div>

        <div
          className="absolute bottom-24 left-6 max-w-sm transition-opacity duration-500 md:bottom-28 md:left-12"
          style={{ opacity: secondOpacity }}
        >
          <p className="mb-2 text-xs uppercase tracking-[0.35em] text-pink-300">
            01 / Product focus
          </p>
          <p className="text-sm leading-7 text-neutral-200 md:text-base">
            Одежда подаётся как главный герой кадра — с мягким светом, подиумом
            и плавным маршрутом камеры.
          </p>
        </div>

        <div
          className="absolute right-6 top-28 max-w-sm text-right transition-opacity duration-500 md:right-12"
          style={{ opacity: thirdOpacity }}
        >
          <p className="mb-2 text-xs uppercase tracking-[0.35em] text-pink-300">
            02 / Virtual experience
          </p>
          <p className="text-sm leading-7 text-neutral-200 md:text-base">
            Виртуальная примерка, визуализация образа и атмосфера fashion-space
            объединяются в единый интерфейс.
          </p>
        </div>

        <div
          className="absolute bottom-20 left-1/2 w-[min(92vw,720px)] -translate-x-1/2 text-center transition-opacity duration-500"
          style={{ opacity: finalOpacity }}
        >
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-pink-400">
            03 / Future
          </p>
          <h2 className="text-3xl font-semibold md:text-5xl">
            3D fashion platform with cinematic storytelling
          </h2>
          <p className="mt-4 text-sm leading-7 text-neutral-300 md:text-base">
            RAONE показывает одежду не как статичный каталог, а как пространство,
            в котором пользователь движется взглядом и скроллом.
          </p>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.35em] text-white/45">
          scroll to move
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
      setScrollProgress(clamp(progress));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative bg-black">
      <div className="fixed inset-x-0 top-0 z-30">
        <Header />
      </div>

      <div className="fixed inset-0 z-0">
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{ position: [0, 1.2, 8], fov: 42 }}
        >
          <SceneWorld scrollProgress={scrollProgress} />
        </Canvas>
      </div>

      <OverlayCopy scrollProgress={scrollProgress} />

      <main className="relative z-10" style={{ height: `${SCROLL_PAGES * 100}vh` }}>
        <section className="h-screen" />
        <section className="h-screen" />
        <section className="h-screen" />
        <section className="h-screen" />
        <section className="h-[50vh]" />
      </main>
    </div>
  );
}