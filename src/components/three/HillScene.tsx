"use client";

import { useEffect, useRef } from "react";

// Sylhet's tea estates: rows of bushes running over rolling hills, drawn as contour lines.
// The pointer is a lantern; sections set how lit the room is with data-scene="0..1";
// the camera climbs over the estate as the page is read.
const vertex = /* glsl */ `
uniform float uTime, uTravel, uPixelRatio, uSize;
uniform vec3 uLantern;
attribute float aSeed;
varying float vLight, vFade, vRidge;

vec2 hash(vec2 p){ p = vec2(dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3))); return -1.0 + 2.0*fract(sin(p)*43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p), u = f*f*(3.0-2.0*f);
  return mix(mix(dot(hash(i), f), dot(hash(i+vec2(1,0)), f-vec2(1,0)), u.x),
             mix(dot(hash(i+vec2(0,1)), f-vec2(0,1)), dot(hash(i+vec2(1,1)), f-vec2(1,1)), u.x), u.y);
}
float hills(vec2 p){
  float h = 0.0, a = 1.0;
  for (int i = 0; i < 4; i++) { h += a*noise(p); p = p*2.03 + 7.1; a *= 0.48; }
  return h;
}

void main(){
  vec3 p = position;
  float h = hills(vec2(p.x*0.045, (p.z - uTravel)*0.045));
  // A valley down the middle, the hills rising on either side of it.
  p.y = h*4.6 + smoothstep(3.0, 24.0, abs(p.x))*4.0 - 1.8;

  vec4 mv = modelViewMatrix*vec4(p, 1.0);
  gl_Position = projectionMatrix*mv;

  float d = distance(p.xz, uLantern.xz);
  vLight = smoothstep(8.0, 0.0, d)*uLantern.y;
  vRidge = clamp(h*1.3 + 0.45, 0.0, 1.0);
  vFade = smoothstep(64.0, 6.0, -mv.z)*smoothstep(0.0, 3.0, -mv.z);
  gl_PointSize = uSize*uPixelRatio*(0.5 + aSeed*0.6 + vLight*1.2)/-mv.z;
}`;

const fragment = /* glsl */ `
uniform vec3 uInk, uAccent;
uniform float uIntensity, uAlpha;
varying float vLight, vFade, vRidge;
void main(){
  #ifdef POINTS
  vec2 c = gl_PointCoord - 0.5;
  if (dot(c, c) > 0.25) discard;
  #endif
  vec3 color = mix(uInk, uAccent, vLight);
  float alpha = (0.12 + vRidge*0.42)*uIntensity + vLight*0.9;
  gl_FragColor = vec4(color, alpha*vFade*uAlpha);
}`;

