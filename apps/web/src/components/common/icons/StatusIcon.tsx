import type { ReactNode } from 'react';

type IconBadgeProps = {
    children: ReactNode;
    backgroundColor?: string;
    borderColor?: string;
    glowColor?: string;
    className?: string;
};

export function IconBadge({
    children,
    backgroundColor = '#0D0D0D',
    borderColor = '#2A2A2A',
    glowColor = 'rgba(0,0,0,0)',
    className = 'w-12 h-12',
}: IconBadgeProps) {
    return (
        <div
            className={`flex items-center justify-center rounded-2xl border ${className}`}
            style={{
                backgroundColor,
                borderColor,
                boxShadow: `0 0 24px ${glowColor}`,
            }}
        >
            {children}
        </div>
    );
}