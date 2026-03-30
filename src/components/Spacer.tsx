interface SpacerProps {
  space: number;
}

export function Spacer({ space }: SpacerProps) {
  return (
    <div
      className="spacer flex items-center justify-center"
      style={{ height: `${space}px` }}
      aria-hidden="true"
    >
      <div className="w-full h-px bg-stone-300" />
    </div>
  );
}
