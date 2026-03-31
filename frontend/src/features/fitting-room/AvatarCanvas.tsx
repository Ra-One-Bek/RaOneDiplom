import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { Group } from 'three';
import avatarModelUrl from '../../assets/models/avatar.glb?url';

interface AvatarModelProps {
  url: string;
}

const AvatarModel = ({ url }: AvatarModelProps) => {
  const { scene } = useGLTF(url);

  const clonedScene = useMemo(() => {
    return scene.clone() as Group;
  }, [scene]);

  return (
    <primitive
      object={clonedScene}
      position={[0, -1.9, 0]}
      scale={0.5}
    />
  );
};

const AvatarCanvas = () => {
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 9, 11], fov: 38 }}>
        <ambientLight intensity={1.1} />
        <hemisphereLight intensity={0.8} />
        <directionalLight position={[5, 8, 5]} intensity={1.4} />

        <Suspense fallback={null}>
          <AvatarModel url={avatarModelUrl} />
          <Environment preset="studio" />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={true}
          target={[0, 0.8, 0]}
          minPolarAngle={Math.PI / 2.15}
          maxPolarAngle={Math.PI / 1.9}
        />
      </Canvas>
    </div>
  );
};

useGLTF.preload(avatarModelUrl);

export default AvatarCanvas;