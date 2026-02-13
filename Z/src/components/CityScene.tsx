'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import * as THREE from 'three';

// Building component with enhanced windows on all sides
function Building({ position, size, color }: { position: [number, number, number]; size: [number, number, number]; color: string }) {
  const windowRows = Math.floor(size[1] / 0.6);
  const windowColsFront = Math.floor(size[0] / 0.6);
  const windowColsSide = Math.floor(size[2] / 0.6);
  
  // Randomly lit windows (some on, some off)
  const windowStates = useMemo(() => {
    const states: boolean[][] = [];
    for (let r = 0; r < windowRows; r++) {
      states[r] = [];
      for (let c = 0; c < Math.max(windowColsFront, windowColsSide); c++) {
        states[r][c] = Math.random() > 0.3;
      }
    }
    return states;
  }, [windowRows, windowColsFront, windowColsSide]);
  
  return (
    <group position={position}>
      {/* Main building body */}
      <mesh position={[0, size[1] / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
      </mesh>
      
      {/* Front windows (Z+) */}
      {Array.from({ length: windowRows }).map((_, row) =>
        Array.from({ length: windowColsFront }).map((_, col) => (
          <mesh
            key={`front-${row}-${col}`}
            position={[
              -size[0] / 2 + 0.35 + col * 0.6,
              0.5 + row * 0.6,
              size[2] / 2 + 0.01,
            ]}
          >
            <planeGeometry args={[0.4, 0.4]} />
            <meshStandardMaterial 
              color={windowStates[row][col] ? "#FFE4B5" : "#87CEEB"} 
              emissive={windowStates[row][col] ? "#FFA500" : "#4A90D9"}
              emissiveIntensity={windowStates[row][col] ? 0.5 : 0.2}
            />
          </mesh>
        ))
      )}
      
      {/* Back windows (Z-) */}
      {Array.from({ length: windowRows }).map((_, row) =>
        Array.from({ length: windowColsFront }).map((_, col) => (
          <mesh
            key={`back-${row}-${col}`}
            position={[
              -size[0] / 2 + 0.35 + col * 0.6,
              0.5 + row * 0.6,
              -size[2] / 2 - 0.01,
            ]}
            rotation={[0, Math.PI, 0]}
          >
            <planeGeometry args={[0.4, 0.4]} />
            <meshStandardMaterial 
              color={windowStates[row][col] ? "#FFE4B5" : "#87CEEB"} 
              emissive={windowStates[row][col] ? "#FFA500" : "#4A90D9"}
              emissiveIntensity={windowStates[row][col] ? 0.5 : 0.2}
            />
          </mesh>
        ))
      )}
      
      {/* Left windows (X-) */}
      {Array.from({ length: windowRows }).map((_, row) =>
        Array.from({ length: windowColsSide }).map((_, col) => (
          <mesh
            key={`left-${row}-${col}`}
            position={[
              -size[0] / 2 - 0.01,
              0.5 + row * 0.6,
              -size[2] / 2 + 0.35 + col * 0.6,
            ]}
            rotation={[0, -Math.PI / 2, 0]}
          >
            <planeGeometry args={[0.4, 0.4]} />
            <meshStandardMaterial 
              color={windowStates[row][col] ? "#FFE4B5" : "#87CEEB"} 
              emissive={windowStates[row][col] ? "#FFA500" : "#4A90D9"}
              emissiveIntensity={windowStates[row][col] ? 0.5 : 0.2}
            />
          </mesh>
        ))
      )}
      
      {/* Right windows (X+) */}
      {Array.from({ length: windowRows }).map((_, row) =>
        Array.from({ length: windowColsSide }).map((_, col) => (
          <mesh
            key={`right-${row}-${col}`}
            position={[
              size[0] / 2 + 0.01,
              0.5 + row * 0.6,
              -size[2] / 2 + 0.35 + col * 0.6,
            ]}
            rotation={[0, Math.PI / 2, 0]}
          >
            <planeGeometry args={[0.4, 0.4]} />
            <meshStandardMaterial 
              color={windowStates[row][col] ? "#FFE4B5" : "#87CEEB"} 
              emissive={windowStates[row][col] ? "#FFA500" : "#4A90D9"}
              emissiveIntensity={windowStates[row][col] ? 0.5 : 0.2}
            />
          </mesh>
        ))
      )}
      
      {/* Roof */}
      <mesh position={[0, size[1] + 0.1, 0]} castShadow>
        <boxGeometry args={[size[0] + 0.2, 0.2, size[2] + 0.2]} />
        <meshStandardMaterial color="#2c3e50" roughness={0.8} />
      </mesh>
    </group>
  );
}

// Enhanced Car component with more windows
function Car({ position, color, direction = 1 }: { position: [number, number, number]; color: string; direction?: number }) {
  const carRef = useRef<THREE.Group>(null);
  const speed = 0.02 + Math.random() * 0.02;
  
  useFrame((state, delta) => {
    if (carRef.current) {
      carRef.current.position.x += speed * direction * delta * 60;
      if (carRef.current.position.x > 25) carRef.current.position.x = -25;
      if (carRef.current.position.x < -25) carRef.current.position.x = 25;
    }
  });

  return (
    <group ref={carRef} position={position} rotation={[0, direction > 0 ? 0 : Math.PI, 0]}>
      {/* Car body */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[1.5, 0.4, 0.8]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Car top */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.8, 0.35, 0.75]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Front windshield */}
      <mesh position={[0.35, 0.55, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.05, 0.35, 0.65]} />
        <meshStandardMaterial color="#87CEEB" metalness={0.9} roughness={0.1} transparent opacity={0.8} />
      </mesh>
      
      {/* Rear windshield */}
      <mesh position={[-0.35, 0.55, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.05, 0.35, 0.65]} />
        <meshStandardMaterial color="#87CEEB" metalness={0.9} roughness={0.1} transparent opacity={0.8} />
      </mesh>
      
      {/* Side windows - left */}
      <mesh position={[0, 0.6, 0.38]}>
        <boxGeometry args={[0.65, 0.28, 0.02]} />
        <meshStandardMaterial color="#87CEEB" metalness={0.9} roughness={0.1} transparent opacity={0.8} />
      </mesh>
      
      {/* Side windows - right */}
      <mesh position={[0, 0.6, -0.38]}>
        <boxGeometry args={[0.65, 0.28, 0.02]} />
        <meshStandardMaterial color="#87CEEB" metalness={0.9} roughness={0.1} transparent opacity={0.8} />
      </mesh>
      
      {/* Window divider - left */}
      <mesh position={[0, 0.6, 0.39]}>
        <boxGeometry args={[0.02, 0.3, 0.02]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      
      {/* Window divider - right */}
      <mesh position={[0, 0.6, -0.39]}>
        <boxGeometry args={[0.02, 0.3, 0.02]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
      
      {/* Wheels */}
      {[[-0.5, 0.12, 0.4], [-0.5, 0.12, -0.4], [0.5, 0.12, 0.4], [0.5, 0.12, -0.4]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.12, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
        </mesh>
      ))}
      
      {/* Headlights */}
      <mesh position={[0.75, 0.25, 0.2]}>
        <boxGeometry args={[0.05, 0.12, 0.18]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0.75, 0.25, -0.2]}>
        <boxGeometry args={[0.05, 0.12, 0.18]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.8} />
      </mesh>
      
      {/* Taillights */}
      <mesh position={[-0.75, 0.25, 0.2]}>
        <boxGeometry args={[0.05, 0.1, 0.15]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[-0.75, 0.25, -0.2]}>
        <boxGeometry args={[0.05, 0.1, 0.15]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

// Parked car (static)
function ParkedCar({ position, color, rotation = 0 }: { position: [number, number, number]; color: string; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Car body */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[1.5, 0.4, 0.8]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Car top */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[0.8, 0.35, 0.75]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Windows */}
      <mesh position={[0.35, 0.55, 0]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.05, 0.35, 0.65]} />
        <meshStandardMaterial color="#87CEEB" metalness={0.9} roughness={0.1} transparent opacity={0.8} />
      </mesh>
      <mesh position={[-0.35, 0.55, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.05, 0.35, 0.65]} />
        <meshStandardMaterial color="#87CEEB" metalness={0.9} roughness={0.1} transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 0.6, 0.38]}>
        <boxGeometry args={[0.65, 0.28, 0.02]} />
        <meshStandardMaterial color="#87CEEB" metalness={0.9} roughness={0.1} transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 0.6, -0.38]}>
        <boxGeometry args={[0.65, 0.28, 0.02]} />
        <meshStandardMaterial color="#87CEEB" metalness={0.9} roughness={0.1} transparent opacity={0.8} />
      </mesh>
      
      {/* Wheels */}
      {[[-0.5, 0.12, 0.4], [-0.5, 0.12, -0.4], [0.5, 0.12, 0.4], [0.5, 0.12, -0.4]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.12, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// Bus component with more windows
function Bus({ position, color, direction = 1 }: { position: [number, number, number]; color: string; direction?: number }) {
  const busRef = useRef<THREE.Group>(null);
  const speed = 0.015 + Math.random() * 0.01;
  
  useFrame((state, delta) => {
    if (busRef.current) {
      busRef.current.position.x += speed * direction * delta * 60;
      if (busRef.current.position.x > 25) busRef.current.position.x = -25;
      if (busRef.current.position.x < -25) busRef.current.position.x = 25;
    }
  });

  return (
    <group ref={busRef} position={position} rotation={[0, direction > 0 ? 0 : Math.PI, 0]}>
      {/* Bus body */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[3.5, 1.2, 1.1]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.6} />
      </mesh>
      
      {/* Windows - side left (more windows) */}
      {[-1.3, -0.65, 0, 0.65, 1.3].map((x, i) => (
        <mesh key={`left-${i}`} position={[x, 0.85, 0.56]}>
          <boxGeometry args={[0.5, 0.5, 0.02]} />
          <meshStandardMaterial color="#87CEEB" metalness={0.9} roughness={0.1} transparent opacity={0.7} />
        </mesh>
      ))}
      
      {/* Windows - side right */}
      {[-1.3, -0.65, 0, 0.65, 1.3].map((x, i) => (
        <mesh key={`right-${i}`} position={[x, 0.85, -0.56]}>
          <boxGeometry args={[0.5, 0.5, 0.02]} />
          <meshStandardMaterial color="#87CEEB" metalness={0.9} roughness={0.1} transparent opacity={0.7} />
        </mesh>
      ))}
      
      {/* Front window */}
      <mesh position={[1.76, 0.75, 0]}>
        <boxGeometry args={[0.02, 0.7, 0.9]} />
        <meshStandardMaterial color="#87CEEB" metalness={0.9} roughness={0.1} transparent opacity={0.7} />
      </mesh>
      
      {/* Rear window */}
      <mesh position={[-1.76, 0.75, 0]}>
        <boxGeometry args={[0.02, 0.5, 0.8]} />
        <meshStandardMaterial color="#87CEEB" metalness={0.9} roughness={0.1} transparent opacity={0.7} />
      </mesh>
      
      {/* Wheels */}
      {[[-1.1, 0.22, 0.55], [-1.1, 0.22, -0.55], [1.1, 0.22, 0.55], [1.1, 0.22, -0.55]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.22, 0.18, 16]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
        </mesh>
      ))}
      
      {/* Headlights */}
      <mesh position={[1.76, 0.4, 0.35]}>
        <boxGeometry args={[0.05, 0.18, 0.25]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[1.76, 0.4, -0.35]}>
        <boxGeometry args={[0.05, 0.18, 0.25]} />
        <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={0.8} />
      </mesh>
      
      {/* Bus number display */}
      <mesh position={[1.77, 1.1, 0]}>
        <boxGeometry args={[0.02, 0.2, 0.6]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
    </group>
  );
}

// Road component
function Road({ position, length, width = 4, lanes = 2 }: { position: [number, number, number]; length: number; width?: number; lanes?: number }) {
  const lineCount = Math.floor(length / 3);
  
  return (
    <group position={position}>
      {/* Road surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[length, width]} />
        <meshStandardMaterial color="#2c3e50" roughness={0.9} />
      </mesh>
      
      {/* Center lines for multi-lane */}
      {lanes >= 2 && Array.from({ length: lineCount }).map((_, i) => (
        <mesh key={i} position={[-length / 2 + 1.5 + i * 3, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.5, 0.15]} />
          <meshStandardMaterial color="#f1c40f" />
        </mesh>
      ))}
      
      {/* Side lines */}
      <mesh position={[0, 0.01, width / 2 - 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[length, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0.01, -width / 2 + 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[length, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Sidewalks */}
      <mesh position={[0, 0.05, width / 2 + 0.4]} receiveShadow>
        <boxGeometry args={[length, 0.1, 0.8]} />
        <meshStandardMaterial color="#95a5a6" />
      </mesh>
      <mesh position={[0, 0.05, -width / 2 - 0.4]} receiveShadow>
        <boxGeometry args={[length, 0.1, 0.8]} />
        <meshStandardMaterial color="#95a5a6" />
      </mesh>
    </group>
  );
}

// Highway component (elevated multi-lane road)
function Highway({ position, length }: { position: [number, number, number]; length: number }) {
  const lineCount = Math.floor(length / 4);
  
  return (
    <group position={position}>
      {/* Highway pillars */}
      {[-20, -10, 0, 10, 20].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 1.5, 2]} castShadow>
            <boxGeometry args={[0.8, 3, 0.8]} />
            <meshStandardMaterial color="#7f8c8d" />
          </mesh>
          <mesh position={[x, 1.5, -2]} castShadow>
            <boxGeometry args={[0.8, 3, 0.8]} />
            <meshStandardMaterial color="#7f8c8d" />
          </mesh>
        </group>
      ))}
      
      {/* Highway deck */}
      <mesh position={[0, 3.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, 0.4, 8]} />
        <meshStandardMaterial color="#5d6d7e" roughness={0.8} />
      </mesh>
      
      {/* Highway barriers */}
      <mesh position={[0, 3.5, 3.8]} castShadow>
        <boxGeometry args={[length, 0.3, 0.2]} />
        <meshStandardMaterial color="#bdc3c7" />
      </mesh>
      <mesh position={[0, 3.5, -3.8]} castShadow>
        <boxGeometry args={[length, 0.3, 0.2]} />
        <meshStandardMaterial color="#bdc3c7" />
      </mesh>
      
      {/* Lane markings */}
      {Array.from({ length: lineCount }).map((_, i) => (
        <mesh key={i} position={[-length / 2 + 2 + i * 4, 3.41, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.5, 0.2]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      ))}
      
      {/* Highway sign */}
      <group position={[15, 5, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.2, 2.5, 0.2]} />
          <meshStandardMaterial color="#34495e" />
        </mesh>
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[3, 1, 0.1]} />
          <meshStandardMaterial color="#2ecc71" />
        </mesh>
      </group>
    </group>
  );
}

