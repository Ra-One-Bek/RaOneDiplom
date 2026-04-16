import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Box3,
  Group,
  Material,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  SkinnedMesh,
  Vector3,
} from 'three';
import { SkeletonUtils } from 'three-stdlib';

import type { AvatarProfile } from '../../types/auth';
import type { FittingOutfit } from '../../services/storage/selectedProductStorage';

interface AvatarCanvasProps {
  avatarProfile?: AvatarProfile | null;
  outfit?: FittingOutfit;
}

const MORPH_NAMES = {
  asianMaleYoung: '$md-$as-$ma-$yn',
  caucasianMaleYoung: '$md-$ca-$ma-$yn',
  africanMaleYoung: '$md-$af-$ma-$yn',

  maleMaxMuscleAvgWeight: '$md-universal-$ma-$yn-max$mu-$av$wg',
  maleMaxMuscleAvgWeightMaxHeight: '$md-$ma-$yn-max$mu-$av$wg-max$hg',
  maleMaxMuscleMaxWeight: '$md-universal-$ma-$yn-max$mu-max$wg',
  maleMaxMuscleMaxWeightMaxHeight: '$md-$ma-$yn-max$mu-max$wg-max$hg',
  maleAvgMuscleAvgWeight: '$md-universal-$ma-$yn-$av$mu-$av$wg',

  maleMaxMuscleAvgWeightIdealProportions: '$md-$ma-$yn-max$mu-$av$wg-$id$pr',
  maleMaxMuscleMaxWeightIdealProportions: '$md-$ma-$yn-max$mu-max$wg-$id$pr',
  maleAvgMuscleAvgWeightIdealProportions: '$md-$ma-$yn-$av$mu-$av$wg-$id$pr',
} as const;

const skinPalette: Record<AvatarProfile['skinTone'], string> = {
  light: '#f1c7a3',
  medium: '#cf9871',
  dark: '#8d5d3f',
};

const AvatarCanvas = ({ avatarProfile, outfit }: AvatarCanvasProps) => {
  return (
    <Canvas camera={{ position: [0, 1.6, 4.8], fov: 32 }}>
      <color attach="background" args={['#f7f5f2']} />
      <ambientLight intensity={1.35} />
      <directionalLight position={[4.5, 6, 4]} intensity={1.65} />
      <directionalLight position={[-3, 4, -2]} intensity={0.75} />

      <Environment preset="city" />
      <OrbitControls
        enablePan={false}
        minDistance={2.8}
        maxDistance={7}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI / 1.9}
        target={[0, 1.2, 0]}
      />

      <group position={[0, -1.2, 0]}>
        <Floor />
        <AvatarModel avatarProfile={avatarProfile} outfit={outfit} />
      </group>
    </Canvas>
  );
};

const Floor = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
      <circleGeometry args={[3.9, 90]} />
      <meshStandardMaterial color="#ebe6df" roughness={0.94} />
    </mesh>
  );
};

