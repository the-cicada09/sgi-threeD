"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { MODELS, type ModelName } from "./models";

/**
 * Renders a single GLTF model. The loaded scene graph is cached (and shared
 * across every instance) by useGLTF's internal loader cache, so remounting
 * the same model name never re-fetches or re-parses it. Because the cached
 * scene is shared, it's cloned per instance before being attached to the R3F
 * tree - an Object3D can only live in one place in the scene graph at a
 * time, and cloning keeps geometries/materials/textures shared (not
 * duplicated) while still letting multiple instances mount independently.
 */
export default function Model({ name }: { name: ModelName }) {
  const { path } = MODELS[name];
  const { scene } = useGLTF(path);
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene]);

  return <primitive object={clonedScene} />;
}
