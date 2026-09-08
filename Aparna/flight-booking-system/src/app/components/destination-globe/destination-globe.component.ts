import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Output,
  EventEmitter,
  inject,
  PLATFORM_ID,
  NgZone
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import * as THREE from 'three';

export interface DestinationNode {
  name: string;
  country: string;
  code: string;
  lat: number;
  lng: number;
  image: string;
  price: string;
}

export const DESTINATIONS_DATA: DestinationNode[] = [
  { name: 'Tokyo', country: 'Japan', code: 'HND', lat: 35.6762, lng: 139.6503, image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&q=80', price: '48,500' },
  { name: 'Paris', country: 'France', code: 'CDG', lat: 48.8566, lng: 2.3522, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80', price: '42,000' },
  { name: 'New York', country: 'United States', code: 'JFK', lat: 40.7128, lng: -74.0060, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80', price: '56,000' },
  { name: 'Dubai', country: 'United Arab Emirates', code: 'DXB', lat: 25.2048, lng: 55.2708, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80', price: '28,000' },
  { name: 'London', country: 'United Kingdom', code: 'LHR', lat: 51.5074, lng: -0.1278, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80', price: '39,500' },
  { name: 'Rome', country: 'Italy', code: 'FCO', lat: 41.9028, lng: 12.4964, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&q=80', price: '44,000' },
  { name: 'Sydney', country: 'Australia', code: 'SYD', lat: -33.8688, lng: 151.2093, image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&q=80', price: '52,000' },
  { name: 'Singapore', country: 'Singapore', code: 'SIN', lat: 1.3521, lng: 103.8198, image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80', price: '24,500' }
];

const CURATED_PHOTO_URLS = [
  'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=200&q=70',
  'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=200&q=70',
  'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=200&q=70',
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=200&q=70',
  'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=200&q=70',
  'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=200&q=70',
  'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=200&q=70',
  'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=200&q=70'
];

@Component({
  selector: 'app-destination-globe',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './destination-globe.component.html',
  styleUrl: './destination-globe.component.css'
})
export class DestinationGlobeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('globeContainer', { static: true }) globeContainer!: ElementRef<HTMLDivElement>;
  @Output() activeDestination = new EventEmitter<DestinationNode>();

  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private animationFrameId!: number;

  private globeGroup!: THREE.Group;

  // Paper Plane (separate from globe group so it stays in front)
  private paperPlaneMesh!: THREE.Group;
  private elapsedTime = 0;
  private currentDestIndex = 0;
  private destCycleTimer = 0;

  // Rotation & Interaction
  private isDragging = false;
  private previousMousePosition = { x: 0, y: 0 };
  private autoRotateSpeed = 0.0035;

  isLoading = true;

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        this.initThree();
        this.buildScene();
        this.setupInteractions();
        this.animate();
      });
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
      if (this.renderer) {
        this.renderer.dispose();
      }
    }
  }

  private initThree(): void {
    const container = this.globeContainer.nativeElement;
    const width = container.clientWidth || 96;
    const height = container.clientHeight || 96;

    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 115);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);

    container.appendChild(this.renderer.domElement);

    // Globe Group (tiles only, rotates)
    this.globeGroup = new THREE.Group();
    this.scene.add(this.globeGroup);

    // Build photo globe shell
    this.buildDensePhotoGlobe();

    // Build paper plane (added to scene directly, NOT globeGroup, so it stays in front)
    this.paperPlaneMesh = this.createOrigamiPaperPlaneMesh();
    this.scene.add(this.paperPlaneMesh);

    this.isLoading = false;
  }

  private buildScene(): void {
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.4);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xFFF6E8, 1.2);
    dirLight.position.set(50, 60, 80);
    this.scene.add(dirLight);
  }

  private buildDensePhotoGlobe(): void {
    const textureLoader = new THREE.TextureLoader();
    const textures = CURATED_PHOTO_URLS.map(url => textureLoader.load(url));

    const radius = 45;
    const totalTiles = 120;
    const phiSpan = Math.PI * (3 - Math.sqrt(5));

    const tileGeo = new THREE.PlaneGeometry(8.5, 6.2);

    for (let i = 0; i < totalTiles; i++) {
      const y = 1 - (i / (totalTiles - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phiSpan * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      const pos = new THREE.Vector3(x, y, z).multiplyScalar(radius);

      const texIndex = i % textures.length;
      const material = new THREE.MeshBasicMaterial({
        map: textures[texIndex],
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(tileGeo, material);
      mesh.position.copy(pos);
      mesh.lookAt(pos.clone().multiplyScalar(2));

      const goldBorderMat = new THREE.LineBasicMaterial({ color: 0xB58A4A, transparent: true, opacity: 0.7 });
      const edges = new THREE.EdgesGeometry(tileGeo);
      const border = new THREE.LineSegments(edges, goldBorderMat);
      mesh.add(border);

      this.globeGroup.add(mesh);
    }
  }

  private createOrigamiPaperPlaneMesh(): THREE.Group {
    const planeGroup = new THREE.Group();

    // Left Wing
    const leftWingGeo = new THREE.BufferGeometry();
    const leftVerts = new Float32Array([
      0, 0, 5,
      -4.8, 1.2, -4,
      0, -0.8, -3.5
    ]);
    leftWingGeo.setAttribute('position', new THREE.BufferAttribute(leftVerts, 3));
    leftWingGeo.computeVertexNormals();
    const leftMat = new THREE.MeshStandardMaterial({
      color: 0x101A2B,
      roughness: 0.3,
      metalness: 0.2,
      side: THREE.DoubleSide
    });
    planeGroup.add(new THREE.Mesh(leftWingGeo, leftMat));

    // Right Wing
    const rightWingGeo = new THREE.BufferGeometry();
    const rightVerts = new Float32Array([
      0, 0, 5,
      4.8, 1.2, -4,
      0, -0.8, -3.5
    ]);
    rightWingGeo.setAttribute('position', new THREE.BufferAttribute(rightVerts, 3));
    rightWingGeo.computeVertexNormals();
    const rightMat = new THREE.MeshStandardMaterial({
      color: 0x1B2C47,
      roughness: 0.3,
      metalness: 0.2,
      side: THREE.DoubleSide
    });
    planeGroup.add(new THREE.Mesh(rightWingGeo, rightMat));

    // Central Fold Keel (Gold)
    const creaseGeo = new THREE.BufferGeometry();
    const creaseVerts = new Float32Array([
      0, 0, 5.2,
      0, -0.9, -3.8
    ]);
    creaseGeo.setAttribute('position', new THREE.BufferAttribute(creaseVerts, 3));
    planeGroup.add(new THREE.Line(creaseGeo, new THREE.LineBasicMaterial({ color: 0xD0A866, linewidth: 2 })));

    // Gold Wing Edges
    const edgeGeo = new THREE.BufferGeometry();
    const edgeVerts = new Float32Array([
      -4.8, 1.2, -4,
      0, 0, 5.2,
      4.8, 1.2, -4
    ]);
    edgeGeo.setAttribute('position', new THREE.BufferAttribute(edgeVerts, 3));
    planeGroup.add(new THREE.Line(edgeGeo, new THREE.LineBasicMaterial({ color: 0xD0A866 })));

    // Scale it big
    planeGroup.scale.set(2.4, 2.4, 2.4);

    // Rotate so the nose points to the right (like flying rightward)
    planeGroup.rotation.y = -Math.PI / 2;

    return planeGroup;
  }

  private animate = (): void => {
    this.animationFrameId = requestAnimationFrame(this.animate);

    this.elapsedTime += 0.016; // ~60fps frame time

    // 1. Globe auto-rotation
    if (!this.isDragging) {
      this.globeGroup.rotation.y += this.autoRotateSpeed;
      this.globeGroup.rotation.x += this.autoRotateSpeed * 0.15;
    }

    // 2. Paper plane: stays in FRONT of globe, bobs up and down smoothly
    if (this.paperPlaneMesh) {
      // Fixed X position (right side of globe), fixed Z (in front), Y bobs up/down
      const bobAmplitude = 18;  // how far up and down
      const bobSpeed = 0.8;     // bob frequency
      const yOffset = Math.sin(this.elapsedTime * bobSpeed) * bobAmplitude;

      // Position: slightly right of center, in front of globe (positive Z)
      this.paperPlaneMesh.position.set(20, yOffset, 55);

      // Tilt the plane slightly based on direction of motion (going up vs down)
      const tiltAngle = Math.cos(this.elapsedTime * bobSpeed) * 0.3; // subtle nose up/down tilt
      this.paperPlaneMesh.rotation.x = 0;
      this.paperPlaneMesh.rotation.z = tiltAngle;
    }

    // 3. Cycle destination cards every ~4 seconds
    this.destCycleTimer += 0.016;
    if (this.destCycleTimer >= 4) {
      this.destCycleTimer = 0;
      this.currentDestIndex = (this.currentDestIndex + 1) % DESTINATIONS_DATA.length;
      this.ngZone.run(() => {
        this.activeDestination.emit(DESTINATIONS_DATA[this.currentDestIndex]);
      });
    }

    this.renderer.render(this.scene, this.camera);
  };

  private setupInteractions(): void {
    const el = this.globeContainer.nativeElement;

    el.addEventListener('mousedown', (e: MouseEvent) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    el.addEventListener('touchstart', (e: TouchEvent) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });

    window.addEventListener('mousemove', (e: MouseEvent) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.globeGroup.rotation.y += deltaX * 0.008;
      this.globeGroup.rotation.x += deltaY * 0.008;

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('touchmove', (e: TouchEvent) => {
      if (!this.isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
      const deltaY = e.touches[0].clientY - this.previousMousePosition.y;

      this.globeGroup.rotation.y += deltaX * 0.008;
      this.globeGroup.rotation.x += deltaY * 0.008;

      this.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });

    window.addEventListener('resize', this.onWindowResize);
  }

  private onWindowResize = (): void => {
    if (!this.globeContainer || !this.renderer || !this.camera) return;
    const container = this.globeContainer.nativeElement;
    const width = container.clientWidth || 96;
    const height = container.clientHeight || 96;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };
}
