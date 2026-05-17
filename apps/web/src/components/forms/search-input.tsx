import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { FieldLabel } from "@/components/ui/field";

type SearchInputProps = {
    placeholder?: string;
    shortcut?: string;
    className?: string;
};

export function SearchInput({
    placeholder = "Search requests...",
    shortcut,
    className = "",
}: SearchInputProps) {
    return (
        <FieldLabel
            htmlFor="search"
            className={`
                flex h-10 items-center rounded-[12px]
                border border-[#E5E5E5]
                bg-[#FAFAFA] px-3 transition-colors
                focus-within:border-[#F59E0B]
                focus-within:border-[2px]
                ${className}
            `}
        >
            <Search className="size-4 shrink-0 text-[#8A8A8A]" />

            <Input
                id="search"
                type="search"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                placeholder={placeholder}
                className="
                    h-full flex-1 border-0 bg-transparent px-0
                    text-sm font-normal text-[#171717]

                    shadow-none outline-none

                    placeholder:text-[#1C191780]
                    placeholder:text-[14px]
                    placeholder:font-normal

                    focus-visible:border-0
                    focus-visible:ring-0
                    focus-visible:ring-offset-0

                    selection:bg-transparent

                    autofill:bg-transparent
                    [-webkit-autofill]:bg-transparent
                    [-webkit-autofill]:shadow-[inset_0_0_0px_1000px_transparent]

                    [&::-webkit-search-cancel-button]:appearance-none
                "
            />

            {shortcut && (
                <kbd
                    className="
                        ml-2 shrink-0 rounded-[4px]
                        border border-[#E5E5E5]
                        bg-white px-1.5 py-0.5
                        text-xs text-[#737373]
                    "
                >
                    {shortcut}
                </kbd>
            )}
        </FieldLabel>
    );
}