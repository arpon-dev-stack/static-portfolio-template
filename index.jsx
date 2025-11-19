import React, { useState, useEffect, useCallback } from 'react';

// --- Configuration Data ---

const PROJECTS = [
    { 
        title: "E-commerce Platform", 
        description: "A full-stack e-commerce solution built with React and Node.js, featuring secure payment processing and inventory management.", 
        link: "#" 
    },
    { 
        title: "Real-time Chat App", 
        description: "A highly scalable web application using WebSockets (Socket.io) for instant messaging and user presence indicators.", 
        link: "#" 
    },
    { 
        title: "Portfolio CMS", 
        description: "A custom content management system built with Next.js/Vue.js allowing for easy updates and dynamic content fetching.", 
        link: "#" 
    },
];

const SKILLS_TREE_DATA = [
    { name: "HTML", isRoot: true },
    { name: "CSS", isRoot: true },
    { 
        name: "JavaScript (Core)", 
        isRoot: false,
        children: [
            { name: "Git & GitHub" },
            { 
                name: "Node.js (Runtime)",
                children: [
                    { name: "Express (Framework)" },
                    { name: "JWT (Authentication)" },
                ]
            },
            { 
                name: "React (Frontend)",
                children: [
                    { name: "React-Router" },
                    { name: "Next.js (Framework)" },
                ]
            },
            {
                name: "Databases",
                children: [
                    { name: "MongoDB (NoSQL)" },
                    { name: "PostgreSQL (SQL)" },
                ]
            },
        ]
    },
];