// Carpark component
function Carpark({ position }: { position: [number, number, number] }) {
  const carColors = ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'];
  
  return (
    <group position={position}>
      {/* Carpark surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial color="#7f8c8d" roughness={0.9} />
      </mesh>
      
      {/* Parking lines */}
      {[-4, -2, 0, 2, 4].map((z, i) => 
        [-4, 0, 4].map((x, j) => (
          <mesh key={`${i}-${j}`} position={[x, 0.03, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2, 0.1]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        ))
      )}
      
      {/* Side lines */}
      <mesh position={[0, 0.03, -4]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[8, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 0.03, 4]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[8, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Parked cars */}
      {[
        [-4, -2, 0], [-4, 2, 0.5],
        [0, -2, 0.3], [0, 2, 0.7],
        [4, -2, 0.2], [4, 2, 0.6],
      ].map((pos, i) => (
        <ParkedCar
          key={i}
          position={[pos[0] as number, 0, pos[1] as number]}
          color={carColors[Math.floor((pos[2] as number) * carColors.length) % carColors.length]}
          rotation={Math.random() > 0.5 ? 0 : Math.PI}
        />
      ))}
    </group>
  );
}

// Pedestrian path component
function Path({ position, length, width = 1.5 }: { position: [number, number, number]; length: number; width?: number }) {
  return (
    <group position={position}>
      {/* Path surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[length, width]} />
        <meshStandardMaterial color="#d5dbdb" roughness={0.8} />
      </mesh>
      
      {/* Path tiles pattern */}
      {Array.from({ length: Math.floor(length / 1) }).map((_, i) => (
        <mesh key={i} position={[-length / 2 + 0.5 + i, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.9, width - 0.2]} />
          <meshStandardMaterial color="#bdc3c7" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

// Street lamp
function StreetLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.08, 3, 8]} />
        <meshStandardMaterial color="#34495e" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0.3, 2.9, 0]} castShadow>
        <boxGeometry args={[0.6, 0.1, 0.1]} />
        <meshStandardMaterial color="#34495e" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0.5, 2.8, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#fff8dc" emissive="#fff8dc" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

// Tree component
function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 1, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.3, 0]} castShadow>
        <coneGeometry args={[0.5, 1.2, 8]} />
        <meshStandardMaterial color="#228B22" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.8, 0]} castShadow>
        <coneGeometry args={[0.4, 1, 8]} />
        <meshStandardMaterial color="#228B22" roughness={0.8} />
      </mesh>
    </group>
  );
}

