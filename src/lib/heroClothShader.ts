export interface HeroClothOptions {
  section: HTMLElement;
  canvas: HTMLCanvasElement;
  reducedMotion: boolean;
  onFirstFrame: () => void;
}

const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const FS = (prec: string) =>
  `precision ${prec} float;` +
  'uniform vec2 uRes,uMouse;uniform float uTime;' +
  'float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}' +
  'float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*f*(f*(f*6.-15.)+10.);' +
  'return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);}' +
  'float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(.8,.6,-.6,.8);' +
  'for(int i=0;i<4;i++){v+=a*noise(p);p=m*p*1.92+vec2(17.1,31.7);a*=.44;}return v;}' +
  'float ht(vec2 uv,float t){float asp=uRes.x/max(uRes.y,1.);' +
  'vec2 p=(uv-.5)*vec2(asp,1.)*1.1+(uMouse-.5)*.6;' +
  'vec2 q=vec2(fbm(p*.65+vec2(0.,t*.32)),fbm(p*.65+vec2(5.2,1.3-t*.26)));' +
  'vec2 r=mat2(.825336,-.564642,.564642,.825336)*(p+1.15*q);' +
  'float fl=pow(sin(r.x*2.5+t*.8+1.45*fbm(r*.72))*.5+.5,1.5);' +
  'float h=mix(fl,fbm(p*1.15+t*.2),.26);' +
  'vec2 dv=(uv-uMouse)*vec2(asp,1.);return h+.25*exp(-dot(dv,dv)*6.);}' +
  'void main(){vec2 uv=gl_FragCoord.xy/max(uRes,vec2(1.));float t=uTime*.12,e=.005;' +
  'float h0=ht(uv,t),hx=ht(uv+vec2(e,0.),t),hy=ht(uv+vec2(0.,e),t);' +
  'vec3 n=normalize(vec3((h0-hx)/e*.36,(h0-hy)/e*.36,1.)),L=normalize(vec3(-.5,.6,.7));' +
  'float d=dot(n,L)*.5+.5,sp=pow(max(dot(reflect(-L,n),vec3(0.,0.,1.)),0.),24.)*.35;' +
  'float tn=smoothstep(.32,.88,d*.58+h0*.42);' +
  'vec3 cL=vec3(.933,.953,.941),cM=vec3(.796,.91,.859),cD=vec3(.498,.804,.682),cC=vec3(.247,.682,.541);' +
  'vec3 c=tn<.44?mix(cD,cM,tn/.44):mix(cM,cL,(tn-.44)/.56);' +
  'c=mix(c,vec3(.975,.99,.982),clamp(sp,0.,.35));' +
  'float lr=smoothstep(.26,1.08,uv.x*.64+(1.-uv.y)*.74+(1.-h0)*.2-.28);' +
  'c=mix(c,cC,lr*.56);vec2 vc=uv-.5;c*=1.-dot(vc,vc)*.08;' +
  'gl_FragColor=vec4(clamp(c+(hash(gl_FragCoord.xy)-.5)*.04,0.,1.),1.);}';

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (gl.getShaderParameter(s, gl.COMPILE_STATUS)) return s;
  gl.deleteShader(s);
  return null;
}

