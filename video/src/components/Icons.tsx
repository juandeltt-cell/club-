import React from "react";

type P = { size?: number; color?: string; style?: React.CSSProperties; stroke?: number };

const S: React.FC<P & { children: React.ReactNode; fill?: boolean }> = ({ size = 48, color = "currentColor", style, stroke = 1.8, children, fill }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block", ...style }}
    fill={fill ? color : "none"} stroke={fill ? "none" : color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export const StarIcon: React.FC<P> = (p) => (
  <S {...p} fill><path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2 6.4 20.2l1.1-6.3L2.9 9.5l6.3-.9L12 2.8Z" /></S>
);
export const SparkleIcon: React.FC<P> = (p) => (
  <S {...p} fill>
    <path d="M12 2.5c.5 4.6 2.4 6.8 7 7.5-4.6.7-6.5 2.9-7 7.5-.5-4.6-2.4-6.8-7-7.5 4.6-.7 6.5-2.9 7-7.5Z" />
    <path d="M19 14.5c.25 2.1 1.1 3 3 3.3-1.9.3-2.75 1.2-3 3.2-.25-2-1.1-2.9-3-3.2 1.9-.3 2.75-1.2 3-3.3Z" />
  </S>
);
export const GiftIcon: React.FC<P & { lid?: number }> = ({ lid = 0, ...p }) => (
  <S {...p}>
    <g transform={`translate(0 ${-lid * 3}) rotate(${-lid * 8} 12 8.5)`}>
      <rect x="3.5" y="8.5" width="17" height="4" rx="1" />
      <path d="M12 8.5C10.5 5 7 4.5 7 6.8S10 8.5 12 8.5ZM12 8.5c1.5-3.5 5-4 5-1.7S14 8.5 12 8.5Z" />
    </g>
    <path d="M5 12.5V20h14v-7.5M12 12.5V20" />
  </S>
);
export const ChatIcon: React.FC<P & { dots?: number }> = ({ dots = 1, ...p }) => (
  <S {...p}>
    <path d="M4 5.5h16v10.5H9l-5 4V5.5Z" />
    {[8.5, 12, 15.5].map((x, i) => (
      <circle key={i} cx={x} cy={10.7} r={1.1} fill={p.color ?? "currentColor"} stroke="none"
        style={{ opacity: 0.35 + 0.65 * Math.max(0, Math.sin(dots * Math.PI - i * 0.9)) }} />
    ))}
  </S>
);
export const PersonIcon: React.FC<P> = (p) => (
  <S {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c.8-4.2 4-6.5 8-6.5s7.2 2.3 8 6.5" /></S>
);
export const CakeIcon: React.FC<P> = (p) => (
  <S {...p}>
    <path d="M4 20.5h16v-7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7Z" />
    <path d="M4 15.5c1.3 1 2.7 1 4 0s2.7-1 4 0 2.7 1 4 0 2.7-1 4 0" />
    <path d="M12 11.5V8" /><path d="M12 3.5c1 1.2 1 2.4 0 3-1-.6-1-1.8 0-3Z" />
  </S>
);
export const CheckIcon: React.FC<P> = (p) => <S stroke={2.6} {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></S>;
export const DoubleCheckIcon: React.FC<P> = (p) => (
  <S stroke={2.2} {...p}><path d="m2.5 12.5 4 4L15 8" /><path d="m11.5 16.5 1 0L21 8" /></S>
);
export const ArrowIcon: React.FC<P> = (p) => <S stroke={2.4} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></S>;
export const CameraCorners: React.FC<{ size: number; color: string; stroke?: number }> = ({ size, color, stroke = 8 }) => {
  const l = size * 0.18;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <g fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round">
        <path d={`M${stroke} ${l} V${stroke} H${l}`} />
        <path d={`M${size - l} ${stroke} H${size - stroke} V${l}`} />
        <path d={`M${size - stroke} ${size - l} V${size - stroke} H${size - l}`} />
        <path d={`M${l} ${size - stroke} H${stroke} V${size - l}`} />
      </g>
    </svg>
  );
};
