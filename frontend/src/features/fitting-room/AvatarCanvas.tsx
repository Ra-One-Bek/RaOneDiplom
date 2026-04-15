import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { useMemo } from 'react';
import type { AvatarProfile } from '../../types/auth';
import type { FittingOutfit } from '../../services/storage/selectedProductStorage';

interface AvatarCanvasProps {
  avatarProfile?: AvatarProfile | null;
  outfit?: FittingOutfit;
}

const skinPalette: Record<AvatarProfile['skinTone'], string> = {
  light: '#f0c7a4',
  medium: '#d19a72',
  dark: '#8b5e3c',
};

const AvatarCanvas = ({ avatarProfile, outfit }: AvatarCanvasProps) => {
  return (
    <Canvas camera={{ position: [0, 1.5, 4.4], fov: 35 }}>
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 5, 4]} intensity={1.6} />
      <directionalLight position={[-2, 3, -2]} intensity={0.6} />

      <Environment preset="city" />
      <OrbitControls
        enablePan={false}
        minDistance={3}
        maxDistance={6}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 2}
      />

      <color attach="background" args={['#f5f5f5']} />

      <group position={[0, -1.25, 0]}>
        <Floor />
        <AvatarFigure avatarProfile={avatarProfile} outfit={outfit} />
      </group>
    </Canvas>
  );
};

const Floor = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
      <circleGeometry args={[3.5, 64]} />
      <meshStandardMaterial color="#e7e5e4" />
    </mesh>
  );
};

interface AvatarFigureProps {
  avatarProfile?: AvatarProfile | null;
  outfit?: FittingOutfit;
}

const AvatarFigure = ({ avatarProfile, outfit }: AvatarFigureProps) => {
  const profile = avatarProfile ?? {
    gender: 'neutral',
    bodyType: 'regular',
    hairStyle: 'short',
    skinTone: 'medium',
    hairColor: '#2f1b14',
  };

  const body = useMemo(() => {
    switch (profile.bodyType) {
      case 'slim':
        return {
          shoulderWidth: 0.82,
          torsoWidth: 0.62,
          waistWidth: 0.5,
          hipWidth: 0.66,
          legWidth: 0.18,
          armWidth: 0.12,
        };
      case 'curvy':
        return {
          shoulderWidth: 0.9,
          torsoWidth: 0.74,
          waistWidth: 0.58,
          hipWidth: 0.82,
          legWidth: 0.23,
          armWidth: 0.14,
        };
      default:
        return {
          shoulderWidth: 0.86,
          torsoWidth: 0.68,
          waistWidth: 0.54,
          hipWidth: 0.72,
          legWidth: 0.2,
          armWidth: 0.13,
        };
    }
  }, [profile.bodyType]);

  const skinColor = skinPalette[profile.skinTone];

  const topColor = getClothingColor(outfit?.top?.colors, '#111827');
  const bottomColor = getClothingColor(outfit?.bottom?.colors, '#374151');
  const outerwearColor = getClothingColor(outfit?.outerwear?.colors, '#7c3aed');
  const footwearColor = getClothingColor(outfit?.footwear?.colors, '#1f2937');
  const dressColor = getClothingColor(outfit?.dress?.colors, '#db2777');

  const hasDress = Boolean(outfit?.dress);
  const hasTop = Boolean(outfit?.top);
  const hasBottom = Boolean(outfit?.bottom);
  const hasOuterwear = Boolean(outfit?.outerwear);
  const hasFootwear = Boolean(outfit?.footwear);

  return (
    <group>
      <Head skinColor={skinColor} hairColor={profile.hairColor} hairStyle={profile.hairStyle} />

      <Torso
        skinColor={skinColor}
        shoulderWidth={body.shoulderWidth}
        torsoWidth={body.torsoWidth}
        waistWidth={body.waistWidth}
      />

      <Arms skinColor={skinColor} armWidth={body.armWidth} shoulderWidth={body.shoulderWidth} />
      <Legs skinColor={skinColor} legWidth={body.legWidth} hipWidth={body.hipWidth} />

      {hasDress && (
        <DressLayer color={dressColor} shoulderWidth={body.shoulderWidth} hipWidth={body.hipWidth} />
      )}

      {!hasDress && hasTop && (
        <TopLayer
          color={topColor}
          shoulderWidth={body.shoulderWidth}
          torsoWidth={body.torsoWidth}
        />
      )}

      {!hasDress && hasBottom && (
        <BottomLayer color={bottomColor} hipWidth={body.hipWidth} legWidth={body.legWidth} />
      )}

      {!hasDress && hasOuterwear && (
        <OuterwearLayer
          color={outerwearColor}
          shoulderWidth={body.shoulderWidth}
          torsoWidth={body.torsoWidth}
        />
      )}

      {hasFootwear && (
        <FootwearLayer color={footwearColor} legWidth={body.legWidth} />
      )}
    </group>
  );
};

