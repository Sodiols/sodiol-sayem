// The work gallery: project screens on a curved ribbon that flexes with scroll speed.
// At rest each screen is printed in the room's two inks; the pointer reveals its true colour.

const vertex = /* glsl */ `
uniform float uCurve, uVelocity, uHover, uTime;
uniform vec2 uMouse;
varying vec2 vUv;
varying float vDepth;
void main(){
  vUv = uv;
  vec4 world = modelMatrix*vec4(position, 1.0);
  world.z -= world.x*world.x*uCurve;
  world.y += sin(uv.x*3.14159)*uVelocity*0.35;          // the sheet sags when it moves fast
  world.z += sin(uv.y*3.14159)*abs(uVelocity)*0.6;
  float d = distance(uv, uMouse);
  world.z += sin(d*22.0 - uTime*5.0)*0.035*uHover*smoothstep(0.55, 0.0, d);
  vDepth = world.z;
  gl_Position = projectionMatrix*viewMatrix*world;
}`;

const fragment = /* glsl */ `
uniform sampler2D uTex;
uniform vec3 uDark, uLight;
uniform float uActive, uHover, uVelocity, uAspect, uLoaded, uTime;
uniform vec2 uMouse;
varying vec2 vUv;
varying float vDepth;
float grain(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233)))*43758.5453); }
void main(){
  float shift = uVelocity*0.025;
  vec3 tex = vec3(texture2D(uTex, vUv + vec2(shift, 0.0)).r, texture2D(uTex, vUv).g, texture2D(uTex, vUv - vec2(shift, 0.0)).b);
  float l = dot(tex, vec3(0.299, 0.587, 0.114));
  vec3 duo = mix(uDark, uLight, smoothstep(0.04, 1.0, l));
  vec2 a = vec2(uAspect, 1.0);
  float d = distance(vUv*a, uMouse*a);
  float radius = uHover*0.9*uAspect;
  float reveal = smoothstep(radius, radius - 0.18, d);
  vec3 color = mix(duo, tex, reveal);
  float edge = smoothstep(0.0, 0.06, vUv.x)*smoothstep(1.0, 0.94, vUv.x)*smoothstep(0.0, 0.06, vUv.y)*smoothstep(1.0, 0.94, vUv.y);
  color *= mix(0.62, 1.0, edge);                          // edges settle into the dark
  color *= mix(0.32, 1.0, uActive) * mix(1.0, 0.7, clamp(-vDepth*0.25, 0.0, 1.0));
  color += (grain(vUv*900.0 + uTime) - 0.5)*0.05;
  gl_FragColor = vec4(mix(uDark*0.6, color, uLoaded), 1.0);
}`;

type Source = { src: string; width: number; height: number };
type Options = {
  host: HTMLElement; track: HTMLElement; sources: Source[];
  onActive: (index: number) => void; onHover: (index: number | null) => void; onReady: () => void;
};

