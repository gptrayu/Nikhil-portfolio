import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import './style.css';

// --- CONTENT ---
const portfolioData = {
  name: "NIKHIL GUPTA",
  slogan: "BE THE REAL YOU",
  about: {
    summary: "Enthusiastic Computer Science undergraduate at IIIT Tiruchirappalli with a strong track record of building practical solutions in Artificial Intelligence, Machine Learning, Data Science, and NLP. Skilled in transforming ideas into deployable applications using modern tools like YOLOv8, Transformers, LangChain, and FastAPI.",
    education: "Indian Institute of Information Technology, Tiruchirappalli - B.Tech in Computer Science and Engineering — Expected Graduation: 2026, CGPA: 8+",
  },
  projects: [
    { name: "Vehicle Monitor System", desc: "Real-time vehicle tracking and license plate detection using YOLOv8.", tech: ["YOLOv8", "OpenCV", "FastAPI"], link: "https://github.com/nikhilitz/Vehicle-Monitor" },
    { name: "Vision.ai", desc: "AI tool for image captioning and text-to-speech, enhancing digital accessibility.", tech: ["CNN-Transformer", "Docker", "Streamlit"], link: "https://github.com/nikhilitz/Vision.ai" },
    { name: "Data Analyst Agent", desc: "Conversational AI for data analysis using LangChain and PandasAI.", tech: ["LangChain", "PandasAI", "NLP"], link: "https://github.com/nikhilitz/data_analyst_agent" },
    { name: "AskTube - YouTube QA", desc: "Ask questions about YouTube videos and get instant answers via a RAG pipeline.", tech: ["RAG", "FAISS", "LLMs"], link: "https://github.com/nikhilitz/AskTube" },
  ],
  skills: {
    areas: ["Computer Vision", "NLP", "LLMs", "RAG Pipelines", "Data Analysis"],
    frameworks: ["PyTorch", "TensorFlow", "Scikit-learn", "Hugging Face", "LangChain", "FastAPI", "Docker"],
  },
  experience: [
      { role: "AI Intern", org: "Trivy Tech Pvt Ltd", desc: "Developed a comprehensive AI surveillance system for real-time RTSP stream analysis, integrating ArcFace for facial recognition and a YOLO model for threat detection, with automated alerts orchestrated and delivered via LangGraph." },
      { role: "Core Member", org: "AI & ML Research Club", desc: "Led a workshop on 'Introduction to Transformers' for over 50 students." }
  ],
  contact: {
    email: "gptnikhil1977@gmail.com",
    linkedin: "linkedin.com/in/nikhil-gupta-92baa4257",
    github: "github.com/nikhilitz",
  }
};

// --- 3D COMPONENTS ---
function Holocrystal({ position, label, onActivate, isActive, isVisible }) {
  const groupRef = useRef();
  const crystalMeshRef = useRef();
  const [isHovered, setHovered] = useState(false);
  const crystalColor = new THREE.Color("#FFFFFF");

  useEffect(() => { document.body.style.cursor = isHovered ? 'pointer' : 'auto'; }, [isHovered]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
        groupRef.current.position.y = position[1] + Math.sin(time + position[0]) * 0.2;
    }
    if (crystalMeshRef.current) {
        crystalMeshRef.current.rotation.y += delta * 0.3;
    }
    const targetScale = isHovered || isActive ? 1.3 : 1;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  return (
    <group ref={groupRef} position={position} visible={isVisible}>
      <group ref={crystalMeshRef}>
        <mesh
          onClick={() => onActivate(label)}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color={crystalColor} emissive={crystalColor} emissiveIntensity={isHovered || isActive ? 1.2 : 0.5} transparent opacity={0.8} />
        </mesh>
      </group>
      <Text position={[0, -1.8, 0]} fontSize={0.4} color="white" anchorX="center">
        {label}
      </Text>
    </group>
  );
}