const Head = ({
  skinColor,
  hairColor,
  hairStyle,
}: {
  skinColor: string;
  hairColor: string;
  hairStyle: AvatarProfile['hairStyle'];
}) => {
  const hairHeight = hairStyle === 'short' ? 0.12 : hairStyle === 'bob' ? 0.22 : 0.38;

  return (
    <group position={[0, 2.1, 0]}>
      <mesh>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      <mesh position={[0, 0.12, -0.01]} scale={[1.02, 0.75 + hairHeight, 1.02]}>
        <sphereGeometry args={[0.285, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={hairColor} />
      </mesh>

      {hairStyle === 'bob' && (
        <>
          <mesh position={[-0.18, -0.05, 0]}>
            <boxGeometry args={[0.08, 0.26, 0.14]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
          <mesh position={[0.18, -0.05, 0]}>
            <boxGeometry args={[0.08, 0.26, 0.14]} />
            <meshStandardMaterial color={hairColor} />
          </mesh>
        </>
      )}

      {hairStyle === 'long' && (
        <mesh position={[0, -0.28, -0.12]}>
          <boxGeometry args={[0.34, 0.5, 0.14]} />
          <meshStandardMaterial color={hairColor} />
        </mesh>
      )}
    </group>
  );
};

const Torso = ({
  skinColor,
  shoulderWidth,
  torsoWidth,
  waistWidth,
}: {
  skinColor: string;
  shoulderWidth: number;
  torsoWidth: number;
  waistWidth: number;
}) => {
  return (
    <group position={[0, 1.25, 0]}>
      <mesh position={[0, 0.22, 0]} scale={[shoulderWidth, 0.28, 0.34]}>
        <sphereGeometry args={[0.45, 32, 32]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      <mesh position={[0, -0.2, 0]} scale={[torsoWidth, 0.7, 0.36]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      <mesh position={[0, -0.72, 0]} scale={[waistWidth, 0.28, 0.34]}>
        <sphereGeometry args={[0.46, 32, 32]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
    </group>
  );
};

const Arms = ({
  skinColor,
  armWidth,
  shoulderWidth,
}: {
  skinColor: string;
  armWidth: number;
  shoulderWidth: number;
}) => {
  const x = shoulderWidth * 0.53;

  return (
    <group position={[0, 1.48, 0]}>
      <mesh position={[-x, -0.32, 0]} rotation={[0, 0, 0.14]}>
        <capsuleGeometry args={[armWidth, 0.85, 10, 20]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      <mesh position={[x, -0.32, 0]} rotation={[0, 0, -0.14]}>
        <capsuleGeometry args={[armWidth, 0.85, 10, 20]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
    </group>
  );
};

const Legs = ({
  skinColor,
  legWidth,
  hipWidth,
}: {
  skinColor: string;
  legWidth: number;
  hipWidth: number;
}) => {
  const offset = hipWidth * 0.23;

  return (
    <group position={[0, 0.15, 0]}>
      <mesh position={[-offset, -0.55, 0]}>
        <capsuleGeometry args={[legWidth, 1.2, 10, 20]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>

      <mesh position={[offset, -0.55, 0]}>
        <capsuleGeometry args={[legWidth, 1.2, 10, 20]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
    </group>
  );
};

const TopLayer = ({
  color,
  shoulderWidth,
  torsoWidth,
}: {
  color: string;
  shoulderWidth: number;
  torsoWidth: number;
}) => {
  return (
    <group position={[0, 1.24, 0.02]}>
      <mesh position={[0, 0.14, 0]} scale={[shoulderWidth * 1.02, 0.28, 0.4]}>
        <sphereGeometry args={[0.47, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>

      <mesh position={[0, -0.2, 0]} scale={[torsoWidth * 1.04, 0.7, 0.42]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
};

const BottomLayer = ({
  color,
  hipWidth,
  legWidth,
}: {
  color: string;
  hipWidth: number;
  legWidth: number;
}) => {
  const offset = hipWidth * 0.23;

  return (
    <group position={[0, 0.02, 0.02]}>
      <mesh position={[0, 0, 0]} scale={[hipWidth * 1.02, 0.36, 0.42]}>
        <sphereGeometry args={[0.48, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>

      <mesh position={[-offset, -0.62, 0]}>
        <capsuleGeometry args={[legWidth * 1.08, 0.82, 10, 20]} />
        <meshStandardMaterial color={color} />
      </mesh>

      <mesh position={[offset, -0.62, 0]}>
        <capsuleGeometry args={[legWidth * 1.08, 0.82, 10, 20]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
};

const OuterwearLayer = ({
  color,
  shoulderWidth,
  torsoWidth,
}: {
  color: string;
  shoulderWidth: number;
  torsoWidth: number;
}) => {
  return (
    <group position={[0, 1.22, 0.08]}>
      <mesh position={[0, 0.06, 0]} scale={[shoulderWidth * 1.12, 0.34, 0.52]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>

      <mesh position={[0, -0.22, 0]} scale={[torsoWidth * 1.16, 0.86, 0.5]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
};

const DressLayer = ({
  color,
  shoulderWidth,
  hipWidth,
}: {
  color: string;
  shoulderWidth: number;
  hipWidth: number;
}) => {
  return (
    <group position={[0, 1.0, 0.05]}>
      <mesh position={[0, 0.36, 0]} scale={[shoulderWidth * 0.96, 0.38, 0.42]}>
        <sphereGeometry args={[0.48, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>

      <mesh position={[0, -0.18, 0]} scale={[hipWidth * 0.88, 1.2, 0.42]}>
        <coneGeometry args={[0.6, 1.7, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
};

const FootwearLayer = ({
  color,
  legWidth,
}: {
  color: string;
  legWidth: number;
}) => {
  const offset = legWidth * 1.1;

  return (
    <group position={[0, -1.18, 0.12]}>
      <mesh position={[-offset, 0, 0]}>
        <boxGeometry args={[0.32, 0.14, 0.58]} />
        <meshStandardMaterial color={color} />
      </mesh>

      <mesh position={[offset, 0, 0]}>
        <boxGeometry args={[0.32, 0.14, 0.58]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
};

const getClothingColor = (colors: string[] | undefined, fallback: string) => {
  if (!colors || colors.length === 0) {
    return fallback;
  }

  const normalized = colors[0].trim().toLowerCase();

  switch (normalized) {
    case 'black':
    case 'черный':
    case 'чёрный':
      return '#111827';
    case 'white':
    case 'белый':
      return '#f3f4f6';
    case 'blue':
    case 'синий':
      return '#2563eb';
    case 'red':
    case 'красный':
      return '#dc2626';
    case 'green':
    case 'зеленый':
    case 'зелёный':
      return '#16a34a';
    case 'pink':
    case 'розовый':
      return '#db2777';
    case 'gray':
    case 'grey':
    case 'серый':
      return '#6b7280';
    case 'brown':
    case 'коричневый':
      return '#7c4a2d';
    case 'beige':
    case 'бежевый':
      return '#c8b38e';
    default:
      return fallback;
  }
};

export default AvatarCanvas;