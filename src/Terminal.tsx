import { useEffect, useRef, useState, type ReactNode } from 'react';

type Work = {
    name: string;
    url?: string;
    description: string;
};

const WORKS: Work[] = [
    {
        name: 'sleep-it-out',
        description: 'An upcoming short film written, directed, and edited by yours truly.'
    },
    {
        name: 'polygraph',
        description: 'A portable device in the making.'
    },
    {
        name: 'GenesisProtocol',
        description: 'Work-in-progress of training AI to play different games.'
    }, 
    {
        name: 'cinelaya',
        url: 'https://app.cinelaya.com',
        description: 'A suite of tools for filmmakers streamlining pre to post-production.',
    },
    {
        name: 'kideae',
        url: 'https://kideae.com',
        description: 'Local AI-powered whiteboard. Focusing on privacy and simplicity.',
    },
    {
        name: 'simple-calculator',
        url: 'https://github.com/sevora/simple-calculator',
        description: 'A simple calculator made with Java 11 and JavaFX.',
    },
    {
        name: 'stmviz',
        url: 'https://visualizer.ralphlouisgopez.com',
        description: 'Visualizes the stable marriage problem and its solution.',
    },
];

const NAME_PAD = Math.max(...WORKS.map((work) => work.name.length)) + 4;

const INTERESTS = [
    'electronics',
    'programming',
    'robotics',
    'sound_design',
    'animation',
    'filmmaking',
    '3d_printing',
    'lineart',
    'mathematics',
    'physics',
    'quantum_mechanics',
    'antimatter',
    'time_travel',
];

const CONTACT: [string, string, string][] = [
    ['fb', 'fb.com/p.ralphlouisgopez', 'https://fb.com/p.ralphlouisgopez'],
    ['in', 'linkedin.com/in/ralphlouisgopez', 'https://linkedin.com/in/ralphlouisgopez'],
];

const SUGGESTIONS = [
    'whoami',
    'cat interests.txt',
    'ls projects/',
    'cat contact.txt',
];

const PROMPT = 'ralph@site:~$ ';

function Banner() {
    const [art, setArt] = useState('');

    useEffect(() => {
        fetch('/ascii/moon.txt').then((response) => response.text()).then(setArt).catch(() => {});
    }, []);

    const now = new Date();
    const stamp = now.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });

    return (
        <div className="mb-6 text-term-dim">
            {art && <pre className="text-term-accent mb-4 whitespace-pre leading-normal text-xs">{art}</pre>}
            <div>Welcome to <span className="text-term-fg">ralphlouisgopez.com</span> [portfolio 2026]</div>
            <div className="mt-2"> * Source:  <a href="https://github.com/sevora" target="_blank" rel="noopener noreferrer" className="text-term-accent underline underline-offset-4 decoration-term-accent/40 hover:decoration-term-accent">github.com/sevora</a></div>
            <div> * Type <span className="text-term-fg">help</span> for available commands.</div>
            <div className="mt-2">Last login: {stamp} from web.session</div>
        </div>
    );
}

function Terminal() {
    const [history, setHistory] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const isDesktop = useIsDesktop();
    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    const execute = (rawCommand: string) => {
        const command = rawCommand.trim();
        if (command === "clear") {
            setHistory([]);
            setInput('');
            return;
        }
        setHistory((previous) => [...previous, command]);
        setInput('');
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            execute(input);
        }
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [history]);

    useEffect(() => {
        if (isDesktop) inputRef.current?.focus();
    }, [isDesktop, history.length]);

    return (
        <div className="font-mono text-term-fg text-base md:text-md leading-relaxed">
            <div className="whitespace-pre-wrap" onClick={() => isDesktop && inputRef.current?.focus()}>
                <Banner />
                {
                    history.map(
                        (command, index) => (
                            <div key={index} className="mb-4">
                                <div>
                                    <span className="text-term-dim">{PROMPT}</span>
                                    <span>{command}</span>
                                </div>
                                {renderOutput(command)}
                            </div>
                        )
                    )
                }

                { isDesktop ? (
                    <label className="flex cursor-text">
                        <span className="text-term-dim shrink-0">{PROMPT}</span>
                        <span className="relative flex-1">
                            <span className="whitespace-pre">{input}</span>
                            <span className="term-cursor" />
                            <input ref={inputRef} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeyDown} spellCheck={false} autoComplete="off" autoCapitalize="off" autoCorrect="off" className="absolute inset-0 w-full bg-transparent outline-none text-transparent font-mono" style={{ caretColor: 'transparent' }} />
                        </span>
                    </label>
                ) : (
                    <div>
                        <span className="text-term-dim">{PROMPT}</span>
                        <span className="term-cursor" />
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-1">
                {SUGGESTIONS.map((suggestion) => (
                    <button key={suggestion} type="button" onClick={() => execute(suggestion)} className="text-term-dim hover:text-term-accent cursor-pointer text-left">{suggestion}</button>
                ))}
            </div>
        </div>
    );
}

function useIsDesktop(): boolean {
    const [isDesktop, setIsDesktop] = useState(true);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 768px)');
        const update = () => setIsDesktop(mediaQuery.matches);
        update();
        
        mediaQuery.addEventListener('change', update);
        return () => mediaQuery.removeEventListener('change', update);
    }, []);

    return isDesktop;
}

function renderOutput(rawCommand: string): ReactNode {
    const command = rawCommand.trim();
    if (command === '') return null;

    if (command === 'whoami') {
        return <div>ralphlouisgopez</div>;
    }

    if (command === 'cat interests.txt') {
        return <>{INTERESTS.map((name) => <div key={name}>{name}</div>)}</>;
    }

    if (command === 'ls projects' || command === 'ls projects/') {
        return (
            <>
                {
                    WORKS.map(
                        (work) => (
                            <div key={work.name} className="mb-1">
                                {
                                    work.url
                                        ? <a href={work.url} target="_blank" rel="noopener noreferrer" className="text-term-accent underline underline-offset-4 decoration-term-accent/40 hover:decoration-term-accent">{work.name}</a>
                                        : <span className="text-term-error">{work.name}</span>
                                }
                                <span className="hidden md:inline whitespace-pre">{' '.repeat(Math.max(1, NAME_PAD - work.name.length))}</span>
                                <span className="md:hidden"> </span>
                                <span>{work.description}</span>
                            </div>
                        )
                    )
                }
            </>
        );
    }

    if (command === 'cat contact.txt') {
        return (
            <>
                {
                    CONTACT.map(
                        ([key, label, url]) => (
                            <div key={key}>
                                <span>{key.padEnd(4)}</span>
                                <a href={url} target="_blank" rel="noopener noreferrer" className="text-term-accent underline underline-offset-4 decoration-term-accent/40 hover:decoration-term-accent">{label}</a>
                            </div>
                        )
                    )
                }
            </>
        );
    }

    if (command === 'help') {
        return (
            <>
                <div>available commands:</div>
                {
                    [...SUGGESTIONS, 'help', 'clear'].map(
                        (suggestion) => (
                            <div key={suggestion}><span className="text-term-dim">  </span>{suggestion}</div>
                        )   
                    )
                }
            </>
        );
    }

    return (
        <div>
            <span className="text-term-dim">{command}: </span>
            command not found. type help to see available commands.
        </div>
    );
}

export default Terminal;