function AboutCrystal({ onActivate, isActive, isWarping }) {
    const groupRef = useRef();
    const { viewport } = useThree();
    const [isHovered, setHovered] = useState(false);
    const originalPosition = useMemo(() => [viewport.width / 2 - 2, viewport.height / 2 - 2, 0], [viewport]);

    useEffect(() => { document.body.style.cursor = isHovered ? 'pointer' : 'auto'; }, [isHovered]);

    useFrame((state, delta) => {
        const targetPosition = isWarping || isActive ? new THREE.Vector3(0, 1, 4) : new THREE.Vector3(...originalPosition);
        groupRef.current.position.lerp(targetPosition, 0.05);

        let rotationSpeed = 0.2;
        if (isHovered) rotationSpeed = 2;
        if (isWarping) rotationSpeed = 20;
        groupRef.current.rotation.y += delta * rotationSpeed;

        const targetScale = isHovered || isActive ? 1.3 : 1;
        groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    });

    return (
        <group ref={groupRef}>
            <mesh
                rotation-x={Math.PI} // Point the "nose" downwards
                onClick={() => onActivate("About Me")}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <coneGeometry args={[0.8, 2.5, 6]} />
                <meshStandardMaterial color="#FFFFFF" emissive="#FFFFFF" emissiveIntensity={isHovered || isActive ? 1.2 : 0.5} roughness={0.8} />
            </mesh>
            <Text position={[0, -2.2, 0]} fontSize={0.4} color="white" anchorX="center">
                About Me
            </Text>
        </group>
    );
}

