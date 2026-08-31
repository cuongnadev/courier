import { CornerDownLeft, Search } from "lucide-react";

type SearchEmptyProps = {
  hasQuery: boolean;
};

export function SearchEmpty({
  hasQuery,
}: SearchEmptyProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex size-16 items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50">
        <Search className="size-8 text-neutral-400" />
      </div>

      {hasQuery ? (
        <>
          <h3 className="text-lg font-semibold text-neutral-900">
            No results found
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500">
            We couldn't find anything matching your search.
            Try another keyword or check the spelling.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-neutral-900">
            Search your workspace
          </h3>

          <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500">
            Search collections, requests, flows and quickly jump
            to any resource.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {["Collections", "Requests", "Flows"].map((label) => (
              <span
                key={label}
                className="
                  rounded-full
                  border
                  border-neutral-200
                  bg-neutral-50

                  px-4
                  py-2

                  text-sm
                  font-medium
                  text-neutral-600
                "
              >
                {label}
              </span>
            ))}
          </div>

          <div
            className="
              mt-10

              flex
              items-center
              gap-2

              rounded-full

              bg-neutral-50

              px-4
              py-2

              text-sm
              text-neutral-500
            "
          >
            <CornerDownLeft className="size-4" />

            <span>
              Press <strong className="font-semibold text-neutral-700">
                Enter
              </strong>{" "}
              to open the selected result
            </span>
          </div>
        </>
      )}
    </div>
  );
}