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

    const vs = `
      attribute vec3 aPos; attribute float aSize; attribute float aAlpha;
      uniform mat4 uMVP; uniform float uTime; varying float vAlpha;
      void main(){
        vec3 p=aPos;
        p.z+=sin(uTime*0.3+aPos.x*2.0)*0.5;
        p.y+=cos(uTime*0.2+aPos.z*1.5)*0.3;
        gl_Position=uMVP*vec4(p,1.0);
        gl_PointSize=aSize*(1.0/(1.0+abs(p.z)*0.1));
        vAlpha=aAlpha;
      }`
    const fs = `
      precision mediump float; varying float vAlpha; uniform vec3 uColor;
      void main(){
        float d=distance(gl_PointCoord,vec2(0.5));
        if(d>0.5) discard;
        gl_FragColor=vec4(uColor, smoothstep(0.5,0.0,d)*vAlpha);
      }`

    function mkShader(type: number, src: string) {
      const s = gl!.createShader(type)!
      gl!.shaderSource(s, src); gl!.compileShader(s); return s
    }
    const prog = gl.createProgram()!
    gl.attachShader(prog, mkShader(gl.VERTEX_SHADER, vs))
    gl.attachShader(prog, mkShader(gl.FRAGMENT_SHADER, fs))
    gl.linkProgram(prog); gl.useProgram(prog)

    const N = 800
    const pos    = new Float32Array(N * 3)
    const sizes  = new Float32Array(N)
    const alphas = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      pos[i*3]   = (Math.random()-0.5)*20
      pos[i*3+1] = (Math.random()-0.5)*20
      pos[i*3+2] = (Math.random()-0.5)*20
      sizes[i]   = Math.random()*3+0.5
      alphas[i]  = Math.random()*0.6+0.1
    }

    function mkBuf(data: Float32Array, attr: string, sz: number) {
      const b = gl!.createBuffer()!
      gl!.bindBuffer(gl!.ARRAY_BUFFER, b)
      gl!.bufferData(gl!.ARRAY_BUFFER, data, gl!.STATIC_DRAW)
      const l = gl!.getAttribLocation(prog, attr)
      gl!.enableVertexAttribArray(l)
      gl!.vertexAttribPointer(l, sz, gl!.FLOAT, false, 0, 0)
    }
    mkBuf(pos, 'aPos', 3); mkBuf(sizes, 'aSize', 1); mkBuf(alphas, 'aAlpha', 1)

    const uMVP   = gl.getUniformLocation(prog, 'uMVP')!
    const uTime  = gl.getUniformLocation(prog, 'uTime')!
    const uColor = gl.getUniformLocation(prog, 'uColor')!
    gl.uniform3f(uColor, 0.83, 0.66, 0.32)

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

    let mrx = 0, mry = 0
    const onMove = (e: MouseEvent) => {
      mry = (e.clientX/window.innerWidth-0.5)*0.8
      mrx = (e.clientY/window.innerHeight-0.5)*0.4
    }
    window.addEventListener('mousemove', onMove)
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE); gl.clearColor(0,0,0,0)

    let rafId = 0
    const render = (t: number) => {
      const time = t * 0.001
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
      const mvp = mul(
        mul(
          mul(persp(Math.PI/3, canvas!.width/canvas!.height, 0.1, 100), trans(0,0,-8)),
          rotX(mrx+Math.sin(time*0.05)*0.1)
        ),
        rotY(time*0.04+mry)
      )
      gl.useProgram(prog)
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

  /* ── 2-D drifting orbs ── */
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

    const orbs = Array.from({ length: 5 }, (_, i) => ({
      x:   Math.random() * window.innerWidth,
      y:   Math.random() * window.innerHeight,
      r:   Math.random() * 300 + 200,
      dx:  (Math.random()-0.5) * 0.2,
      dy:  (Math.random()-0.5) * 0.2,
      hue: i < 2 ? 38 : i < 4 ? 0 : 220,
      sat: i < 4 ? 70 : 80,
    }))

    let rafId = 0
    const drawOrbs = () => {
      ctx.clearRect(0, 0, pc.width, pc.height)
      orbs.forEach(o => {
        o.x += o.dx; o.y += o.dy
        if (o.x < -o.r) o.x = pc.width + o.r
        if (o.x > pc.width  + o.r) o.x = -o.r
        if (o.y < -o.r) o.y = pc.height + o.r
        if (o.y > pc.height + o.r) o.y = -o.r
        const g = ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,o.r)
        g.addColorStop(0, `hsla(${o.hue},${o.sat}%,40%,0.04)`)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g; ctx.beginPath()
        ctx.arc(o.x,o.y,o.r,0,Math.PI*2); ctx.fill()
      })
      rafId = requestAnimationFrame(drawOrbs)
    }
    rafId = requestAnimationFrame(drawOrbs)

    return () => {
      window.removeEventListener('resize', resizeOrbs)
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
