import { type FC, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

type TaskCard = {
    radius: number;
    baseAngle: number;
    yOffset: number;
    width: number;
    height: number;
    status: 0 | 1 | 2; // 0 = To Do, 1 = In Progress, 2 = Done
};

const STATUS_LABEL = ['To do', 'In progress', 'Done'] as const;

const createCards = (count: number): TaskCard[] => {
    const cards: TaskCard[] = [];
    for (let i = 0; i < count; i++) {
        cards.push({
            radius: 90 + i * 18,
            baseAngle: (i / count) * Math.PI * 4,
            yOffset: -80 + i * 26,
            width: 122,
            height: 150,
            status: (i % 3) as 0 | 1 | 2,
        });
    }
    return cards;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// status -> [fill rgb, glow rgb]
const STATUS_COLOR: Record<0 | 1 | 2, [string, string]> = {
    0: ['148, 163, 184', '148, 163, 184'], // to do - slate
    1: ['56, 189, 248', '56, 189, 248'], // in progress - sky
    2: ['52, 211, 153', '52, 211, 153'], // done - emerald
};

const TaskScrollAnimation: FC = () => {
    const navigate = useNavigate();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const scrollProgressRef = useRef(0);
    const cardsRef = useRef<TaskCard[]>(createCards(10));
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container || typeof window === 'undefined') return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            const rect = container.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = `${rect.width}px`;
            canvas.style.height = `${rect.height}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        resize();

        const handleResize = () => resize();

        const handleScroll = () => {
            const section = container.parentElement;
            if (!section) return;
            const rect = section.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const totalScrollable = rect.height - viewportHeight;
            if (totalScrollable <= 0) {
                scrollProgressRef.current = 0;
                return;
            }

            const distanceScrolled = Math.min(Math.max(-rect.top, 0), totalScrollable);
            scrollProgressRef.current = clamp01(distanceScrolled / totalScrollable);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        const render = (time: number) => {
            const width = canvas.width / (window.devicePixelRatio || 1);
            const height = canvas.height / (window.devicePixelRatio || 1);
            const cx = width / 2;
            const cy = height / 2;

            const t = time * 0.001;
            const progress = scrollProgressRef.current;

            ctx.clearRect(0, 0, width, height);

            const gradientBg = ctx.createRadialGradient(
                cx,
                cy,
                Math.min(width, height) * 0.05,
                cx,
                cy,
                Math.max(width, height) * 0.7,
            );
            gradientBg.addColorStop(0, 'rgba(19,27,46,0.98)');
            gradientBg.addColorStop(0.4, 'rgba(13,19,35,0.96)');
            gradientBg.addColorStop(1, 'rgba(6,9,18,1)');
            ctx.fillStyle = gradientBg;
            ctx.fillRect(0, 0, width, height);

            // ambient drifting particles ("loose tasks")
            ctx.save();
            ctx.globalAlpha = 0.65;
            const particleCount = 40;
            for (let i = 0; i < particleCount; i++) {
                const angle = ((i / particleCount) * Math.PI * 2 + t * 0.25) % (Math.PI * 2);
                const radius = 60 + (i % 12) * 14;
                const x = cx + Math.cos(angle) * radius;
                const y = cy + Math.sin(angle * 1.7) * radius * 0.5;
                const size = 1.5 + ((i * 1.7) % 4);
                const alpha = 0.08 + ((i * 0.13) % 0.25);

                const g = ctx.createRadialGradient(x, y, 0, x, y, size * 4);
                g.addColorStop(0, `rgba(245, 166, 35, ${0.7 * alpha})`);
                g.addColorStop(0.5, `rgba(56, 189, 248, ${0.45 * alpha})`);
                g.addColorStop(1, 'rgba(13,19,35,0)');
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(x, y, size * 4, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();

            const cards = cardsRef.current;

            // 0.2-0.4 checklist items get checked off / highlighted
            const checkPhase = clamp01((progress - 0.2) / 0.2);
            // 0.5-0.75 cards settle into three board columns
            const boardPhase = clamp01((progress - 0.5) / 0.25);
            // 0.75-1 team members connect in real time
            const syncPhase = clamp01((progress - 0.75) / 0.25);

            const columnX = [-1, 0, 1];

            cards.forEach((card, index) => {
                const angleOffset = t * 0.4 + progress * Math.PI * 1.2;
                const baseAngle = card.baseAngle + angleOffset;

                const spiralRadius = card.radius * (1 - boardPhase * 0.4);
                const scatterX = cx + Math.cos(baseAngle) * spiralRadius;
                const scatterYOffset = card.yOffset + (index - cards.length / 2) * 4;
                const scatterY = cy + scatterYOffset;

                const columnTargetX = cx + columnX[card.status] * width * 0.18;
                const stackIndex = Math.floor(index / 3);
                const columnTargetY = cy - 60 + stackIndex * 92;

                const x = scatterX * (1 - boardPhase) + columnTargetX * boardPhase;
                const y =
                    scatterY * (1 - boardPhase * (1 - syncPhase * 0.15)) +
                    columnTargetY * boardPhase;

                const scale = 0.85 + 0.4 * (index / cards.length) * (1 - boardPhase * 0.3);
                const w = card.width * scale;
                const h = card.height * scale;

                const depthAlpha = 0.35 + 0.6 * (index / cards.length);
                const [statusRgb] = STATUS_COLOR[card.status];
                const glow = checkPhase * (0.3 + 0.3 * Math.sin(t * 3 + index));

                ctx.save();
                ctx.translate(x, y);
                ctx.rotate((baseAngle * 0.35 + progress * 0.6) * (1 - boardPhase));

                const grd = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
                grd.addColorStop(0, `rgba(148, 163, 184, ${0.08 + depthAlpha * 0.15})`);
                grd.addColorStop(0.45, `rgba(${statusRgb}, ${0.14 + depthAlpha * 0.18})`);
                grd.addColorStop(1, 'rgba(13, 19, 35, 0.92)');

                ctx.fillStyle = grd;
                ctx.strokeStyle = `rgba(${statusRgb}, ${0.55 + glow})`;
                ctx.lineWidth = 1.4 + glow * 2;
                ctx.globalAlpha = depthAlpha * (1 - syncPhase * 0.15);

                const radius = 14;
                ctx.beginPath();
                ctx.moveTo(-w / 2 + radius, -h / 2);
                ctx.lineTo(w / 2 - radius, -h / 2);
                ctx.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + radius);
                ctx.lineTo(w / 2, h / 2 - radius);
                ctx.quadraticCurveTo(w / 2, h / 2, w / 2 - radius, h / 2);
                ctx.lineTo(-w / 2 + radius, h / 2);
                ctx.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - radius);
                ctx.lineTo(-w / 2, -h / 2 + radius);
                ctx.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + radius, -h / 2);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                const headerHeight = h * 0.16;
                ctx.globalAlpha = depthAlpha * (0.6 + checkPhase * 0.3);
                ctx.fillStyle = `rgba(13, 19, 35, 0.9)`;
                ctx.beginPath();
                ctx.moveTo(-w / 2 + radius, -h / 2);
                ctx.lineTo(w / 2 - radius, -h / 2);
                ctx.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + radius);
                ctx.lineTo(w / 2, -h / 2 + headerHeight);
                ctx.lineTo(-w / 2, -h / 2 + headerHeight);
                ctx.lineTo(-w / 2, -h / 2 + radius);
                ctx.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + radius, -h / 2);
                ctx.closePath();
                ctx.fill();

                // status chip
                ctx.globalAlpha = depthAlpha * (0.6 + checkPhase * 0.2);
                const chipWidth = w * 0.5;
                const chipHeight = headerHeight * 0.58;
                const chipX = -w / 2 + chipWidth / 2 + 10;
                const chipY = -h / 2 + headerHeight / 2;
                const chipRadius = 8;
                ctx.fillStyle = `rgba(${statusRgb}, 0.7)`;
                ctx.beginPath();
                ctx.moveTo(chipX - chipWidth / 2 + chipRadius, chipY - chipHeight / 2);
                ctx.lineTo(chipX + chipWidth / 2 - chipRadius, chipY - chipHeight / 2);
                ctx.quadraticCurveTo(
                    chipX + chipWidth / 2,
                    chipY - chipHeight / 2,
                    chipX + chipWidth / 2,
                    chipY - chipHeight / 2 + chipRadius,
                );
                ctx.lineTo(chipX + chipWidth / 2, chipY + chipHeight / 2 - chipRadius);
                ctx.quadraticCurveTo(
                    chipX + chipWidth / 2,
                    chipY + chipHeight / 2,
                    chipX + chipWidth / 2 - chipRadius,
                    chipY + chipHeight / 2,
                );
                ctx.lineTo(chipX - chipWidth / 2 + chipRadius, chipY + chipHeight / 2);
                ctx.quadraticCurveTo(
                    chipX - chipWidth / 2,
                    chipY + chipHeight / 2,
                    chipX - chipWidth / 2,
                    chipY + chipHeight / 2 - chipRadius,
                );
                ctx.lineTo(chipX - chipWidth / 2, chipY - chipHeight / 2 + chipRadius);
                ctx.quadraticCurveTo(
                    chipX - chipWidth / 2,
                    chipY - chipHeight / 2,
                    chipX - chipWidth / 2 + chipRadius,
                    chipY - chipHeight / 2,
                );
                ctx.closePath();
                ctx.fill();

                ctx.fillStyle = 'rgba(13, 19, 35, 0.95)';
                ctx.font = '9px system-ui, -apple-system, BlinkMacSystemFont, "Inter"';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(STATUS_LABEL[card.status].toUpperCase(), chipX, chipY + 0.5);

                // task title (checkbox + strikethrough on completed)
                ctx.globalAlpha = depthAlpha * (0.65 + checkPhase * 0.3);
                const boxY = -h / 2 + headerHeight + 16;
                const boxSize = 7;
                ctx.strokeStyle = `rgba(${statusRgb}, 0.8)`;
                ctx.lineWidth = 1.2;
                ctx.strokeRect(-w / 2 + 14, boxY - boxSize / 2, boxSize, boxSize);
                if (card.status === 2) {
                    ctx.fillStyle = `rgba(${statusRgb}, ${0.7 + 0.3 * checkPhase})`;
                    ctx.fillRect(-w / 2 + 14, boxY - boxSize / 2, boxSize, boxSize);
                }
                const titleLen = w * 0.62 * (0.7 + 0.3 * Math.sin(t * 1.4 + index));
                ctx.strokeStyle = 'rgba(226, 232, 240, 0.5)';
                ctx.lineWidth = 1.3;
                ctx.beginPath();
                ctx.moveTo(-w / 2 + 28, boxY);
                ctx.lineTo(-w / 2 + 28 + titleLen, boxY);
                ctx.stroke();
                if (card.status === 2) {
                    ctx.strokeStyle = `rgba(${statusRgb}, 0.9)`;
                    ctx.beginPath();
                    ctx.moveTo(-w / 2 + 26, boxY);
                    ctx.lineTo(-w / 2 + 28 + titleLen, boxY);
                    ctx.stroke();
                }

                // subtask lines
                for (let i = 0; i < 3; i++) {
                    const lineY = boxY + 16 + i * 10;
                    const baseLength = w * (0.55 - i * 0.08);
                    const dynamic =
                        baseLength * (0.6 + 0.4 * Math.sin(t * 2 + i * 0.7 + index * 0.4) * checkPhase);
                    ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(-w / 2 + 14, lineY);
                    ctx.lineTo(-w / 2 + 14 + dynamic, lineY);
                    ctx.stroke();
                }

                ctx.restore();
            });

            // real-time collaborator network
            const networkRadius = Math.min(width, height) * 0.28;
            const nodes: { x: number; y: number; size: number; phase: number; kind: 0 | 1 | 2 }[] = [];
            const nodeRingCounts = [4, 7, 10];

            for (let ring = 0; ring < nodeRingCounts.length; ring++) {
                const count = nodeRingCounts[ring];
                const ringR = networkRadius * (0.25 + ring * 0.28);
                for (let i = 0; i < count; i++) {
                    const angle = (i / count) * Math.PI * 2 + t * 0.1 * (ring + 1);
                    const nx = cx + Math.cos(angle) * ringR * (1 - 0.4 * (1 - syncPhase));
                    const ny = cy + Math.sin(angle) * ringR * 0.7;
                    const baseSize = 3 + ring * 1.4;
                    nodes.push({
                        x: nx,
                        y: ny,
                        size: baseSize,
                        phase: (ring * 0.7 + i * 0.23) % 1,
                        kind: (i % 3) as 0 | 1 | 2,
                    });
                }
            }

            ctx.save();
            ctx.globalAlpha = 0.1 + 0.45 * boardPhase;
            ctx.strokeStyle = `rgba(56,189,248,${0.35 + 0.4 * syncPhase})`;
            ctx.lineWidth = 0.8 + 0.6 * syncPhase;

            nodes.forEach((a, i) => {
                nodes.slice(i + 1).forEach((b, j) => {
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < networkRadius * 0.85 && (i + j) % 3 === 0) {
                        const strength = 1 - dist / (networkRadius * 0.85);
                        const pulse = 0.4 + 0.4 * Math.sin(t * 2 + (i + j) * 0.2);
                        ctx.globalAlpha = (0.1 + 0.4 * boardPhase + 0.3 * syncPhase) * strength * pulse;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                });
            });
            ctx.restore();

            ctx.save();
            nodes.forEach((node, idx) => {
                const appear = clamp01(boardPhase * 1.4 - node.phase * 0.8);
                if (appear <= 0) return;

                const size = node.size * (0.7 + 0.7 * appear + 0.3 * syncPhase);
                const pulse = 0.5 + 0.5 * Math.sin(t * 3 + idx * 0.4);
                const [nodeRgb] = STATUS_COLOR[node.kind];

                const g = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, size * 4);
                g.addColorStop(0, `rgba(${nodeRgb}, ${0.5 * appear + 0.3 * syncPhase * pulse})`);
                g.addColorStop(0.4, `rgba(245, 166, 35, ${0.3 * appear})`);
                g.addColorStop(1, 'rgba(13,19,35,0)');
                ctx.fillStyle = g;
                ctx.globalAlpha = 0.85;
                ctx.beginPath();
                ctx.arc(node.x, node.y, size * 4, 0, Math.PI * 2);
                ctx.fill();

                ctx.globalAlpha = 0.9;
                ctx.fillStyle = 'rgba(13,19,35,0.95)';
                ctx.beginPath();
                ctx.arc(node.x, node.y, size + 1.2, 0, Math.PI * 2);
                ctx.fill();

                ctx.lineWidth = 1.1;
                ctx.strokeStyle = `rgba(${nodeRgb},${0.8 * appear})`;
                ctx.beginPath();
                ctx.arc(node.x, node.y, size + 1.2, 0, Math.PI * 2);
                ctx.stroke();

                ctx.fillStyle = 'rgba(226,232,240,0.9)';
                ctx.font = '8px system-ui, -apple-system, BlinkMacSystemFont, "Inter"';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'top';
                const offsetY = 6 + size * 0.5;
                ctx.fillText(STATUS_LABEL[node.kind], node.x, node.y + offsetY);
            });
            ctx.restore();

            const centerGlow = clamp01(progress * 1.2);
            const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, networkRadius * 1.2);
            cg.addColorStop(0, `rgba(245,166,35,${0.08 + 0.16 * centerGlow})`);
            cg.addColorStop(0.4, `rgba(56,189,248,${0.06 + 0.1 * centerGlow})`);
            cg.addColorStop(1, 'rgba(13,19,35,0)');
            ctx.fillStyle = cg;
            ctx.globalAlpha = 0.85;
            ctx.fillRect(0, 0, width, height);

            animationFrameRef.current = window.requestAnimationFrame(render);
        };

        animationFrameRef.current = window.requestAnimationFrame(render);

        return () => {
            if (animationFrameRef.current !== null) {
                window.cancelAnimationFrame(animationFrameRef.current);
            }
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <section className="relative h-screen">
            <div ref={containerRef} className="sticky top-0 h-screen overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(245,166,35,0.22),transparent_60%),radial-gradient(circle_at_bottom,_rgba(13,19,35,0.95),transparent_55%)] mix-blend-screen opacity-60 z-0" />

                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10" />

                <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="flex flex-col items-center gap-6 text-center px-4">
                        <h1 className="text-4xl md:text-5xl font-bold text-white">
                            Turn to-dos into{' '}
                            <span className="text-amber-400">done, together</span>
                        </h1>

                        <p className="text-slate-300 max-w-md">
                            Assign work, track progress live, and let AI prioritize what
                            matters — synced across your whole team the moment it changes.
                        </p>

                        <button
                            onClick={() => navigate('/dashboard')}
                            className="
                px-8 py-3 text-lg rounded-xl
                bg-white/10 backdrop-blur-lg
                border border-white/20
                text-white
                hover:bg-white/20
                transition-all duration-300
                shadow-[0_8px_32px_rgba(0,0,0,0.3)]
              "
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TaskScrollAnimation;
