import type { RefObject } from "react";

import { Insight } from "./Insight";

type HeatmapCell = {
  key: string;
  title?: string;
  color: string;
};

type ProfileActivityHeatmapProps = {
  heatmapScrollRef: RefObject<HTMLDivElement | null>;
  monthLabels: string[];
  legendColors: string[];
  heatmapWeeks: HeatmapCell[][];
  bestDayValue: string;
  bestDayDetail: string;
  successfulValue: string;
  successfulDetail: string;
  profileValue: string;
  profileDetail: string;
};

export function ProfileActivityHeatmap({
  heatmapScrollRef,
  monthLabels,
  legendColors,
  heatmapWeeks,
  bestDayValue,
  bestDayDetail,
  successfulValue,
  successfulDetail,
  profileValue,
  profileDetail,
}: ProfileActivityHeatmapProps) {
  return (
    <section className="mt-6 rounded-[16px] border border-[#E5E5E5] bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-[#171717]">
            Request runs
          </h3>
          <p className="mt-1 text-sm text-[#737373]">
            Daily activity across the last year in this workspace.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#737373]">
          <span>Less</span>
          {legendColors.map((color, index) => (
            <span
              key={`${color}-${index}`}
              className="h-3 w-3 rounded-[3px] border border-black/5"
              style={{ backgroundColor: color }}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-[auto_1fr] gap-3">
        <div className="grid shrink-0 grid-rows-[repeat(7,13px)] gap-1 pt-5 text-[10px] leading-none text-[#737373]">
          <span className="h-3.25" />
          <span className="flex h-3.25 items-center">Mon</span>
          <span className="h-3.25" />
          <span className="flex h-3.25 items-center">Wed</span>
          <span className="h-3.25" />
          <span className="flex h-3.25 items-center">Fri</span>
          <span className="h-3.25" />
        </div>

        <div
          ref={heatmapScrollRef}
          className="overflow-x-auto pb-1 dashboard-scrollbar"
        >
          <div className="mb-1 grid w-max grid-flow-col gap-1 pr-1 text-[10px] leading-4 text-[#737373]">
            {monthLabels.map((month, index) => (
              <span
                key={`${month}-${index}`}
                className="h-4 w-3.25 whitespace-nowrap"
              >
                {month}
              </span>
            ))}
          </div>

          <div className="grid w-max grid-flow-col grid-rows-7 gap-1 pr-1">
            {heatmapWeeks.flatMap((week) =>
              week.map((day) => (
                <div
                  key={day.key}
                  title={day.title}
                  className="h-3.25 w-3.25 rounded-[3px] border border-black/5"
                  style={{ backgroundColor: day.color }}
                />
              )),
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Insight label="Best day" value={bestDayValue} detail={bestDayDetail} />
        <Insight
          label="Successful"
          value={successfulValue}
          detail={successfulDetail}
        />
        <Insight label="Profile" value={profileValue} detail={profileDetail} />
      </div>
    </section>
  );
}