function InteractiveParticles({ isWarping }) {
    const { viewport, mouse } = useThree();
    const pointsRef = useRef();

    const particles = useMemo(() => {
        const count = 5000;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * viewport.width * 3;
            positions[i * 3 + 1] = (Math.random() - 0.5) * viewport.height * 3;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
        }
        return positions;
    }, [viewport]);

    useFrame((state, delta) => {
        if (pointsRef.current) {
            const warpSpeed = isWarping ? 25 : 0.5;
            pointsRef.current.position.z += delta * warpSpeed;
            if (pointsRef.current.position.z > 15) {
                pointsRef.current.position.z = -15;
            }

            if (!isWarping) {
              const targetX = mouse.x * 3;
              const targetY = mouse.y * 3;
              pointsRef.current.position.x += (targetX - pointsRef.current.position.x) * 0.02;
              pointsRef.current.position.y += (targetY - pointsRef.current.position.y) * 0.02;
            }
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={particles.length / 3} array={particles} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={isWarping ? 0.06 : 0.02} color="#FFFFFF" transparent opacity={0.5} />
        </points>
    );
}

// --- UI COMPONENTS ---
function InfoPanel({ activePanel, onClose }) {
    if (!activePanel) return null;
    let content;
    switch(activePanel) {
        case 'About Me':
            content = ( <> <h2>ABOUT ME</h2> <div className="content-section"> <h3>PROFESSIONAL SUMMARY</h3> <p>{portfolioData.about.summary}</p> <h3>EDUCATION</h3> <p>{portfolioData.about.education}</p> </div> </> );
            break;
        case 'Projects':
            content = ( <> <h2>PROJECTS</h2> <div className="content-grid"> {portfolioData.projects.map(p => ( <a href={p.link} key={p.name} target="_blank" rel="noopener noreferrer" className="card-link"> <div className="card"> <h3>{p.name}</h3> <p>{p.desc}</p> <div className="tech-tags">{p.tech.map(t => <span key={t}>{t}</span>)}</div> </div> </a> ))} </div> </> );
            break;
        case 'Skills & Experience':
             content = ( <> <h2>SKILLS & EXPERIENCE</h2> <div className="content-section"> <h3>Key Areas</h3> <div className="tech-tags">{portfolioData.skills.areas.map(t => <span key={t} className="area">{t}</span>)}</div> <h3>Frameworks & Tools</h3> <div className="tech-tags">{portfolioData.skills.frameworks.map(t => <span key={t}>{t}</span>)}</div> <h3>Experience</h3> {portfolioData.experience.map(e => ( <div key={e.org} className="card experience"> <h3>{e.role} - {e.org}</h3> <p>{e.desc}</p> </div> ))} </div> </> );
            break;
        case 'Contact':
             content = ( <> <h2>CONTACT & LINKS</h2> <div className="content-section contact"> <p><strong>Email:</strong> <a href={`mailto:${portfolioData.contact.email}`}>{portfolioData.contact.email}</a></p> <p><strong>LinkedIn:</strong> <a href={`https://${portfolioData.contact.linkedin}`} target="_blank" rel="noopener noreferrer">{portfolioData.contact.linkedin}</a></p> <p><strong>GitHub:</strong> <a href={`https://${portfolioData.contact.github}`} target="_blank" rel="noopener noreferrer">{portfolioData.contact.github}</a></p> </div> </> );
            break;
        default: content = null;
    }
    return ( <div className="info-panel-overlay"> <div className="info-panel-content"> <button className="close-button" onClick={onClose}>×</button> {content} </div> </div> );
}

// --- MAIN SCENE ---
function Scene({ onCrystalActivate, activeCrystal, isWarping }) {
    const { viewport, mouse } = useThree();
    const sceneRef = useRef();
    const crystalDistance = Math.min(5, viewport.width / 2.5);

    useFrame((state) => {
        const targetPosition = activeCrystal ? new THREE.Vector3(0, 1, 8) : new THREE.Vector3(0, 1, 12);
        if (!isWarping) {
            state.camera.position.lerp(targetPosition, 0.05);
        }
        state.camera.lookAt(0, 1, 0);

        if (sceneRef.current && !isWarping) {
            const targetRotationX = mouse.y * 0.1;
            const targetRotationY = -mouse.x * 0.1;
            sceneRef.current.rotation.x += (targetRotationX - sceneRef.current.rotation.x) * 0.05;
            sceneRef.current.rotation.y += (targetRotationY - sceneRef.current.rotation.y) * 0.05;
        }
    });

  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 5, 5]} intensity={1} color="#FFFFFF" />
      <InteractiveParticles isWarping={isWarping} />
      
      <group ref={sceneRef}>
        <Holocrystal position={[-crystalDistance, 0, 0]} label="Projects" onActivate={onCrystalActivate} isActive={activeCrystal === 'Projects'} isVisible={!isWarping && activeCrystal !== 'About Me'} />
        <Holocrystal position={[0, 0, 0]} label="Skills & Experience" onActivate={onCrystalActivate} isActive={activeCrystal === 'Skills & Experience'} isVisible={!isWarping && activeCrystal !== 'About Me'} />
        <Holocrystal position={[crystalDistance, 0, 0]} label="Contact" onActivate={onCrystalActivate} isActive={activeCrystal === 'Contact'} isVisible={!isWarping && activeCrystal !== 'About Me'} />
      </group>

      <AboutCrystal onActivate={onCrystalActivate} isActive={activeCrystal === 'About Me'} isWarping={isWarping && activeCrystal === 'About Me'} />

      <EffectComposer>
        <Bloom luminanceThreshold={0.1} luminanceSmoothing={0.9} height={300} intensity={1.0} />
      </EffectComposer>
    </>
  );
}

// --- APP COMPONENT ---
export default function App() {
  const [activeCrystal, setActiveCrystal] = useState(null);
  const [isWarping, setWarping] = useState(false);
  const [showPanel, setShowPanel] = useState(null);

  const handleActivate = (label) => {
    if (activeCrystal === label) {
        setActiveCrystal(null);
        setShowPanel(null);
    } else {
        setShowPanel(null);
        setWarping(true);
        setActiveCrystal(label);
        setTimeout(() => {
            setWarping(false);
            setShowPanel(label);
        }, 1000);
    }
  };

  const handleClose = () => {
      setActiveCrystal(null);
      setShowPanel(null);
  };

  return (
    <>
      <div className="title-container">
        <h1>{portfolioData.name}</h1>
        <p>{portfolioData.slogan}</p>
      </div>
      <InfoPanel activePanel={showPanel} onClose={handleClose} />
      <Canvas camera={{ position: [0, 1, 12], fov: 75 }}>
        <Scene onCrystalActivate={handleActivate} activeCrystal={activeCrystal} isWarping={isWarping} />
      </Canvas>
    </>
  );
}