export function mountHeroCloth({ section, canvas, reducedMotion, onFirstFrame }: HeroClothOptions) {
  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    powerPreference: 'low-power',
    preserveDrawingBuffer: false,
  });
  if (!gl) return () => {};

  const isCoarse = matchMedia('(pointer: coarse)').matches;
  let scale = Math.min(devicePixelRatio || 1, 1.5) * (isCoarse ? 0.4 : 0.5);
  let prog: WebGLProgram | null = null;
  let buf: WebGLBuffer | null = null;
  let uRes: WebGLUniformLocation | null = null;
  let uTime: WebGLUniformLocation | null = null;
  let uMouse: WebGLUniformLocation | null = null;

  let curX = 0.5, curY = 0.5, tgtX = 0.5, tgtY = 0.5, lastInput = -4000;
  let inView = true, lost = false, ready = false, ptrOn = false;
  let rafId = 0, resizeId = 0, lastDraw = 0, lastRaf = 0, dSum = 0, dCnt = 0, elapsed = 0;
  const minDt = isCoarse ? 31 : 14;

  const init = () => {
    const hi = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
    const vs = compile(gl, gl.VERTEX_SHADER, VS);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FS(hi && hi.precision > 0 ? 'highp' : 'mediump'));
    if (!vs || !fs) return false;
    const p = gl.createProgram();
    if (!p) return false;
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { gl.deleteProgram(p); return false; }
    const loc = gl.getAttribLocation(p, 'p');
    const vb = gl.createBuffer();
    if (!vb || loc < 0) return false;
    gl.bindBuffer(gl.ARRAY_BUFFER, vb);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    prog = p;
    buf = vb;
    gl.useProgram(p);
    uRes = gl.getUniformLocation(p, 'uRes');
    uTime = gl.getUniformLocation(p, 'uTime');
    uMouse = gl.getUniformLocation(p, 'uMouse');
    return true;
  };

  const sync = () => {
    const w = Math.max(1, Math.round(section.clientWidth * scale));
    const h = Math.max(1, Math.round(section.clientHeight * scale));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, w, h);
  };

  const draw = (t: number) => {
    if (!prog || lost) return;
    gl.useProgram(prog);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, t);
    gl.uniform2f(uMouse, curX, curY);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    if (!ready) { ready = true; onFirstFrame(); }
  };

  const stop = () => { if (rafId) { cancelAnimationFrame(rafId); rafId = 0; } };

  const tick = (now: number) => {
    rafId = 0;
    if (reducedMotion || !inView || document.hidden || lost) return;
    if (lastRaf > 0) {
      const rdt = now - lastRaf;
      if (rdt < 200) {
        dSum += rdt;
        if (++dCnt >= 30) {
          if (dSum / dCnt > 24 && scale > 0.3) { scale = Math.max(0.3, scale * 0.75); sync(); }
          dSum = dCnt = 0;
        }
      }
      elapsed += Math.min(rdt, 100) * 0.001;
    }
    lastRaf = now;
    if (now - lastDraw >= minDt) {
      lastDraw = now;
      if (now - lastInput > 3000) {
        tgtX = 0.5 + 0.24 * Math.sin(elapsed * 0.37);
        tgtY = 0.5 + 0.18 * Math.cos(elapsed * 0.53);
      }
      curX += (tgtX - curX) * 0.05;
      curY += (tgtY - curY) * 0.05;
      draw(elapsed);
    }
    rafId = requestAnimationFrame(tick);
  };

  const start = () => {
    if (!reducedMotion && !rafId && inView && !document.hidden && !lost) {
      lastRaf = 0;
      rafId = requestAnimationFrame(tick);
    }
  };

  if (!init()) return () => {};
  sync();
  draw(0);

  const onResize = () => {
    window.clearTimeout(resizeId);
    resizeId = window.setTimeout(() => { sync(); draw(reducedMotion ? 0 : elapsed); }, 120);
  };
  const onLost = (e: Event) => { e.preventDefault(); lost = true; stop(); };
  const onRestored = () => { lost = false; if (init()) { sync(); draw(reducedMotion ? 0 : elapsed); start(); } };

  addEventListener('resize', onResize, { passive: true });
  canvas.addEventListener('webglcontextlost', onLost);
  canvas.addEventListener('webglcontextrestored', onRestored);

  if (reducedMotion) {
    return () => {
      window.clearTimeout(resizeId);
      removeEventListener('resize', onResize);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      if (buf) gl.deleteBuffer(buf);
      if (prog) gl.deleteProgram(prog);
    };
  }

  const move = (cx: number, cy: number) => {
    if (!inView) return;
    const r = section.getBoundingClientRect();
    if (!r.width || !r.height) return;
    tgtX = Math.max(0, Math.min(1, (cx - r.left) / r.width));
    tgtY = Math.max(0, Math.min(1, 1 - (cy - r.top) / r.height));
    lastInput = performance.now();
  };
  const onPtr = (e: PointerEvent) => { if (!isCoarse || e.pointerType === 'touch') move(e.clientX, e.clientY); };
  const onTouch = (e: TouchEvent) => { const t = e.touches[0]; if (t) move(t.clientX, t.clientY); };
  const setPtr = (on: boolean) => {
    if (on === ptrOn) return;
    ptrOn = on;
    const fn = on ? addEventListener : removeEventListener;
    fn('pointermove', onPtr as EventListener, { passive: true } as AddEventListenerOptions);
    fn('touchstart', onTouch as EventListener, { passive: true } as AddEventListenerOptions);
    fn('touchmove', onTouch as EventListener, { passive: true } as AddEventListenerOptions);
  };
  setPtr(true);

  const io = new IntersectionObserver((entries) => {
    inView = Boolean(entries[0]?.isIntersecting);
    setPtr(inView);
    if (inView && !document.hidden) start(); else stop();
  }, { threshold: 0 });
  io.observe(section);

  const onVis = () => {
    if (document.hidden) { stop(); setPtr(false); }
    else if (inView) { setPtr(true); draw(elapsed); start(); }
  };
  document.addEventListener('visibilitychange', onVis);
  start();

  return () => {
    stop();
    io.disconnect();
    setPtr(false);
    window.clearTimeout(resizeId);
    document.removeEventListener('visibilitychange', onVis);
    removeEventListener('resize', onResize);
    canvas.removeEventListener('webglcontextlost', onLost);
    canvas.removeEventListener('webglcontextrestored', onRestored);
    if (buf) gl.deleteBuffer(buf);
    if (prog) gl.deleteProgram(prog);
  };
}
