type SidebarSectionProps = {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

export function SidebarSection({
  title,
  action,
  children,
}: SidebarSectionProps) {
  return (
    <section className="border-b border-[#E5E5E5] p-2">
      <div className="mb-2 flex items-center justify-between px-4">
        <h2 className="text-xs font-medium uppercase text-[#737373]">
          {title}
        </h2>

        {action}
      </div>

      <nav className="space-y-1">
        {children}
      </nav>
    </section>
  );
}