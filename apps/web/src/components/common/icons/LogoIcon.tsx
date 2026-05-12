type LogoProps = {
  width?: number | string;
  height?: number | string;
  backgroundColor?: string;
  borderColor?: string;
  iconColor?: string;
  className?: string;
}

export function Logo({
  backgroundColor = '#181818',
  borderColor = '#2A2A2A',
  iconColor = '#F59E0B',
  className = 'w-12 h-12',
  width = 20,
  height = 20,
}: LogoProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-lg border shadow-[0_0_20px_rgba(245,158,11,0.08)] ${className}`}
      style={{
        backgroundColor,
        borderColor,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        stroke={iconColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
      </svg>
    </div>
  );
}