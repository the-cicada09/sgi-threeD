import * as THREE from "three";
import type { CameraControlsImpl } from "@react-three/drei";

/**
 * fitToBox snaps to an axis-aligned view, so a diagonal box corner can clip out of
 * frame; fitting the (padded) bounding sphere instead keeps everything in view.
 * Shared by the production viewer and the camera-controls POC so both frame the
 * same way.
 */
export function frame(controls: CameraControlsImpl, box: THREE.Box3, animate: boolean) {
  const sphere = box.getBoundingSphere(new THREE.Sphere());
  // Tight enough that the aircraft reads as the hero of the viewer (fills
  // most of the frame) while still leaving room for hotspot pins and the
  // toolbar overlay to sit clear of the fuselage.
  sphere.radius *= 1.08;

  // The registry holds models at wildly different native scales (the A380 is a
  // handful of units across; some Sketchfab exports run to hundreds). Canvas's
  // initial camera hardcodes near/far for *a* scale, so fitToSphere can place
  // the camera beyond a too-small far plane — the model loads fine, it's just
  // clipped into invisibility. Re-deriving near/far from the model's own
  // bounding sphere keeps every registered model in view regardless of scale.
  const camera = controls.camera;
  if (camera instanceof THREE.PerspectiveCamera) {
    camera.near = Math.max(sphere.radius / 100, 0.001);
    camera.far = sphere.radius * 100;
    camera.updateProjectionMatrix();
  }

  controls.fitToSphere(sphere, animate);
}
