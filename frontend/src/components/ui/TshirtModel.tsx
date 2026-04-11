import { Center, useGLTF } from "@react-three/drei";

type TshirtModelProps = {
  scrollProgress: number;
};

export default function TshirtModel({ scrollProgress }: TshirtModelProps) {
  const { scene } = useGLTF("/models/tshirt.glb");

  return (
    <Center>
      <primitive object={scene} scale={0.3} />
    </Center>
  );
}

useGLTF.preload("/models/tshirt.glb");