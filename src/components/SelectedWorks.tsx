import { useHorizontalWheelScroll } from '../hooks/useHorizontalWheelScroll';

type Work = {
    title: string;
    url: string;
    host: string;
    banner: string;
    description: string;
};

const WORKS: Work[] = [
    {
        title: 'Kideae',
        url: 'https://kideae.com',
        host: 'kideae.com',
        banner: '/banners/kideae.jpg',
        description: 'Local AI-powered whiteboard. Focusing on privacy and simplicity.',
    },
    {
        title: 'STMVIZ',
        url: 'https://visualizer.ralphlouisgopez.com',
        host: 'visualizer.ralphlouisgopez.com',
        banner: '/banners/stmviz.jpg',
        description: 'Visualizes the stable marriage problem and its solution.',
    },
    {
        title: 'Cinelaya',
        url: 'https://app.cinelaya.com',
        host: 'app.cinelaya.com',
        banner: '/banners/cinelaya.jpg',
        description: 'A suite of tools for filmmakers streamlining pre to post-production.',
    },
];

function SelectedWorks() {
    const worksReference = useHorizontalWheelScroll<HTMLDivElement>('(min-width: 768px)');

    return (
        <div className="mt-10 pt-6 pb-12 px-8 mx-[calc(50%-50vw)] w-screen bg-[#0f0f11]">
            <div className="flex flex-col gap-4 text-neutral-100 mx-auto">
                <div className="font-mono-label select-none md:text-center" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    Selected Works
                </div>
                <div ref={worksReference} className="md:overflow-x-auto md:-mx-8 md:px-8">
                    <div className="flex flex-col md:flex-row gap-6 w-full md:w-fit md:mx-auto">
                        {WORKS.map((work) => (
                            <a key={work.url} href={work.url} target="_blank" rel="noopener noreferrer" className="group flex flex-col gap-3 w-full md:w-120 md:shrink-0 border border-white/15 hover:border-white/60 transition-colors overflow-hidden">
                                <div className="w-full aspect-video overflow-hidden bg-white/5">
                                    <img src={work.banner} alt={work.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="eager" />
                                </div>
                                <div className="flex flex-col gap-2 px-4 pb-4">
                                    <div className="flex items-baseline justify-between gap-3">
                                        <h3 className="font-display text-2xl leading-none tracking-tight">
                                            {work.title}
                                        </h3>
                                        <span className="font-mono-label truncate" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                            {work.host} ↗
                                        </span>
                                    </div>
                                    <p className="leading-relaxed text-sm text-neutral-300">
                                        {work.description}
                                    </p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SelectedWorks;
