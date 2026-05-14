export type IconProps = {
    width?: number | string;
    height?: number | string;
    iconColor?: string;
}

export type StaticSidebarItem = {
    to: string;
    label: string;
    icon: React.ElementType;
};