const SOCIAL_LINKS = [
    { icon: 'M17.397 2.001A8.995 8.995 0 0 0 12 3a9 9 0 0 0-4.7 1.343c-.482-.127-.973-.254-1.464-.383C5.05 4.908 4.288 6.096 4 7.632c-.08.57.172 1.455.578 2.052.196.284.41.56.63.82.164.195.337.382.517.56.24.238.5 4.39 3.8 5.76.01.01.01.01 0 .02.04.14.07.29.09.43.02.09.04.18.06.27.13.57.26 1.14.39 1.7.04.18.06.37.07.56a1 1 0 0 0 1 1h.463c.53 0 .866-.356.98-.82.11-.45.2-1.63.15-2.09-.03-.28.02-.57.14-.83.07-.15.15-.29.23-.43.43-.65.86-1.3 1.28-1.95.12-.17.2-.34.28-.51 1.72-3.6 2.58-7.2 2.58-10.78a2.6 2.6 0 0 0-2.6-2.6z', name: "Facebook" }, // Simplified Facebook
    { icon: 'M23.953 4.57a10 10 0 0 1-2.825.775 4.958 4.958 0 0 0 2.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 0 0-8.384 4.492A13.928 13.928 0 0 1 3.03 5.41a4.922 4.922 0 0 0 1.517 6.57c-.9-.028-1.745-.285-2.486-.688v.061c0 2.68 1.907 4.907 4.423 5.421a4.923 4.923 0 0 1-2.227.084 4.92 4.92 0 0 0 4.6 3.419A9.878 9.878 0 0 1 3 20.306c-1.602 0-3.12-.093-4.57-.468a13.992 13.992 0 0 0 7.55 2.21A13.983 13.983 0 0 0 24 11.378v-.578a10.016 10.016 0 0 0 2.842-2.924c-.88.39-1.83.654-2.82.776z', name: "X" }, // Simplified Twitter (X)
    { icon: 'M18 2h-12a4 4 0 0 0-4 4v12a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4V6a4 4 0 0 0-4-4zm-9 14a7 7 0 1 1 7-7 7 7 0 0 1-7 7zM18 7h.01', name: "Instagram" }, // Simplified Instagram
    { icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16h-2v-2h2v2zm0-4h-2V7h2v7z', name: "Threads" }, // Placeholder Icon (i for Threads)
];

// --- Custom Hooks ---

// Helper function for Linear Interpolation (Lerp)
const lerp = (a, b, t) => a + (b - a) * t;

const useScrollAnimation = () => {
    const SCROLL_RANGE = 300;
    const BASE_ELEM_SIZE = 80;
    const DESIRED_FINAL_SIZE = 50;

    const [logoStyle, setLogoStyle] = useState({});
    const [headerOpacity, setHeaderOpacity] = useState(0);
    const [tinyElementOpacity, setTinyElementOpacity] = useState(1);
    const [tinyElementOffset, setTinyElementOffset] = useState({ x: 0, y: 0 });

    const handleScroll = useCallback(() => {
        const scrollY = window.scrollY;
        const t = Math.min(1, Math.max(0, scrollY / SCROLL_RANGE));

        // --- Logo Animation Config ---
        const SCALE_START = 2.5;
        const END_TOP = 40;
        const END_LEFT_PX = 50;
        const ROTATION_THRESHOLD = 0.01;
        const ROTATE_FINAL = 180;
        const START_TOP = window.innerHeight / 2;
        const START_LEFT_VW = 50;
        const START_SHADOW = '0 10px 30px rgba(76, 175, 80, 0.4)';

        // --- Calculate Current Values ---
        const currentScale = lerp(SCALE_START, DESIRED_FINAL_SIZE / BASE_ELEM_SIZE, t);
        const currentTop = lerp(START_TOP, END_TOP, t);
        const startLeftInPx = (START_LEFT_VW / 100) * window.innerWidth;
        const currentLeft = lerp(startLeftInPx, END_LEFT_PX, t);
        const currentRotation = (t >= ROTATION_THRESHOLD) ? ROTATE_FINAL : 0;

        // --- Update State ---
        setLogoStyle({
            transform: `translate(-50%, -50%) scale(${currentScale}) rotateY(${currentRotation}deg)`,
            top: `${currentTop}px`,
            left: `${currentLeft}px`,
            boxShadow: (t === 1) ? 'none' : START_SHADOW,
        });
        
        // Header and Tiny Element Visibility
        setHeaderOpacity(t);
        setTinyElementOpacity(scrollY === 0 ? 1 : 0);

        // Update tiny element position using pre-calculated random offset
        const { x, y } = tinyElementOffset;
        document.getElementById('tiny-element').style.top = `${currentTop + y}px`;
        document.getElementById('tiny-element').style.left = `${currentLeft + x}px`;

    }, [tinyElementOffset]);
    
    // Initialize random offset and event listeners
    useEffect(() => {
        const MAX_OFFSET = 12;
        const getRandomOffset = () => Math.floor(Math.random() * (MAX_OFFSET * 2 + 1)) - MAX_OFFSET;
        setTinyElementOffset({ x: getRandomOffset(), y: getRandomOffset() });

        // Initial setup run
        handleScroll(); 

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, [handleScroll]);

    return { logoStyle, headerOpacity, tinyElementOpacity };
};

// --- Reusable Components ---

const ProjectCard = ({ title, description, link }) => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 w-full max-w-sm flex-grow shadow-xl text-left transition duration-300 ease-in-out hover:translate-y-[-5px] hover:bg-white/10">
        <h3 className="text-blue-400 mt-0 border-b border-white/15 pb-2 text-xl font-semibold">
            {title}
        </h3>
        <p className="text-gray-300 text-base mb-4">{description}</p>
        <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block px-4 py-2 bg-green-500 text-white rounded-lg font-bold transition duration-200 hover:bg-green-600 shadow-md"
        >
            View Project
        </a>
    </div>
);

const SkillNode = ({ skill }) => {
    const isRoot = skill.isRoot;
    return (
        <li className={`relative py-2 text-gray-100 ${isRoot ? 'font-extrabold text-green-400' : 'text-lg'}`}>
            <span className={isRoot ? '' : 'pl-10'}>
                {!isRoot && (
                    <span className="absolute left-[-15px] top-[14px] text-blue-400 text-xl font-extrabold">
                        •
                    </span>
                )}
                {skill.name}
            </span>
            {skill.children && (
                <ul className="relative ml-8 before:content-[''] before:absolute before:top-0 before:bottom-0 before:left-0 before:w-[1px] before:bg-white/15">
                    {skill.children.map((child, index) => (
                        <SkillNode key={index} skill={child} />
                    ))}
                </ul>
            )}
            {!isRoot && (
                <span className="absolute top-[17px] left-[-30px] w-5 h-[1px] bg-white/15"></span>
            )}
        </li>
    );
};

const SkillsTree = () => (
    <section id="skills-section" className="py-12 px-5 text-center mt-10">
        <h2 className="text-4xl text-green-500 font-bold mb-10">My Skills Tree 🌳</h2>
        <div className="max-w-xl mx-auto text-left relative">
            <ul className="list-none p-0 m-0">
                {SKILLS_TREE_DATA.map((skill, index) => (
                    <SkillNode key={index} skill={skill} />
                ))}
            </ul>
        </div>
    </section>
);

const ConnectionElement = () => (
    <section id="connection-element" className="py-10 px-5 border-t border-white/10 bg-gray-900/60 text-center mt-10">
        <h2 className="text-3xl text-white font-bold mb-8">Let's Connect</h2>
        <div className="flex justify-center gap-10 mx-auto max-w-md">
            {SOCIAL_LINKS.map((link, index) => (
                <a 
                    key={index} 
                    href="#" 
                    className="block text-gray-100 transition duration-200 ease-in-out hover:text-green-500 hover:translate-y-[-3px]"
                    aria-label={`${link.name} Link`}
                >
                    <svg fill="currentColor" viewBox="0 0 24 24" className="w-8 h-8">
                        <path d={link.icon} />
                    </svg>
                </a>
            ))}
        </div>
    </section>
);

const Footer = () => (
    <footer className="bg-gray-950 text-gray-500 py-5 text-center text-sm border-t border-gray-800">
        &copy; {new Date().getFullYear()} Your Name/Agency Name. All Rights Reserved.
    </footer>
);

// --- Main App Component ---

const App = () => {
    const { logoStyle, headerOpacity, tinyElementOpacity } = useScrollAnimation();

    const skillIcons = ['💻', '🎨', '⚙️', '{ }'];
    const randomIcon = skillIcons[Math.floor(Math.random() * skillIcons.length)];

    return (
        <>
            {/* Custom CSS for Animations that cannot be done with Tailwind */}
            <style>
                {`
                    /* Background Blobs */
                    .bg-blob {
                        position: absolute;
                        width: 350px;
                        height: 350px;
                        border-radius: 50%;
                        filter: blur(150px); 
                        opacity: 0.5;
                        animation: blob-move 20s infinite alternate;
                    }

                    .bg-blob:nth-child(1) {
                        background-color: #ff5733;
                        top: 10%;
                        left: 10%;
                        animation-delay: 0s;
                    }

                    .bg-blob:nth-child(2) {
                        background-color: #33ff57;
                        top: 70%;
                        left: 80%;
                        width: 450px;
                        height: 450px;
                        animation-delay: 5s;
                    }

                    .bg-blob:nth-child(3) {
                        background-color: #3357ff;
                        top: 40%;
                        left: 40%;
                        animation-delay: 10s;
                    }

                    @keyframes blob-move {
                        0% { transform: translate(0, 0) scale(1) rotate(0deg); }
                        33% { transform: translate(150px, -200px) scale(1.2) rotate(60deg); }
                        66% { transform: translate(-100px, 100px) scale(0.9) rotate(120deg); }
                        100% { transform: translate(0, 0) scale(1) rotate(180deg); }
                    }

                    /* 3D Flip */
                    .face {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        font-size: 20px;
                        font-weight: bold;
                        color: white;
                        backface-visibility: hidden;
                    }

                    .face-front { transform: rotateY(0deg); background-color: #4CAF50; }
                    .face-back { transform: rotateY(180deg); background-color: #007bff; }
                `}
            </style>

            {/* 1. Background Animation Layer */}
            <div id="background-animation" className="fixed inset-0 overflow-hidden -z-50">
                <div className="bg-blob"></div>
                <div className="bg-blob"></div>
                <div className="bg-blob"></div>
            </div>

            {/* 2. Fixed Elements (Logo and Header) */}
            <header 
                id="main-header" 
                className="fixed top-0 left-0 w-full h-20 bg-gray-900/80 backdrop-blur-sm z-50 transition-shadow duration-300"
                style={{ opacity: headerOpacity, boxShadow: `0 4px 12px rgba(0, 0, 0, ${headerOpacity * 0.15})` }}
            />
            
            <div 
                id="tiny-element" 
                className="fixed w-5 h-5 rounded-full bg-white shadow-md z-[10001] pointer-events-none flex justify-center items-center text-xs text-gray-700 transition-opacity duration-300"
                style={{ opacity: tinyElementOpacity, transform: 'translate(-50%, -50%)' }}
            >
                {randomIcon}
            </div>

            <div 
                id="agency-element" 
                className="fixed w-20 h-20 rounded-full transition-none z-[10000] [transform-style:preserve-3d] cursor-pointer"
                style={logoStyle}
            >
                <div className="face face-front">AD</div>
                <div className="face face-back">&lt; / &gt;</div>
            </div>

            {/* 3. Main Content Wrapper */}
            <div id="content-wrapper" className="bg-gray-900/40 min-h-screen backdrop-blur-md relative z-10">
                <section id="page-content" className="pt-[100vh] pb-10 text-center">
                    <h1 className="text-green-500 text-5xl font-extrabold mb-12">Featured Projects</h1>

                    {/* Projects Row */}
                    <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto px-5 mb-24">
                        {PROJECTS.map((project, index) => (
                            <ProjectCard key={index} {...project} />
                        ))}
                    </div>

                    {/* 1. Skills Tree Section */}
                    <SkillsTree />
                    
                    {/* 2. Connection Element (Social Links) */}
                    <ConnectionElement />
                    
                    {/* Spacer for scroll completion */}
                    <div className="h-40"></div>
                </section>
                
                {/* 3. Footer Element */}
                <Footer />
            </div>
        </>
    );
};

export default App;