<template>
  <div class="physics-animation" ref="containerRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'
import { gsap } from 'gsap'

// Container ref
const containerRef = ref<HTMLElement | null>(null)

// Three.js variables
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let particles: THREE.Points
let animationFrameId: number

// Setup and animation
const setupScene = () => {
  const container = containerRef.value
  if (!container) return

  // Get container dimensions
  const width = container.clientWidth
  const height = container.clientHeight

  // Create scene
  scene = new THREE.Scene()
  
  // Create camera
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 5
  
  // Create renderer
  renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true 
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.appendChild(renderer.domElement)
  
  // Create particles
  createParticles()
  
  // Add window resize listener
  window.addEventListener('resize', onWindowResize)
  
  // Start animation
  animate()
}

const createParticles = () => {
  // Particle count and geometry
  const particleCount = 400
  const particleGeometry = new THREE.BufferGeometry()
  
  // Create positions array
  const positions = new Float32Array(particleCount * 3)
  const velocities = new Float32Array(particleCount * 3)
  
  // Create material
  const particleMaterial = new THREE.PointsMaterial({
    color: 0x1976D2,
    size: 0.05,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true
  })
  
  // Set random positions
  for (let i = 0; i < particleCount * 3; i += 3) {
    // Position within a sphere
    const radius = 2.5
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    
    positions[i] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i + 2] = radius * Math.cos(phi)
    
    // Random velocities for animation
    velocities[i] = (Math.random() - 0.5) * 0.01
    velocities[i + 1] = (Math.random() - 0.5) * 0.01
    velocities[i + 2] = (Math.random() - 0.5) * 0.01
  }
  
  // Set positions attribute
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  
  // Store velocities as a property of the geometry
  particleGeometry.userData = { velocities }
  
  // Create particles object
  particles = new THREE.Points(particleGeometry, particleMaterial)
  scene.add(particles)
  
  // Add connecting lines between close particles
  createConnections()
}

const createConnections = () => {
  const linesMaterial = new THREE.LineBasicMaterial({ 
    color: 0x1976D2,
    transparent: true,
    opacity: 0.2
  })
  
  // We'll dynamically create and update lines during animation
  // This is just to prepare the scene for connections
}

const animate = () => {
  animationFrameId = requestAnimationFrame(animate)
  
  // Rotate the entire particle system
  particles.rotation.y += 0.003
  particles.rotation.x += 0.001
  
  // Update particle positions
  const positions = particles.geometry.attributes.position
  const velocities = particles.geometry.userData.velocities
  
  for (let i = 0; i < positions.count; i++) {
    const i3 = i * 3
    
    // Update positions based on velocities
    positions.array[i3] += velocities[i3]
    positions.array[i3 + 1] += velocities[i3 + 1]
    positions.array[i3 + 2] += velocities[i3 + 2]
    
    // Contain particles within a sphere
    const distance = Math.sqrt(
      positions.array[i3] ** 2 + 
      positions.array[i3 + 1] ** 2 + 
      positions.array[i3 + 2] ** 2
    )
    
    if (distance > 2.5) {
      // Reverse velocity if particle is outside the sphere
      velocities[i3] *= -1
      velocities[i3 + 1] *= -1
      velocities[i3 + 2] *= -1
    }
  }
  
  positions.needsUpdate = true
  
  // Render scene
  renderer.render(scene, camera)
}

const onWindowResize = () => {
  const container = containerRef.value
  if (!container) return
  
  const width = container.clientWidth
  const height = container.clientHeight
  
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  
  renderer.setSize(width, height)
}

const cleanupScene = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  
  if (containerRef.value && renderer) {
    containerRef.value.removeChild(renderer.domElement)
  }
  
  window.removeEventListener('resize', onWindowResize)
}

// Lifecycle hooks
onMounted(() => {
  setupScene()
  
  // Add entry animation
  if (containerRef.value) {
    gsap.from(containerRef.value, {
      opacity: 0,
      y: 20,
      duration: 1,
      ease: 'power3.out'
    })
  }
})

onBeforeUnmount(() => {
  cleanupScene()
})
</script>

<style scoped lang="scss">
.physics-animation {
  width: 100%;
  height: 400px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (max-width: 768px) {
  .physics-animation {
    height: 300px;
  }
}
</style> 