// Main city content
function CityContent() {
  const buildings = useMemo(() => [
    // Back row buildings (behind highway)
    { position: [-22, 0, -18] as [number, number, number], size: [5, 14, 5] as [number, number, number], color: '#e74c3c' },
    { position: [-14, 0, -18] as [number, number, number], size: [4, 10, 4] as [number, number, number], color: '#3498db' },
    { position: [-6, 0, -18] as [number, number, number], size: [6, 18, 5] as [number, number, number], color: '#9b59b6' },
    { position: [3, 0, -18] as [number, number, number], size: [5, 12, 4] as [number, number, number], color: '#1abc9c' },
    { position: [12, 0, -18] as [number, number, number], size: [4, 8, 5] as [number, number, number], color: '#e67e22' },
    { position: [20, 0, -18] as [number, number, number], size: [5, 15, 5] as [number, number, number], color: '#2ecc71' },
    
    // Front row buildings
    { position: [-18, 0, 14] as [number, number, number], size: [4, 12, 4] as [number, number, number], color: '#3498db' },
    { position: [-10, 0, 14] as [number, number, number], size: [3, 7, 3] as [number, number, number], color: '#e74c3c' },
    { position: [8, 0, 14] as [number, number, number], size: [5, 16, 5] as [number, number, number], color: '#8e44ad' },
    { position: [18, 0, 14] as [number, number, number], size: [4, 9, 4] as [number, number, number], color: '#f39c12' },
  ], []);

  const cars = useMemo(() => [
    // Main road cars
    { position: [-10, 0, 1] as [number, number, number], color: '#e74c3c', direction: 1 },
    { position: [8, 0, 1] as [number, number, number], color: '#3498db', direction: 1 },
    { position: [-2, 0, 1] as [number, number, number], color: '#f1c40f', direction: 1 },
    { position: [15, 0, -1] as [number, number, number], color: '#2ecc71', direction: -1 },
    { position: [-8, 0, -1] as [number, number, number], color: '#9b59b6', direction: -1 },
    { position: [4, 0, -1] as [number, number, number], color: '#1abc9c', direction: -1 },
    
    // Highway cars (elevated, faster)
    { position: [-15, 3.4, 1.5] as [number, number, number], color: '#e67e22', direction: 1 },
    { position: [5, 3.4, 1.5] as [number, number, number], color: '#16a085', direction: 1 },
    { position: [-5, 3.4, -1.5] as [number, number, number], color: '#c0392b', direction: -1 },
    { position: [12, 3.4, -1.5] as [number, number, number], color: '#2980b9', direction: -1 },
    
    // Side street cars
    { position: [-20, 0, 9] as [number, number, number], color: '#8e44ad', direction: 1 },
    { position: [-25, 0, 9] as [number, number, number], color: '#27ae60', direction: -1 },
  ], []);

  const buses = useMemo(() => [
    { position: [-15, 0, -1.5] as [number, number, number], color: '#e67e22', direction: 1 },
    { position: [10, 0, 1.5] as [number, number, number], color: '#2980b9', direction: -1 },
    { position: [0, 3.4, 0] as [number, number, number], color: '#27ae60', direction: 1 },
  ], []);

  return (
    <>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#7cb342" roughness={1} />
      </mesh>
      
      {/* Highway (elevated) */}
      <Highway position={[0, 0, -10]} length={50} />
      
      {/* Main Road */}
      <Road position={[0, 0, 0]} length={50} width={4} lanes={2} />
      
      {/* Side Street */}
      <Road position={[-20, 0, 10]} length={20} width={3} lanes={2} />
      
      {/* Additional Street */}
      <Road position={[20, 0, 5]} length={25} width={3} lanes={2} />
      
      {/* Carparks */}
      <Carpark position={[-8, 0, 20]} />
      <Carpark position={[15, 0, 20]} />
      
      {/* Pedestrian Paths */}
      <Path position={[0, 0, 5]} length={50} width={2} />
      <Path position={[0, 0, -5]} length={50} width={2} />
      <Path position={[-8, 0, 12]} length={15} width={1.5} />
      <Path position={[15, 0, 12]} length={15} width={1.5} />
      
      {/* Buildings */}
      {buildings.map((building, i) => (
        <Building key={i} {...building} />
      ))}
      
      {/* Cars */}
      {cars.map((car, i) => (
        <Car key={i} {...car} />
      ))}
      
      {/* Buses */}
      {buses.map((bus, i) => (
        <Bus key={i} {...bus} />
      ))}
      
      {/* Street Lamps */}
      {[-20, -10, 0, 10, 20].map((x, i) => (
        <StreetLamp key={i} position={[x, 0, 4]} />
      ))}
      {[-20, -10, 0, 10, 20].map((x, i) => (
        <StreetLamp key={i} position={[x, 0, -4]} />
      ))}
      
      {/* Trees */}
      {[-25, -15, 15, 25].map((x, i) => (
        <Tree key={i} position={[x, 0, 7]} />
      ))}
      {[-25, -15, 15, 25].map((x, i) => (
        <Tree key={i} position={[x, 0, -7]} />
      ))}
    </>
  );
}

