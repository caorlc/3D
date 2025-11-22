"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";

const GRID_SIZE = 200;
const GRID_DIVISIONS = 120;
const GRID_OFFSET = GRID_SIZE / 3;
const PRIMARY_LINE_COLOR = "#bcd5ff";
const SECONDARY_LINE_COLOR = "#3f537a";

interface GridFloorProps {
  visible: boolean;
  transparentBackground?: boolean;
}

export function GridFloor({ visible, transparentBackground }: GridFloorProps) {
  const helpers = useMemo(() => {
    const makeGrid = () => {
      const helper = new THREE.GridHelper(
        GRID_SIZE,
        GRID_DIVISIONS,
        new THREE.Color(PRIMARY_LINE_COLOR),
        new THREE.Color(SECONDARY_LINE_COLOR)
      );
      const material = helper.material as THREE.LineBasicMaterial | THREE.LineBasicMaterial[];
      const applyMaterial = (mat: THREE.LineBasicMaterial) => {
        mat.transparent = true;
        mat.opacity = 0.6;
        mat.depthWrite = false;
      };
      if (Array.isArray(material)) {
        material.forEach(applyMaterial);
      } else {
        applyMaterial(material);
      }
      return helper;
    };

    const floor = makeGrid();
    floor.position.set(0, 0, 0);

    const backWall = makeGrid();
    backWall.rotation.x = Math.PI / 2; // vertical plane facing forward (XY)
    backWall.position.set(0, GRID_SIZE / 2, -GRID_SIZE / 2);

    const sideWall = makeGrid();
    sideWall.rotation.z = Math.PI / 2; // vertical plane on the right (YZ)
    sideWall.position.set(-GRID_SIZE / 2, GRID_SIZE / 2, 0);

    const axes = new THREE.AxesHelper(12);
    axes.position.set(-GRID_SIZE / 2, 0, -GRID_SIZE / 2);

    return { floor, backWall, sideWall, axes };
  }, []);

  useEffect(() => {
    return () => {
      [helpers.floor, helpers.backWall, helpers.sideWall].forEach((helper) => {
        helper.geometry.dispose();
        const material = helper.material as THREE.LineBasicMaterial | THREE.LineBasicMaterial[];
        const disposeMaterial = (mat: THREE.LineBasicMaterial) => mat.dispose();
        if (Array.isArray(material)) {
          material.forEach(disposeMaterial);
        } else {
          disposeMaterial(material);
        }
      });
      helpers.axes.geometry.dispose();
    };
  }, [helpers]);

  if (!visible || transparentBackground) {
    return null;
  }

  return (
    <group position={[-GRID_OFFSET, -1.8, -GRID_OFFSET]}>
      <primitive object={helpers.floor} />
      <primitive object={helpers.backWall} />
      <primitive object={helpers.sideWall} />
      <primitive object={helpers.axes} />
    </group>
  );
}
