import ChromaKeyVideo from './components/ChromaKeyVideo';
import PageScrollIndicator from './components/PageScrollIndicator';

const INTERESTS = [
    'Electronics',
    'Programming',
    'Robotics',
    'Quantum Mechanics',
    'Antimatter',
    'Time Travel',
];

function App() {
    return (
        <>
            <div className="absolute md:fixed top-4 left-4 font-mono-label leading-relaxed select-none">
                <div>Portfolio / 2026</div>
                <div>V4.20 — Ralph Louis D. Gopez</div>
            </div>

            <div className="fixed top-4 right-4  font-mono-label leading-relaxed text-right select-none hidden sm:block">
                {
                    INTERESTS.map(
                        (interest) => (
                            <div key={interest}>{interest}</div>
                        )
                    )
                }
            </div>

            <div className="fixed left-4 top-1/2 -translate-y-1/2  font-mono-label leading-[0.9] select-none hidden md:block">
                <div>||||</div>
                <div className="mt-1">|||</div>
                <div className="mt-1">||</div>
                <div className="mt-1">|</div>
            </div>

            <div className="px-8 py-4 md:w-1/2 xl:w-1/3 mx-auto flex flex-col relative pb-40 min-h-[100dvh]">
                <div className="w-full mt-12 md:mt-6 font-mono-label tracking-widest select-none">
                    · · · · · · · · · · · · · · · ·
                </div>
                
                <ChromaKeyVideo className="absolute top-0 left-1/2 transform -translate-x-1/2 pointer-events-none z-10" src="/videos/drone.mp4" keyColor="#cdcbcd" threshold={50} smoothness={40} width={350} spillSuppression={1} edgeInset={3} />
        
                <div className="w-full mt-4 mb-2 flex items-center justify-center">
                    <h1 className="font-display text-8xl md:text-9xl tracking-tighter select-none leading-none">
                        RALPH
                    </h1>
                </div>

                <div className="w-full flex items-center justify-between font-mono-label select-none">
                    <span>—— Curiosity / Wonder</span>
                    <span>EST. 2026</span>
                </div>

                <div className="flex flex-col gap-4 text-sm md:text-base mt-8 md:mt-12">
                    <div className="flex flex-col gap-4 select-none">
                        <p className="leading-relaxed">
                            I find a lot of things fascinating: electronics, programming, robotics,
                            quantum mechanics, antimatter, and even time travel.
                        </p>
                        <p className="leading-relaxed font-bold">
                            Of which I have no real budget to explore but I try.
                        </p>
                    </div>
                    
                    <div className="flex flex-col gap-4 select-none">
                        <p className="leading-relaxed">
                            The world is amazing at scale. Unfortunately, our society has lost sight
                            of what matters. We are stuck in a vicious world of our making infested
                            by greed, grift, and bastardization. More than ever we praise lack of
                            integrity, discipline, and humanity.
                        </p>
                        <p className="leading-relaxed">
                            I dream of freedom. To have everything imaginable under the sun. Yet I
                            will never surrender my heart and soul. I will never lose sight of
                            myself. I know exactly what I want.
                        </p>
                        <p className="leading-relaxed font-bold">
                            I will never just be a cog in a machine.
                        </p>
                        <p className="leading-relaxed">
                            I want to focus on creating something meaningful and impactful even if
                            it doesn't come with prestige or the biggest bag of money. Heart and
                            soul. Curiosity. Wonder in wander.
                        </p>
                    </div>

                    <div className=" border-t border-b border-black/20 py-6 mt-3 select-none">
                        <div className="font-mono-label mb-3">Ultimately I Seek,</div>
                        <p className="font-display text-2xl md:text-3xl leading-tight tracking-tight">
                            That which cannot be made artificial.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 mt-6">
                        <div className="font-mono-label select-none">Find Me At</div>
                        <div className="flex flex-wrap gap-2">
                            <a className="font-mono inline-flex items-center px-3 py-1 rounded-full border border-black/40 text-xs hover:bg-black hover:text-white transition-colors" href="https://fb.com/p.ralphlouisgopez" target="_blank" rel="noopener noreferrer">
                                fb / p.ralphlouisgopez
                            </a>
                            <a className="font-mono inline-flex items-center px-3 py-1 rounded-full border border-black/40 text-xs hover:bg-black hover:text-white transition-colors" href="https://linkedin.com/in/ralphlouisgopez" target="_blank" rel="noopener noreferrer">
                                in / ralphlouisgopez
                            </a>
                        </div>
                    </div>
                </div>

                <div className="perspective-floor select-none" />
                <ChromaKeyVideo className="absolute bottom-0 right-[calc(50%-50vw)] select-none" src="/videos/hexapod.mp4" choke={0.4} feather={0.3} keyColor="#7fff7f" threshold={80} smoothness={40} width={200} height={200} spillSuppression={1} edgeInset={3} />
                <div className="page-vignette" />
            </div>

            <PageScrollIndicator />
        </>
    );
}

export default App;
