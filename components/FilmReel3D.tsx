'use client'

import { useEffect, useRef } from 'react'

export default function FilmReel3D() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return
    const el = mountRef.current

    let renderer: any, scene: any, camera: any, reel: any, rafId: number
    let THREE: any

    async function init() {
      const mod = await import('three')
      THREE = mod

      // Scene
      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
      camera.position.set(0, 0, 4.5)

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(el.clientWidth, el.clientHeight)
      renderer.shadowMap.enabled = true
      el.appendChild(renderer.domElement)

      // Lighting
      const ambient = new THREE.AmbientLight(0xfff5e0, 0.6)
      scene.add(ambient)
      const key = new THREE.DirectionalLight(0xf5a623, 2.4)
      key.position.set(3, 4, 3)
      key.castShadow = true
      scene.add(key)
      const fill = new THREE.DirectionalLight(0x88aaff, 0.7)
      fill.position.set(-3, -1, 2)
      scene.add(fill)
      const rim = new THREE.DirectionalLight(0xffffff, 0.4)
      rim.position.set(0, -3, -2)
      scene.add(rim)

      // Materials
      const steel = new THREE.MeshStandardMaterial({ color: 0x2e2e33, metalness: 0.7, roughness: 0.3 })
      const amber = new THREE.MeshStandardMaterial({ color: 0xf5a623, metalness: 0.5, roughness: 0.2 })
      const film  = new THREE.MeshStandardMaterial({ color: 0x0c0c0c, metalness: 0.05, roughness: 0.85 })

      const R = 0.55, holeR = 0.14, holeDist = 0.30, centerHoleR = 0.135
      const plateThick = 0.035, gap = 0.26

      function makePlateShape() {
        const shape = new THREE.Shape()
        shape.absarc(0, 0, R, 0, Math.PI * 2, false)
        const ch = new THREE.Path(); ch.absarc(0, 0, centerHoleR, 0, Math.PI * 2, true); shape.holes.push(ch)
        for (let i = 0; i < 3; i++) {
          const ang = (i / 3) * Math.PI * 2 + Math.PI / 6
          const hole = new THREE.Path()
          hole.absarc(Math.cos(ang) * holeDist, Math.sin(ang) * holeDist, holeR, 0, Math.PI * 2, true)
          shape.holes.push(hole)
        }
        return shape
      }

      function makePlate() {
        const geo = new THREE.ExtrudeGeometry(makePlateShape(), {
          depth: plateThick, bevelEnabled: true,
          bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 2, curveSegments: 64,
        })
        geo.rotateX(-Math.PI / 2)
        const m = new THREE.Mesh(geo, steel)
        m.castShadow = true; m.receiveShadow = true
        return m
      }

      reel = new THREE.Group()

      const plateB = makePlate(); plateB.position.y = 0
      const plateT = makePlate(); plateT.position.y = gap - plateThick
      reel.add(plateB, plateT)

      const hub = new THREE.Mesh(new THREE.CylinderGeometry(centerHoleR - 0.01, centerHoleR - 0.01, gap + 0.01, 32), amber)
      hub.position.y = gap / 2; hub.castShadow = true; reel.add(hub)

      const cap = new THREE.Mesh(new THREE.CylinderGeometry(centerHoleR + 0.02, centerHoleR + 0.02, 0.018, 32), amber)
      cap.position.y = gap + plateThick + 0.009; cap.castShadow = true; reel.add(cap)

      const filmTorus = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.075, 24, 64), film)
      filmTorus.rotation.x = Math.PI / 2; filmTorus.position.y = gap / 2
      filmTorus.castShadow = true; filmTorus.receiveShadow = true; reel.add(filmTorus)

      // Centre & stand
      const box = new THREE.Box3().setFromObject(reel)
      reel.position.y -= box.min.y + (box.max.y - box.min.y) / 2

      scene.add(reel)

      // Mouse tilt
      let tx = 0, ty = 0, cx = 0, cy = 0
      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect()
        tx = ((e.clientX - rect.left) / rect.width  - 0.5) * 0.6
        ty = ((e.clientY - rect.top)  / rect.height - 0.5) * 0.4
      }
      window.addEventListener('mousemove', onMove)

      function animate() {
        rafId = requestAnimationFrame(animate)
        cx += (tx - cx) * 0.06
        cy += (ty - cy) * 0.06
        reel.rotation.y += 0.008
        reel.rotation.x = cy * 0.5
        renderer.render(scene, camera)
      }
      animate()

      const cleanup = () => { window.removeEventListener('mousemove', onMove) }
      ;(el as any).__cleanup = cleanup
    }

    init()

    return () => {
      cancelAnimationFrame(rafId)
      if ((el as any).__cleanup) (el as any).__cleanup()
      if (renderer) {
        renderer.dispose()
        if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  )
}
