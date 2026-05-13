import { SearchInput } from "@/components/forms/search-input";


export function Header() {
    return (
        <header className="w-full h-16 flex items-center justify-between border-b-[1.25px] border-[#E5E5E5] bg-white">
            <div>
                <SearchInput
                    placeholder="Search requests, collections, flows... (⌘K)"
                    shortcut="⌘K"
                    className="w-[520px] gap-3"
                />
            </div>
        </header>
    );
}