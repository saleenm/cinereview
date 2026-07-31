'use client'

import { useEffect, useRef } from 'react'

export default function CinematicBackground() {
  const bgRef  = useRef<HTMLCanvasElement>(null)
  const orbRef = useRef<HTMLCanvasElement>(null)

  /* ── WebGL 3-D particle cloud ── */
  useEffect(() => {
    const canvas = bgRef.current
    if (!canvas) return
    const gl = (
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    ) as WebGLRenderingContext | null

    function resize() {
      if (!canvas) return
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      gl?.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)
    if (!gl) return () => window.removeEventListener('resize', resize)

    /* Vertex: wave motion + depth pulse */
    const vs = `
      attribute vec3 aPos; attribute float aSize; attribute float aAlpha; attribute float aLayer;
      uniform mat4 uMVP; uniform float uTime; varying float vAlpha; varying float vLayer;
      void main(){
        vec3 p = aPos;
        float spd = 0.15 + aLayer * 0.1;
        p.z += sin(uTime * spd + aPos.x * 1.8 + aLayer) * (0.4 + aLayer * 0.3);
        p.y += cos(uTime * spd * 0.7 + aPos.z * 1.2 + aLayer) * 0.3;
        p.x += sin(uTime * spd * 0.5 + aPos.y * 1.5) * 0.2;
        gl_Position = uMVP * vec4(p, 1.0);
        float depth = 1.0 / (1.0 + abs(gl_Position.z) * 0.05);
        gl_PointSize = aSize * depth * (1.8 + aLayer * 0.8);
        vAlpha = aAlpha * depth;
        vLayer = aLayer;
      }`

    /* Fragment: soft glow disc with color tint per layer */
    const fs = `
      precision mediump float;
      varying float vAlpha; varying float vLayer;
      uniform vec3 uColor; uniform vec3 uColor2;
      void main(){
        float d = distance(gl_PointCoord, vec2(0.5));
        if(d > 0.5) discard;
        float soft = smoothstep(0.5, 0.0, d);
        vec3 col = mix(uColor, uColor2, vLayer);
        gl_FragColor = vec4(col, soft * vAlpha);
      }`

    function mkShader(type: number, src: string) {
      const s = gl!.createShader(type)!
      gl!.shaderSource(s, src); gl!.compileShader(s); return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, mkShader(gl.VERTEX_SHADER, vs))
    gl.attachShader(prog, mkShader(gl.FRAGMENT_SHADER, fs))
    gl.linkProgram(prog); gl.useProgram(prog)

    const N = 1200
    const pos    = new Float32Array(N * 3)
    const sizes  = new Float32Array(N)
    const alphas = new Float32Array(N)
    const layers = new Float32Array(N)

    for (let i = 0; i < N; i++) {
      const layer   = Math.floor(Math.random() * 3)      // 0,1,2
      const radius  = 6 + layer * 3                       // spread by depth
      const theta   = Math.random() * Math.PI * 2
      const phi     = Math.acos(2 * Math.random() - 1)
      pos[i*3]   = radius * Math.sin(phi) * Math.cos(theta)
      pos[i*3+1] = radius * Math.sin(phi) * Math.sin(theta)
      pos[i*3+2] = radius * Math.cos(phi)
      sizes[i]   = Math.random() * 2.5 + 0.5
      alphas[i]  = (Math.random() * 0.5 + 0.15) * (1 - layer * 0.2)
      layers[i]  = layer / 2           // 0..1
    }

    function mkBuf(data: Float32Array, attr: string, sz: number) {
      const b = gl!.createBuffer()!
      gl!.bindBuffer(gl!.ARRAY_BUFFER, b)
      gl!.bufferData(gl!.ARRAY_BUFFER, data, gl!.STATIC_DRAW)
      const l = gl!.getAttribLocation(prog, attr)
      if (l >= 0) { gl!.enableVertexAttribArray(l); gl!.vertexAttribPointer(l, sz, gl!.FLOAT, false, 0, 0) }
    }
    mkBuf(pos, 'aPos', 3); mkBuf(sizes, 'aSize', 1)
    mkBuf(alphas, 'aAlpha', 1); mkBuf(layers, 'aLayer', 1)

    const uMVP    = gl.getUniformLocation(prog, 'uMVP')!
    const uTime   = gl.getUniformLocation(prog, 'uTime')!
    const uColor  = gl.getUniformLocation(prog, 'uColor')!
    const uColor2 = gl.getUniformLocation(prog, 'uColor2')!
    gl.uniform3f(uColor,  0.83, 0.66, 0.32)   // gold
    gl.uniform3f(uColor2, 0.55, 0.10, 0.10)   // deep crimson

    const persp = (f: number, a: number, n: number, fa: number) => {
      const t = 1/Math.tan(f/2), m = new Float32Array(16)
      m[0]=t/a; m[5]=t; m[10]=(fa+n)/(n-fa); m[11]=-1; m[14]=(2*fa*n)/(n-fa)
      return m
    }
    const mul = (a: Float32Array, b: Float32Array) => {
      const m = new Float32Array(16)
      for (let r=0;r<4;r++) for (let c=0;c<4;c++) for (let k=0;k<4;k++) m[r*4+c]+=a[r*4+k]*b[k*4+c]
      return m
    }
    const rotY = (a: number) => { const m=new Float32Array(16); m[0]=Math.cos(a); m[2]=Math.sin(a); m[5]=1; m[8]=-Math.sin(a); m[10]=Math.cos(a); m[15]=1; return m }
    const rotX = (a: number) => { const m=new Float32Array(16); m[0]=1; m[5]=Math.cos(a); m[6]=-Math.sin(a); m[9]=Math.sin(a); m[10]=Math.cos(a); m[15]=1; return m }
    const trans = (x: number, y: number, z: number) => { const m=new Float32Array(16); m[0]=m[5]=m[10]=m[15]=1; m[12]=x; m[13]=y; m[14]=z; return m }

    let mrx = 0, mry = 0, tmrx = 0, tmry = 0
    const onMove = (e: MouseEvent) => {
      tmry = (e.clientX/window.innerWidth-0.5)*1.6
      tmrx = (e.clientY/window.innerHeight-0.5)*0.9
    }
    window.addEventListener('mousemove', onMove)
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE); gl.clearColor(0,0,0,0)

    let rafId = 0
    const render = (t: number) => {
      const time = t * 0.001
      // Smooth mouse interpolation — more reactive
      mrx += (tmrx - mrx) * 0.08
      mry += (tmry - mry) * 0.08
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      const mvp = mul(
        mul(
          mul(
            persp(Math.PI/3.2, canvas!.width/canvas!.height, 0.1, 100),
            trans(0, 0, -10)
          ),
          rotX(mrx + Math.sin(time*0.04)*0.08)
        ),
        rotY(time*0.035 + mry)
      )
      gl.uniformMatrix4fv(uMVP, false, mvp)
      gl.uniform1f(uTime, time)
      gl.drawArrays(gl.POINTS, 0, N)
      rafId = requestAnimationFrame(render)
    }
    rafId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [])

  /* ── 2-D drifting orbs with mouse parallax ── */
  useEffect(() => {
    const pc = orbRef.current
    if (!pc) return
    const ctx = pc.getContext('2d')!

    function resizeOrbs() {
      if (!pc) return
      pc.width  = window.innerWidth
      pc.height = window.innerHeight
    }
    resizeOrbs()
    window.addEventListener('resize', resizeOrbs)

    const orbs = [
      { x: window.innerWidth * 0.15, y: window.innerHeight * 0.25, r: 420, dx: 0.12, dy: 0.07,  hue: 38,  sat: 80, lit: 45, a: 0.055, px: 0.10 },
      { x: window.innerWidth * 0.75, y: window.innerHeight * 0.65, r: 380, dx: -0.09, dy: 0.11, hue: 42,  sat: 70, lit: 40, a: 0.045, px: 0.07 },
      { x: window.innerWidth * 0.50, y: window.innerHeight * 0.80, r: 300, dx: 0.15, dy: -0.08, hue: 0,   sat: 85, lit: 35, a: 0.035, px: 0.13 },
      { x: window.innerWidth * 0.85, y: window.innerHeight * 0.15, r: 250, dx: -0.11, dy: 0.13, hue: 0,   sat: 70, lit: 30, a: 0.028, px: 0.06 },
      { x: window.innerWidth * 0.30, y: window.innerHeight * 0.55, r: 200, dx: 0.08,  dy: -0.12, hue: 220, sat: 80, lit: 40, a: 0.025, px: 0.09 },
    ]

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let tmx = mx, tmy = my
    const onMouse = (e: MouseEvent) => { tmx = e.clientX; tmy = e.clientY }
    window.addEventListener('mousemove', onMouse)

    let rafId = 0
    const drawOrbs = () => {
      mx += (tmx - mx) * 0.06
      my += (tmy - my) * 0.06

      ctx.clearRect(0, 0, pc.width, pc.height)
      orbs.forEach(o => {
        o.x += o.dx; o.y += o.dy
        if (o.x < -o.r) o.x = pc.width + o.r
        if (o.x > pc.width  + o.r) o.x = -o.r
        if (o.y < -o.r) o.y = pc.height + o.r
        if (o.y > pc.height + o.r) o.y = -o.r

        // Mouse parallax offset
        const ox = o.x + (mx - pc.width/2)  * o.px
        const oy = o.y + (my - pc.height/2) * o.px

        const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, o.r)
        g.addColorStop(0,   `hsla(${o.hue},${o.sat}%,${o.lit}%,${o.a})`)
        g.addColorStop(0.4, `hsla(${o.hue},${o.sat}%,${o.lit}%,${o.a * 0.4})`)
        g.addColorStop(1,   'transparent')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(ox, oy, o.r, 0, Math.PI*2)
        ctx.fill()
      })
      rafId = requestAnimationFrame(drawOrbs)
    }
    rafId = requestAnimationFrame(drawOrbs)

    return () => {
      window.removeEventListener('resize', resizeOrbs)
      window.removeEventListener('mousemove', onMouse)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <>
      <canvas ref={bgRef}
        style={{ position:'fixed', top:0, left:0, width:'100%', height:'100%', zIndex:0, pointerEvents:'none' }}
      />
      <canvas ref={orbRef}
        style={{ position:'fixed', top:0, left:0, width:'100%', height:'100%', zIndex:1, pointerEvents:'none' }}
      />
    </>
  )
}
