'use client'

import { useEffect, useRef } from 'react'

export default function FilmReel3D() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    let renderer: any, scene: any, camera: any, reelGroup: any, rafId: number
    let destroyed = false

    async function init() {
      const THREE = await import('three')

      if (destroyed) return

      // ── Scene & Camera ──────────────────────────────────────────
      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
      camera.position.set(0, 0.1, 5.2)

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.4

      const size = el!.clientWidth
      renderer.setSize(size, size)
      el!.appendChild(renderer.domElement)

      // ── Lighting ────────────────────────────────────────────────
      scene.add(new THREE.AmbientLight(0xffeedd, 0.5))

      const keyLight = new THREE.DirectionalLight(0xf5a623, 3.5)
      keyLight.position.set(4, 5, 4)
      keyLight.castShadow = true
      keyLight.shadow.mapSize.setScalar(1024)
      keyLight.shadow.camera.near = 0.1
      keyLight.shadow.camera.far = 20
      scene.add(keyLight)

      const fillLight = new THREE.DirectionalLight(0x6699ff, 1.0)
      fillLight.position.set(-4, -1, 3)
      scene.add(fillLight)

      const rimLight = new THREE.DirectionalLight(0xfff0cc, 0.8)
      rimLight.position.set(0, -4, -3)
      scene.add(rimLight)

      const topLight = new THREE.PointLight(0xffcc66, 1.2, 8)
      topLight.position.set(0, 3, 2)
      scene.add(topLight)

      // ── Materials ───────────────────────────────────────────────
      const steel = new THREE.MeshStandardMaterial({
        color: 0x3a3a42, metalness: 0.85, roughness: 0.18,
        envMapIntensity: 0.6,
      })
      const amber = new THREE.MeshStandardMaterial({
        color: 0xf5a623, metalness: 0.6, roughness: 0.15,
        emissive: new THREE.Color(0xf5a623), emissiveIntensity: 0.08,
      })
      const filmMat = new THREE.MeshStandardMaterial({
        color: 0x111115, metalness: 0.1, roughness: 0.9,
      })

      // ── Geometry helpers ────────────────────────────────────────
      const R = 0.58, holeR = 0.145, holeDist = 0.30
      const centerHoleR = 0.138, plateThick = 0.038, gap = 0.28

      function makePlateShape() {
        const s = new THREE.Shape()
        s.absarc(0, 0, R, 0, Math.PI * 2, false)
        const ch = new THREE.Path(); ch.absarc(0, 0, centerHoleR, 0, Math.PI * 2, true); s.holes.push(ch)
        for (let i = 0; i < 3; i++) {
          const a = (i / 3) * Math.PI * 2 + Math.PI / 6
          const h = new THREE.Path()
          h.absarc(Math.cos(a) * holeDist, Math.sin(a) * holeDist, holeR, 0, Math.PI * 2, true)
          s.holes.push(h)
        }
        return s
      }

      function makePlate() {
        const geo = new THREE.ExtrudeGeometry(makePlateShape(), {
          depth: plateThick, bevelEnabled: true,
          bevelThickness: 0.007, bevelSize: 0.007,
          bevelSegments: 3, curveSegments: 80,
        })
        geo.rotateX(-Math.PI / 2)
        const m = new THREE.Mesh(geo, steel)
        m.castShadow = true; m.receiveShadow = true
        return m
      }

      // ── Assemble reel ───────────────────────────────────────────
      reelGroup = new THREE.Group()

      const plateB = makePlate()
      const plateT = makePlate(); plateT.position.y = gap - plateThick
      reelGroup.add(plateB, plateT)

      const hub = new THREE.Mesh(
        new THREE.CylinderGeometry(centerHoleR - 0.01, centerHoleR - 0.01, gap + 0.015, 48),
        amber
      )
      hub.position.y = gap / 2; hub.castShadow = true
      reelGroup.add(hub)

      const capGeo = new THREE.CylinderGeometry(centerHoleR + 0.025, centerHoleR + 0.025, 0.022, 48)
      ;[-0.011, gap + plateThick + 0.011].forEach(y => {
        const c = new THREE.Mesh(capGeo, amber); c.position.y = y; c.castShadow = true
        reelGroup.add(c)
      })

      // Film wound on reel
      const filmTorus = new THREE.Mesh(
        new THREE.TorusGeometry(0.365, 0.082, 32, 80), filmMat
      )
      filmTorus.rotation.x = Math.PI / 2
      filmTorus.position.y = gap / 2
      filmTorus.castShadow = true; filmTorus.receiveShadow = true
      reelGroup.add(filmTorus)

      // Thin outer rim ring highlight
      const rimRing = new THREE.Mesh(
        new THREE.TorusGeometry(R + 0.004, 0.006, 12, 80),
        new THREE.MeshStandardMaterial({ color: 0xd4a852, metalness: 0.9, roughness: 0.05 })
      )
      rimRing.rotation.x = Math.PI / 2
      rimRing.position.y = gap - plateThick / 2
      reelGroup.add(rimRing)

      // Centre reel
      const box = new THREE.Box3().setFromObject(reelGroup)
      reelGroup.position.y -= (box.min.y + box.max.y) / 2

      // Slight initial tilt — looks more 3D
      reelGroup.rotation.x = 0.18
      reelGroup.rotation.z = 0.06

      scene.add(reelGroup)

      // ── Mouse interaction (window-based, smooth) ─────────────────
      let targetX = 0, targetY = 0
      let currentX = 0, currentY = 0
      let floatT = 0

      const onMove = (e: MouseEvent) => {
        // Map full viewport to ±1 range
        targetX = (e.clientX / window.innerWidth  - 0.5) * 2   //  ±1
        targetY = (e.clientY / window.innerHeight - 0.5) * 2   //  ±1
      }
      window.addEventListener('mousemove', onMove)

      // ── Resize handler ──────────────────────────────────────────
      const onResize = () => {
        const s = el!.clientWidth
        renderer.setSize(s, s)
      }
      window.addEventListener('resize', onResize)

      // ── Render loop ─────────────────────────────────────────────
      const clock = new THREE.Clock()

      function animate() {
        if (destroyed) return
        rafId = requestAnimationFrame(animate)

        const delta = clock.getDelta()
        floatT += delta

        // Smooth mouse lag
        currentX += (targetX - currentX) * 0.04
        currentY += (targetY - currentY) * 0.04

        // Constant spin + mouse tilt
        reelGroup.rotation.y += 0.007
        reelGroup.rotation.x = 0.18 + currentY * 0.22
        reelGroup.rotation.z = 0.06 - currentX * 0.14

        // Subtle float
        reelGroup.position.y = Math.sin(floatT * 0.55) * 0.06

        // Amber glow pulse on hub
        topLight.intensity = 1.2 + Math.sin(floatT * 1.3) * 0.25

        renderer.render(scene, camera)
      }
      animate()

      ;(el as any).__cleanup = () => {
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('resize', onResize)
      }
    }

    init()

    return () => {
      destroyed = true
      cancelAnimationFrame(rafId)
      if ((el as any).__cleanup) (el as any).__cleanup()
      if (renderer) {
        renderer.dispose()
        if (renderer.domElement.parentNode === el) el!.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