export default function CityScene() {
  return (
    <div className="w-full h-screen bg-gradient-to-b from-sky-400 to-sky-200">
      <Canvas
        shadows
        camera={{ position: [35, 25, 35], fov: 50 }}
      >
        {/* Sky and environment */}
        <Sky sunPosition={[100, 100, 20]} />
        <fog attach="fog" args={['#87CEEB', 40, 100]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 20, 10]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={80}
          shadow-camera-left={-50}
          shadow-camera-right={50}
          shadow-camera-top={50}
          shadow-camera-bottom={-50}
        />
        <pointLight position={[0, 10, 0]} intensity={0.3} />
        
        {/* City content */}
        <CityContent />
        
        {/* Camera controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={80}
          maxPolarAngle={Math.PI / 2 - 0.1}
        />
      </Canvas>
      
      {/* UI Overlay */}
      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <h1 className="text-xl font-bold text-gray-800 mb-2">3D City Scene</h1>
        <p className="text-sm text-gray-600">Drag to rotate • Scroll to zoom • Right-click to pan</p>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <h2 className="text-sm font-semibold text-gray-800 mb-2">Legend</h2>
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-red-500"></div>
            <span>Cars (moving on roads)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-orange-500"></div>
            <span>Buses (moving on roads)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gray-500"></div>
            <span>Highway (elevated)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-blue-500"></div>
            <span>Buildings with windows</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gray-400"></div>
            <span>Carparks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-gray-300"></div>
            <span>Pedestrian paths</span>
          </div>
        </div>
      </div>
    </div>
  );
}