const AvatarModel = ({
  avatarProfile,
  outfit,
}: {
  avatarProfile?: AvatarProfile | null;
  outfit?: FittingOutfit;
}) => {
  const profile = avatarProfile ?? {
    gender: 'male',
    build: 'medium',
    muscle: 'mid',
    heightPreset: 'medium',
    skinTone: 'medium',

    morphAsianMaleYoung: 0,
    morphCaucasianMaleYoung: 0,
    morphAfricanMaleYoung: 0,
    morphMaleMaxMuscleAvgWeight: 0,
    morphMaleMaxMuscleAvgWeightMaxHeight: 0,
    morphMaleMaxMuscleMaxWeight: 0,
    morphMaleMaxMuscleMaxWeightMaxHeight: 0,
    morphMaleAvgMuscleAvgWeight: 0,
    morphMaleMaxMuscleAvgWeightIdealProportions: 0,
    morphMaleMaxMuscleMaxWeightIdealProportions: 0,
    morphMaleAvgMuscleAvgWeightIdealProportions: 0,
  };

  const { scene } = useGLTF('/models/avatar.glb');
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  const avatarRootRef = useRef<Group>(null);
  const modelRef = useRef<Group>(null);

  const [fit, setFit] = useState({
    scale: 1,
    position: [0, 0, 0] as [number, number, number],
  });

  useLayoutEffect(() => {
    if (!modelRef.current) return;

    const box = new Box3().setFromObject(modelRef.current);
    const size = new Vector3();
    const center = new Vector3();

    box.getSize(size);
    box.getCenter(center);

    if (size.y <= 0 || !isFinite(size.y)) return;

    const targetHeight = 3.3;
    const scale = targetHeight / size.y;

    setFit({
      scale,
      position: [
        -center.x * scale,
        -box.min.y * scale,
        -center.z * scale,
      ],
    });
  }, [clonedScene]);

  useEffect(() => {
    if (!avatarRootRef.current) return;

    const meshesWithMorphs: Array<Mesh | SkinnedMesh> = [];
    const allMeshes: Array<Mesh | SkinnedMesh> = [];

    avatarRootRef.current.traverse((child: Object3D) => {
      if (child instanceof Mesh || child instanceof SkinnedMesh) {
        allMeshes.push(child);

        if (
          child.morphTargetDictionary &&
          child.morphTargetInfluences &&
          Object.keys(child.morphTargetDictionary).length > 0
        ) {
          meshesWithMorphs.push(child);
        }
      }
    });

    allMeshes.forEach((mesh) => {
      if (!Array.isArray(mesh.material)) {
        const nextMaterial = cloneAsStandardMaterial(mesh.material);
        nextMaterial.color.set(skinPalette[profile.skinTone]);
        nextMaterial.roughness = 0.9;
        nextMaterial.metalness = 0.02;
        mesh.material = nextMaterial;
      }

      // волосы и похожие части отключаем
      const meshName = mesh.name.toLowerCase();
      const shouldHide =
        meshName.includes('hair') ||
        meshName.includes('brow') ||
        meshName.includes('lash') ||
        meshName.includes('beard');

      if (shouldHide) {
        mesh.visible = false;
      }
    });

    const morphMap: Record<string, number> = {
      [MORPH_NAMES.asianMaleYoung]: profile.morphAsianMaleYoung,
      [MORPH_NAMES.caucasianMaleYoung]: profile.morphCaucasianMaleYoung,
      [MORPH_NAMES.africanMaleYoung]: profile.morphAfricanMaleYoung,

      [MORPH_NAMES.maleMaxMuscleAvgWeight]:
        profile.morphMaleMaxMuscleAvgWeight,
      [MORPH_NAMES.maleMaxMuscleAvgWeightMaxHeight]:
        profile.morphMaleMaxMuscleAvgWeightMaxHeight,
      [MORPH_NAMES.maleMaxMuscleMaxWeight]:
        profile.morphMaleMaxMuscleMaxWeight,
      [MORPH_NAMES.maleMaxMuscleMaxWeightMaxHeight]:
        profile.morphMaleMaxMuscleMaxWeightMaxHeight,
      [MORPH_NAMES.maleAvgMuscleAvgWeight]:
        profile.morphMaleAvgMuscleAvgWeight,

      [MORPH_NAMES.maleMaxMuscleAvgWeightIdealProportions]:
        profile.morphMaleMaxMuscleAvgWeightIdealProportions,
      [MORPH_NAMES.maleMaxMuscleMaxWeightIdealProportions]:
        profile.morphMaleMaxMuscleMaxWeightIdealProportions,
      [MORPH_NAMES.maleAvgMuscleAvgWeightIdealProportions]:
        profile.morphMaleAvgMuscleAvgWeightIdealProportions,
    };

    meshesWithMorphs.forEach((mesh) => {
      if (!mesh.morphTargetDictionary || !mesh.morphTargetInfluences) return;

      // Сначала сбрасываем все morph
      Object.keys(mesh.morphTargetDictionary).forEach((key) => {
        const index = mesh.morphTargetDictionary![key];
        mesh.morphTargetInfluences![index] = 0;
      });

      // Потом применяем наши значения
      Object.entries(morphMap).forEach(([morphName, value]) => {
        const index = findMorphIndex(mesh.morphTargetDictionary!, morphName);

        if (index !== undefined) {
          mesh.morphTargetInfluences![index] = value;
        }
      });
    });
  }, [
    clonedScene,
    profile.skinTone,
    profile.morphAsianMaleYoung,
    profile.morphCaucasianMaleYoung,
    profile.morphAfricanMaleYoung,
    profile.morphMaleMaxMuscleAvgWeight,
    profile.morphMaleMaxMuscleAvgWeightMaxHeight,
    profile.morphMaleMaxMuscleMaxWeight,
    profile.morphMaleMaxMuscleMaxWeightMaxHeight,
    profile.morphMaleAvgMuscleAvgWeight,
    profile.morphMaleMaxMuscleAvgWeightIdealProportions,
    profile.morphMaleMaxMuscleMaxWeightIdealProportions,
    profile.morphMaleAvgMuscleAvgWeightIdealProportions,
  ]);

  const topColor = getClothingColor(outfit?.top?.colors, '#1f2937');
  const bottomColor = getClothingColor(outfit?.bottom?.colors, '#4b5563');
  const outerwearColor = getClothingColor(outfit?.outerwear?.colors, '#6d28d9');
  const dressColor = getClothingColor(outfit?.dress?.colors, '#db2777');
  const footwearColor = getClothingColor(outfit?.footwear?.colors, '#111827');

  return (
    <group ref={avatarRootRef}>
      <group
        ref={modelRef}
        scale={fit.scale}
        position={fit.position}
        rotation={[0, Math.PI, 0]}
      >
        <primitive object={clonedScene} />
      </group>

      {outfit?.top && <TopOverlay color={topColor} />}
      {outfit?.bottom && !outfit?.dress && <BottomOverlay color={bottomColor} />}
      {outfit?.outerwear && !outfit?.dress && (
        <OuterwearOverlay color={outerwearColor} />
      )}
      {outfit?.dress && <DressOverlay color={dressColor} />}
      {outfit?.footwear && <FootwearOverlay color={footwearColor} />}
    </group>
  );
};