export async function mountWorkStage({ host, track, sources, onActive, onHover, onReady }: Options) {
  const THREE = await import("three");
  let renderer: InstanceType<typeof THREE.WebGLRenderer>;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch { return () => {}; }
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, .1, 50);
  camera.position.z = 10;
  const style = getComputedStyle(document.documentElement);
  const color = (name: string, fallback: string) => new THREE.Color(style.getPropertyValue(name).trim() || fallback);
  const dark = color("--ground", "#1d1f1a").offsetHSL(0, 0, .03), light = color("--ink", "#e6e8df").lerp(color("--accent", "#cbd2b1"), .5).multiplyScalar(.82);

  const geometry = new THREE.PlaneGeometry(1, 1, 48, 24);
  const loader = new THREE.TextureLoader();
  const planes = sources.map(source => {
    const uniforms = {
      uTex: { value: new THREE.Texture() }, uDark: { value: dark }, uLight: { value: light },
      uCurve: { value: 0 }, uVelocity: { value: 0 }, uHover: { value: 0 }, uTime: { value: 0 }, uActive: { value: 0 },
      uMouse: { value: new THREE.Vector2(.5, .5) }, uAspect: { value: source.width/source.height }, uLoaded: { value: 0 },
    };
    const mesh = new THREE.Mesh(geometry, new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms }));
    loader.load(source.src, texture => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      uniforms.uTex.value = texture;
      uniforms.uLoaded.value = 1;
    });
    scene.add(mesh);
    return { mesh, uniforms, aspect: source.width/source.height, hover: 0 };
  });

  let spacing = 1, centreY = 0, portrait = false;
  const resize = () => {
    const { clientWidth: w, clientHeight: h } = host;
    renderer.setSize(w, h, false);
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
    portrait = w/h < 1;
    const visH = 2*camera.position.z*Math.tan(THREE.MathUtils.degToRad(camera.fov/2)), visW = visH*camera.aspect;
    const boxW = visW*(portrait ? .86 : .46), boxH = visH*(portrait ? .3 : .44);
    spacing = visW*(portrait ? .94 : .62);
    centreY = visH*(.5 - (portrait ? .4 : .39));
    for (const plane of planes) {
      const width = Math.min(boxW, boxH*plane.aspect);
      plane.mesh.scale.set(width, width/plane.aspect, 1);
    }
    const curve = 1.6/(spacing*spacing);
    planes.forEach(plane => { plane.uniforms.uCurve.value = curve; });
  };
  resize();
  const resizer = new ResizeObserver(resize);
  resizer.observe(host);

  // Pointer → which screen, and where on it.
  const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2(9, 9);
  let hovered: number | null = null;
  const stage = host.parentElement!;
  const onMove = (event: PointerEvent) => {
    if (event.target !== renderer.domElement) return onLeave(); // over the text, not the pictures
    const box = host.getBoundingClientRect();
    pointer.set((event.clientX - box.left)/box.width*2 - 1, -(event.clientY - box.top)/box.height*2 + 1);
  };
  const onLeave = () => pointer.set(9, 9);
  stage.addEventListener("pointermove", onMove);
  stage.addEventListener("pointerleave", onLeave);

  let current = 0, active = -1, visible = false, frame = 0;
  const viewport = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
  viewport.observe(track);
  const clock = new THREE.Clock();
  const tick = () => {
    frame = requestAnimationFrame(tick);
    if (!visible) return;
    const dt = Math.min(clock.getDelta(), .05), time = clock.elapsedTime;
    const box = track.getBoundingClientRect();
    const target = Math.min(Math.max(-box.top/Math.max(1, box.height - window.innerHeight), 0), 1)*(sources.length - 1);
    current += (target - current)*(reduced.matches ? 1 : Math.min(1, dt*7));
    const velocity = reduced.matches ? 0 : Math.max(-1, Math.min(1, (target - current)*1.6));
    const nearest = Math.round(current);
    if (nearest !== active) { active = nearest; onActive(nearest); }

    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(planes.map(plane => plane.mesh))[0];
    const next = hit ? planes.findIndex(plane => plane.mesh === hit.object) : null;
    if (next !== hovered) { hovered = next; onHover(next); }

    planes.forEach((plane, index) => {
      const offset = index - current;
      plane.mesh.position.set(offset*spacing, centreY, 0);
      plane.mesh.rotation.y = portrait ? 0 : -offset*.18;
      const u = plane.uniforms;
      u.uActive.value = 1 - Math.min(Math.abs(offset), 1);
      u.uVelocity.value = velocity;
      u.uTime.value = time;
      plane.hover += ((hovered === index ? 1 : 0) - plane.hover)*Math.min(1, dt*(reduced.matches ? 60 : 4));
      u.uHover.value = plane.hover;
      if (hit && hovered === index && hit.uv) u.uMouse.value.lerp(hit.uv, reduced.matches ? 1 : .2);
    });
    renderer.render(scene, camera);
  };
  tick();
  onReady();

  return () => {
    cancelAnimationFrame(frame);
    resizer.disconnect();
    viewport.disconnect();
    stage.removeEventListener("pointermove", onMove);
    stage.removeEventListener("pointerleave", onLeave);
    planes.forEach(plane => { plane.uniforms.uTex.value.dispose(); plane.mesh.material.dispose(); });
    geometry.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
