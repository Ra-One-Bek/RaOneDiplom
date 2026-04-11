import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3 } from "three";

type CameraRigProps = {
  scrollProgress: number;
};

export default function CameraRig({ scrollProgress }: CameraRigProps) {
  const { camera } = useThree();
  const lookAt = useRef(new Vector3(0, 0, 0));

  useFrame(() => {
    let targetX = 0;
    let targetY = 0.2;
    let targetZ = 6;

    let lookX = 0;
    let lookY = 0;
    let lookZ = 0;

    if (scrollProgress < 0.33) {
      const t = scrollProgress / 0.33;

      targetX = 0;
      targetY = 0.2;
      targetZ = 6 - t * 2.2;

      lookX = 0;
      lookY = 0;
      lookZ = 0;
    } else if (scrollProgress < 0.66) {
      const t = (scrollProgress - 0.33) / 0.33;

      targetX = -1.8 * t;
      targetY = 0.2 + t * 0.5;
      targetZ = 3.8;

      lookX = 0.3 * t;
      lookY = 0.15 * t;
      lookZ = 0;
    } else {
      const t = (scrollProgress - 0.66) / 0.34;

      targetX = -1.8 + t * 1.2;
      targetY = 0.7 + t * 1.3;
      targetZ = 3.8 - t * 1.1;

      lookX = 0.3 - t * 0.2;
      lookY = 0.15 + t * 0.35;
      lookZ = 0;
    }

    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.position.z += (targetZ - camera.position.z) * 0.05;

    lookAt.current.x += (lookX - lookAt.current.x) * 0.05;
    lookAt.current.y += (lookY - lookAt.current.y) * 0.05;
    lookAt.current.z += (lookZ - lookAt.current.z) * 0.05;

    camera.lookAt(lookAt.current);
  });

  return null;
}