const cloneAsStandardMaterial = (material: Material) => {
  const cloned = material.clone();

  if (cloned instanceof MeshStandardMaterial) {
    return cloned;
  }

  return new MeshStandardMaterial({
    color: '#d1a07d',
    roughness: 0.9,
    metalness: 0.02,
  });
};

const TopOverlay = ({ color }: { color: string }) => {
  return (
    <group position={[0, 1.13, 0.09]}>
      <mesh position={[0, 0.38, 0]} scale={[0.88, 0.24, 0.46]}>
        <sphereGeometry args={[0.53, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.92} metalness={0.02} />
      </mesh>

      <mesh position={[0, 0.0, 0]} scale={[0.68, 0.8, 0.42]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} roughness={0.92} metalness={0.02} />
      </mesh>

      <mesh position={[-0.55, 0.04, 0]} rotation={[0, 0, 0.18]}>
        <capsuleGeometry args={[0.12, 0.48, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.92} metalness={0.02} />
      </mesh>

      <mesh position={[0.55, 0.04, 0]} rotation={[0, 0, -0.18]}>
        <capsuleGeometry args={[0.12, 0.48, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.92} metalness={0.02} />
      </mesh>
    </group>
  );
};

const OuterwearOverlay = ({ color }: { color: string }) => {
  return (
    <group position={[0, 1.12, 0.15]}>
      <mesh position={[0, 0.34, 0]} scale={[0.95, 0.28, 0.56]}>
        <sphereGeometry args={[0.56, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.96} metalness={0.01} />
      </mesh>

      <mesh position={[0, -0.06, 0]} scale={[0.8, 0.98, 0.52]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} roughness={0.96} metalness={0.01} />
      </mesh>

      <mesh position={[-0.6, -0.03, 0]} rotation={[0, 0, 0.15]}>
        <capsuleGeometry args={[0.14, 0.86, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.96} metalness={0.01} />
      </mesh>

      <mesh position={[0.6, -0.03, 0]} rotation={[0, 0, -0.15]}>
        <capsuleGeometry args={[0.14, 0.86, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.96} metalness={0.01} />
      </mesh>
    </group>
  );
};

const BottomOverlay = ({ color }: { color: string }) => {
  return (
    <group position={[0, -0.07, 0.07]}>
      <mesh position={[0, 0.02, 0]} scale={[0.74, 0.34, 0.46]}>
        <sphereGeometry args={[0.54, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.94} metalness={0.01} />
      </mesh>

      <mesh position={[-0.16, -0.55, 0]}>
        <capsuleGeometry args={[0.18, 0.92, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.94} metalness={0.01} />
      </mesh>

      <mesh position={[0.16, -0.55, 0]}>
        <capsuleGeometry args={[0.18, 0.92, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.94} metalness={0.01} />
      </mesh>

      <mesh position={[-0.16, -1.34, 0.02]}>
        <capsuleGeometry args={[0.135, 0.78, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.94} metalness={0.01} />
      </mesh>

      <mesh position={[0.16, -1.34, 0.02]}>
        <capsuleGeometry args={[0.135, 0.78, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.94} metalness={0.01} />
      </mesh>
    </group>
  );
};

const DressOverlay = ({ color }: { color: string }) => {
  return (
    <group position={[0, 0.98, 0.12]}>
      <mesh position={[0, 0.56, 0]} scale={[0.86, 0.3, 0.44]}>
        <sphereGeometry args={[0.52, 32, 32]} />
        <meshStandardMaterial color={color} roughness={0.93} metalness={0.01} />
      </mesh>

      <mesh position={[0, 0.18, 0]} scale={[0.68, 0.6, 0.44]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} roughness={0.93} metalness={0.01} />
      </mesh>

      <mesh position={[0, -1.0, 0]} scale={[0.78, 1.1, 0.7]}>
        <coneGeometry args={[0.78, 2.3, 42]} />
        <meshStandardMaterial color={color} roughness={0.93} metalness={0.01} />
      </mesh>
    </group>
  );
};

const FootwearOverlay = ({ color }: { color: string }) => {
  return (
    <group position={[0, -2.36, 0.16]}>
      <group position={[-0.18, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.36, 0.15, 0.7]} />
          <meshStandardMaterial color={color} roughness={0.82} metalness={0.02} />
        </mesh>
        <mesh position={[0.02, 0.03, 0.18]}>
          <sphereGeometry args={[0.15, 18, 18]} />
          <meshStandardMaterial color={color} roughness={0.82} metalness={0.02} />
        </mesh>
      </group>

      <group position={[0.18, 0, 0]}>
        <mesh>
          <boxGeometry args={[0.36, 0.15, 0.7]} />
          <meshStandardMaterial color={color} roughness={0.82} metalness={0.02} />
        </mesh>
        <mesh position={[0.02, 0.03, 0.18]}>
          <sphereGeometry args={[0.15, 18, 18]} />
          <meshStandardMaterial color={color} roughness={0.82} metalness={0.02} />
        </mesh>
      </group>
    </group>
  );
};

const findMorphIndex = (
  dictionary: Record<string, number>,
  targetName: string
) => {
  const targetNormalized = targetName.trim().toLowerCase();

  const exactKey = Object.keys(dictionary).find(
    (key) => key.trim().toLowerCase() === targetNormalized
  );

  if (exactKey) {
    return dictionary[exactKey];
  }

  const partialKey = Object.keys(dictionary).find((key) =>
    key.trim().toLowerCase().includes(targetNormalized)
  );

  if (partialKey) {
    return dictionary[partialKey];
  }

  return undefined;
};

const getClothingColor = (colors: string[] | undefined, fallback: string) => {
  if (!colors?.length) return fallback;

  switch (colors[0].toLowerCase()) {
    case 'black':
      return '#111827';
    case 'white':
      return '#f3f4f6';
    case 'gray':
    case 'grey':
      return '#6b7280';
    case 'blue':
      return '#2563eb';
    case 'navy':
      return '#1e3a8a';
    case 'red':
      return '#dc2626';
    case 'pink':
      return '#db2777';
    case 'beige':
      return '#c8b38e';
    case 'nude':
      return '#d6b89c';
    case 'brown':
      return '#7c4a2d';
    default:
      return fallback;
  }
};

useGLTF.preload('/models/avatar.glb');

export default AvatarCanvas;