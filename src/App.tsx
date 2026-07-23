import ChromaKeyVideo from './components/ChromaKeyVideo';
import PageScrollIndicator from './components/PageScrollIndicator';
import SelectedWorks from './components/SelectedWorks';

const INTERESTS = [
    'Electronics',
    'Programming',
    'Robotics',
    'Sound Design',
    '3D Printing',
    'Lineart',
    'Mathematics',
    'Physics',
    'Quantum Mechanics',
    'Antimatter',
    'Time Travel',
];

function App() {
    return (
        <>
            <div className="absolute md:fixed top-4 left-4 font-mono-label leading-relaxed select-none">
                <div>Portfolio / 2026</div>
                <div>Ralph Louis D. Gopez</div>
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

            <div className="px-8 py-4 md:w-1/2 xl:w-1/3 mx-auto flex flex-col relative pb-40 min-h-[100dvh]">
                <ChromaKeyVideo className="absolute top-0 left-1/2 transform -translate-x-1/2 pointer-events-none z-10" src="/videos/drone.mp4" keyColor="#cdcbcd" threshold={50} smoothness={40} width={350} spillSuppression={1} edgeInset={3} />
        
                <div className="w-full mt-16 md:mt-4 mb-2 flex items-center justify-center">
                    <h1 className="font-display text-8xl md:text-9xl tracking-tighter select-none leading-none">
                        RALPH
                    </h1>
                </div>

                <div className="w-full flex items-center justify-between font-mono-label select-none">
                    <span>Growth / Wonder</span>
                    <span>EST. 2026</span>
                </div>

                <div className="flex flex-col gap-4 text-sm md:text-base mt-8 md:mt-12">
                    <div className="flex flex-col gap-4 select-none">
                        <p className="leading-relaxed">
                            I am interested in a lot of things: electronics, programming, robotics, sound design, 
                            3D printing, lineart, mathematics, physics, quantum mechanics, antimatter, and even time travel.
                        </p>
                        <p className="leading-relaxed font-bold">
                            So I learn and take action on my own. I'd rather do things than ONLY admire thinking doing so.
                        </p>
                    </div>
                    
                    <div className="flex flex-col gap-4 select-none">
                        <p className="leading-relaxed">
                            The world is vast. I find that I want to explore, understand, and know everything. 
                            I am in the endless pursuit of growth and wonder so that I may be better each
                            and every passing day.
                        </p>
                        <p className="leading-relaxed">
                            As I dream of growth, I also dream of freedom. Even if I want to have everything imaginable under the sun, I know that I will never 
                            surrender my heart and soul. I will never lose sight of myself. I know exactly what I want.
                        </p>
                        <p className="leading-relaxed font-bold">
                            I will never stop.
                        </p>
                        <p className="leading-relaxed">
                            I want to create meaning and impact even if it doesn't come with prestige or the biggest bag of 
                            money. I love the heart and soul. Curiosity. Wonder in wander. Greatness in growth.
                        </p>
                    </div>

                    <div className=" border-t border-b border-black/20 py-6 mt-3 select-none">
                        <div className="font-mono-label mb-3">Ultimately I Seek,</div>
                        <p className="font-display text-2xl md:text-3xl leading-tight tracking-tight">
                            That which is relentless.
                        </p>
                    </div>

                    <SelectedWorks />

                    <div className="flex flex-col gap-4 mt-4 mb-8">
                        <div className="font-mono-label select-none">Find Me At</div>
                        <div className="flex flex-wrap gap-2">
                            <a className="inline-flex items-center px-3 py-1 rounded-full border border-black/40 text-xs hover:bg-black hover:text-white transition-colors" href="https://fb.com/p.ralphlouisgopez" target="_blank" rel="noopener noreferrer">
                                fb / p.ralphlouisgopez
                            </a>
                            <a className="inline-flex items-center px-3 py-1 rounded-full border border-black/40 text-xs hover:bg-black hover:text-white transition-colors" href="https://linkedin.com/in/ralphlouisgopez" target="_blank" rel="noopener noreferrer">
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