// The air above the estate: the ground colour, a faint haze along the horizon and darker corners.
const skyVertex = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 1.0, 1.0); }`;
const skyFragment = /* glsl */ `
uniform vec3 uGround, uHaze;
uniform float uHorizon, uIntensity, uAspect;
varying vec2 vUv;
float dither(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233)))*43758.5453) - 0.5; }
void main(){
  float haze = exp(-abs(vUv.y - uHorizon)*7.0)*(0.35 + 0.65*uIntensity);
  vec3 color = mix(uGround, uHaze, haze*0.22);
  vec2 q = (vUv - 0.5)*vec2(uAspect, 1.0);
  color *= 1.0 - smoothstep(0.35, 1.1, length(q))*0.5;
  gl_FragColor = vec4(color + dither(gl_FragCoord.xy)/255.0, 1.0);
}`;

export function HillScene() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = host.current!;
    let disposed = false;
    let cleanup = () => {};

    void import("three").then(THREE => {
      if (disposed) return;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
      } catch { return; } // No WebGL: the page is complete without the hills.

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      const small = window.matchMedia("(max-width: 767px)").matches;
      const ratio = Math.min(window.devicePixelRatio, 1.5); // antialiased hairlines stay crisp here at a fraction of the fill cost
      renderer.setPixelRatio(ratio);
      container.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 120);
      camera.position.set(0, 3.4, 9);

      const cols = small ? 140 : 260, rows = small ? 64 : 110;
      const positions = new Float32Array(cols*rows*3);
      const seeds = new Float32Array(cols*rows);
      const segments: number[] = [];
      for (let r = 0, i = 0; r < rows; r++) for (let c = 0; c < cols; c++, i++) {
        positions[i*3] = (c/(cols - 1) - .5)*64;
        positions[i*3 + 2] = 8 - (r/(rows - 1))*68;
        seeds[i] = Math.random();
        if (c < cols - 1) segments.push(i, i + 1);
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
      const lineGeometry = geometry.clone();
      lineGeometry.setIndex(segments);

      const style = getComputedStyle(document.documentElement);
      const token = (name: string, fallback: string) => new THREE.Color(style.getPropertyValue(name).trim() || fallback);
      const shared = {
        uTime: { value: 0 }, uTravel: { value: 0 }, uPixelRatio: { value: ratio }, uSize: { value: small ? 26 : 30 },
        uLantern: { value: new THREE.Vector3(0, 0, -4) }, uIntensity: { value: 1 },
        uInk: { value: token("--ink", "#e6e8df") }, uAccent: { value: token("--accent", "#cbd2b1") },
      };
      const lineMaterial = new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms: { ...shared, uAlpha: { value: .75 } }, transparent: true, depthWrite: false });
      const pointMaterial = new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms: { ...shared, uAlpha: { value: .55 } }, transparent: true, depthWrite: false, defines: { POINTS: 1 } });
      scene.add(new THREE.LineSegments(lineGeometry, lineMaterial), new THREE.Points(geometry, pointMaterial));

      const skyUniforms = {
        uGround: { value: token("--ground", "#1d1f1a") }, uHaze: { value: token("--accent", "#cbd2b1") },
        uHorizon: { value: .6 }, uIntensity: shared.uIntensity, uAspect: { value: 1 },
      };
      const skyGeometry = new THREE.PlaneGeometry(2, 2);
      const skyMaterial = new THREE.ShaderMaterial({ vertexShader: skyVertex, fragmentShader: skyFragment, uniforms: skyUniforms, depthWrite: false, depthTest: false });
      const sky = new THREE.Mesh(skyGeometry, skyMaterial);
      sky.frustumCulled = false;
      sky.renderOrder = -1;
      scene.add(sky);

      // Pointer → a point on the ground plane. Touch devices get a slow wandering lantern.
      const pointer = new THREE.Vector2(0, -.15), aim = new THREE.Vector2(0, -.15);
      const raycaster = new THREE.Raycaster(), ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hit = new THREE.Vector3();
      const horizon = new THREE.Vector3();
      let pointerSeen = false;
      const onPointer = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        pointerSeen = true;
        aim.set(event.clientX/window.innerWidth*2 - 1, -(event.clientY/window.innerHeight)*2 + 1);
      };
      window.addEventListener("pointermove", onPointer, { passive: true });

      // Each section asks for its own light level as it crosses the middle of the screen.
      let targetIntensity = 1;
      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) if (entry.isIntersecting) targetIntensity = Number((entry.target as HTMLElement).dataset.scene);
      }, { rootMargin: "-50% 0px -50% 0px" });
      document.querySelectorAll("[data-scene]").forEach(element => observer.observe(element));

      let portrait = false;
      const resize = () => {
        const { innerWidth: w, innerHeight: h } = window;
        renderer.setSize(w, h, false);
        camera.aspect = w/h;
        portrait = w < h;
        camera.fov = portrait ? 70 : 48;
        camera.updateProjectionMatrix();
        skyUniforms.uAspect.value = w/h;
      };
      resize();
      window.addEventListener("resize", resize);

      const clock = new THREE.Clock();
      let frame = 0, visible = true, journey = 0;
      const tick = () => {
        frame = requestAnimationFrame(tick);
        if (!visible) return;
        const dt = Math.min(clock.getDelta(), .05);
        const still = reduced.matches;
        if (!still) shared.uTime.value += dt;
        const time = shared.uTime.value;
        if (!pointerSeen && !still) aim.set(Math.sin(time*.23)*.55, -.25 + Math.sin(time*.31)*.18);
        pointer.lerp(aim, still ? 1 : .06);
        // Walk forward slowly; scrolling walks further into the estate and lifts the camera.
        const scroll = window.scrollY/Math.max(1, window.innerHeight);
        const progress = window.scrollY/Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        journey += (progress - journey)*(still ? 1 : .05);
        shared.uTravel.value += ((still ? 0 : time*.9) + scroll*5 - shared.uTravel.value)*.08;
        shared.uIntensity.value += (targetIntensity - shared.uIntensity.value)*.05;

        camera.position.x += (pointer.x*.8 + Math.sin(journey*Math.PI)*2.2 - camera.position.x)*.04;
        camera.position.y = 3.2 + journey*3.4 + pointer.y*.3;
        // Phones are tall: tilt down further so the hills fill the open upper half of the screen.
        camera.lookAt(0, (portrait ? -2.6 : .2) - journey*2.2, -12);
        horizon.set(0, 1.5, -60).project(camera);
        skyUniforms.uHorizon.value = horizon.y*.5 + .5;

        raycaster.setFromCamera(pointer, camera);
        if (raycaster.ray.intersectPlane(ground, hit)) {
          shared.uLantern.value.x = hit.x;
          shared.uLantern.value.z = hit.z;
        }
        shared.uLantern.value.y += ((pointerSeen ? 1 : .7)*Math.max(.35, shared.uIntensity.value) - shared.uLantern.value.y)*.08;
        renderer.render(scene, camera);
      };
      const onVisibility = () => { visible = !document.hidden; clock.getDelta(); };
      document.addEventListener("visibilitychange", onVisibility);
      tick();
      container.dataset.ready = "true";

      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        window.removeEventListener("pointermove", onPointer);
        window.removeEventListener("resize", resize);
        document.removeEventListener("visibilitychange", onVisibility);
        [geometry, lineGeometry, skyGeometry].forEach(item => item.dispose());
        [lineMaterial, pointMaterial, skyMaterial].forEach(item => item.dispose());
        renderer.dispose();
        renderer.domElement.remove();
      };
    });
    return () => { disposed = true; cleanup(); };
  }, []);

  return <div ref={host} className="hill-scene" aria-hidden="true" />;
}
