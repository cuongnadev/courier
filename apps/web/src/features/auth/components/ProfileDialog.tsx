import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Clock,
  Gauge,
  Mail,
  Timer,
  Trash2,
  User as UserIcon,
  VenusAndMars,
} from "lucide-react";

import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@repo/ui";

import { useDeleteUser } from "@/features/auth/hooks/use-delete-user";
import { useProfileActivityMetrics } from "@/features/dashboard/hooks/use-profile-activity-metrics";
import type { ProfileActivityDay } from "@/features/dashboard/types/dashboard.type";
import type { User } from "@/features/auth/types/auth.type";

type ProfileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  workspaceId?: string | null;
};

const fallbackAvatar =
  "https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=Sophie";

export function ProfileDialog({
  open,
  onOpenChange,
  user,
  workspaceId,
}: ProfileDialogProps) {
  const avatarUrl = user?.photoUrl || fallbackAvatar;
  const initials = getInitials(user?.fullName);
  const { data: activity, isLoading } = useProfileActivityMetrics(
    open ? (workspaceId ?? null) : null,
  );
  const heatmapScrollRef = useRef<HTMLDivElement | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteConfirmValue, setDeleteConfirmValue] = useState("");
  const [deleteConfirmError, setDeleteConfirmError] = useState("");
  const deleteUserMutation = useDeleteUser();

  const weeks = buildActivityWeeks(activity?.days ?? []);
  const monthLabels = buildMonthLabels(weeks);
  const mostActiveDay = activity?.days.reduce<ProfileActivityDay | null>(
    (best, day) => (!best || day.runs > best.runs ? day : best),
    null,
  );

  useEffect(() => {
    if (!open || !heatmapScrollRef.current) return;

    const frameId = window.requestAnimationFrame(() => {
      const scrollElement = heatmapScrollRef.current;
      if (!scrollElement) return;

      scrollElement.scrollLeft = scrollElement.scrollWidth;
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [open, activity?.days.length]);

  const handleDeleteUser = async () => {
    const expectedValue = user?.email ?? "";

    if (!expectedValue || deleteConfirmValue.trim() !== expectedValue) {
      setDeleteConfirmError(
        `Type ${expectedValue || "your email"} exactly to continue.`,
      );
      return;
    }

    setDeleteConfirmError("");
    await deleteUserMutation.mutateAsync();
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setIsDeleteConfirmOpen(false);
      setDeleteConfirmValue("");
      setDeleteConfirmError("");
    }

    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="
          w-[calc(100vw-32px)]! max-w-210!
          max-h-[calc(100vh-32px)] gap-0 overflow-hidden rounded-[16px]
          border border-[#E5E5E5]
          bg-white p-0 shadow-lg

          **:data-[slot=dialog-close]:text-[#525252]
          **:data-[slot=dialog-close]:hover:bg-neutral-100
          **:data-[slot=dialog-close]:hover:text-[#171717]
        "
      >
        <DialogHeader className="border-b border-[#E5E5E5] p-6">
          <DialogTitle className="text-xl font-semibold text-[#171717]">
            Profile
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[calc(100vh-120px)] overflow-y-auto p-6 dashboard-scrollbar">
          <section className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-[18px] bg-neutral-100">
                <img
                  src={avatarUrl}
                  alt={
                    user?.fullName ? `${user.fullName} avatar` : "User avatar"
                  }
                  className="h-full w-full object-cover"
                />

                {!user?.photoUrl && (
                  <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 text-xl font-semibold text-white">
                    {initials}
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-2xl font-semibold text-[#171717]">
                  {user?.fullName || "Unknown user"}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-[#737373]">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail size={15} />
                    {user?.email || "No email"}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <VenusAndMars size={15} />
                    {formatGender(user?.gender) ?? "Gender not set"}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-[12px] border border-[#E5E5E5] bg-[#FAFAFA] px-4 py-3">
              <div className="text-xs font-medium uppercase tracking-[0.04em] text-[#737373]">
                Member since
              </div>
              <div className="mt-1 text-sm font-semibold text-[#171717]">
                {formatDate(user?.createdAt) ?? "Not set"}
              </div>
            </div>
          </section>

          <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
            <MetricTile
              icon={<Activity size={17} />}
              iconClassName="bg-orange-50 text-orange-600"
              label="Runs"
              value={formatNumber(activity?.totalRuns)}
              loading={isLoading}
            />
            <MetricTile
              icon={<CheckCircle2 size={17} />}
              iconClassName="bg-green-50 text-green-600"
              label="Success"
              value={`${activity?.successRate ?? 0}%`}
              loading={isLoading}
            />
            <MetricTile
              icon={<Timer size={17} />}
              iconClassName="bg-blue-50 text-blue-600"
              label="Avg time"
              value={formatDuration(activity?.averageDurationMs)}
              loading={isLoading}
            />
            <MetricTile
              icon={<CalendarDays size={17} />}
              iconClassName="bg-fuchsia-50 text-fuchsia-600"
              label="Active days"
              value={formatNumber(activity?.activeDays)}
              loading={isLoading}
            />
            <MetricTile
              icon={<Gauge size={17} />}
              iconClassName="bg-amber-50 text-amber-600"
              label="Data"
              value={formatBytes(activity?.totalResponseSize)}
              loading={isLoading}
            />
          </section>

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
                {[0, 1, 2, 3, 4].map((level) => (
                  <span
                    key={level}
                    className="h-3 w-3 rounded-[3px] border border-black/5"
                    style={{ backgroundColor: getHeatColor(level) }}
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
                  {weeks.flatMap((week, weekIndex) =>
                    week.map((day, dayIndex) => (
                      <div
                        key={`${weekIndex}-${dayIndex}-${day?.date ?? "empty"}`}
                        title={day ? getDayTitle(day) : undefined}
                        className="h-3.25 w-3.25 rounded-[3px] border border-black/5"
                        style={{
                          backgroundColor: getHeatColor(
                            getHeatLevel(day?.runs ?? 0),
                          ),
                        }}
                      />
                    )),
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Insight
                label="Best day"
                value={
                  mostActiveDay?.runs
                    ? `${mostActiveDay.runs} runs`
                    : "No runs yet"
                }
                detail={
                  mostActiveDay?.runs ? formatShortDate(mostActiveDay.date) : ""
                }
              />
              <Insight
                label="Successful"
                value={formatNumber(activity?.successfulRuns)}
                detail={`${formatNumber(activity?.failedRuns)} failed`}
              />
              <Insight
                label="Profile"
                value={user?.age == null ? "Age not set" : `${user.age} years`}
                detail={`Updated ${formatDate(user?.updatedAt) ?? "not set"}`}
              />
            </div>
          </section>

          <section className="mt-6 grid gap-3 md:grid-cols-2">
            <ProfileFact
              icon={<UserIcon size={17} />}
              iconClassName="bg-sky-50 text-sky-600"
              label="Full name"
              value={user?.fullName}
            />
            <ProfileFact
              icon={<Mail size={17} />}
              iconClassName="bg-indigo-50 text-indigo-600"
              label="Email"
              value={user?.email}
            />
            <ProfileFact
              icon={<VenusAndMars size={17} />}
              iconClassName="bg-pink-50 text-pink-600"
              label="Gender"
              value={formatGender(user?.gender)}
            />
            <ProfileFact
              icon={<Clock size={17} />}
              iconClassName="bg-teal-50 text-teal-600"
              label="Last profile update"
              value={formatDate(user?.updatedAt)}
            />
          </section>

          <hr className="mt-10 pb-10 text-gray-700/50" />

          <section className="mt-6 rounded-[12px] border border-red-200 bg-red-50/50 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-sm font-semibold text-red-700">
                  <Trash2 size={17} />
                  Delete account
                </div>
                <p className="mt-2 text-sm leading-6 text-red-700/80">
                  This permanently deletes your account. Owned workspaces and
                  their data will be removed; historical runs may remain without
                  a user owner.
                </p>
              </div>

              {!isDeleteConfirmOpen && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  className="h-10 shrink-0 rounded-[12px] border-red-300 bg-white text-red-700 hover:bg-red-100 hover:text-red-800"
                >
                  Delete
                </Button>
              )}
            </div>

            {isDeleteConfirmOpen && (
              <div className="mt-4 rounded-[12px] border border-red-200 bg-white p-4">
                <label
                  htmlFor="delete-user-confirmation"
                  className="text-sm font-medium text-[#171717]"
                >
                  Type{" "}
                  <span className="font-semibold text-red-700">
                    {user?.email || "your email"}
                  </span>{" "}
                  to confirm.
                </label>

                <Input
                  id="delete-user-confirmation"
                  value={deleteConfirmValue}
                  onChange={(event) => {
                    setDeleteConfirmValue(event.target.value);
                    setDeleteConfirmError("");
                  }}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  aria-invalid={Boolean(deleteConfirmError)}
                  className="
                    mt-3 h-10 rounded-[12px]
                    border border-red-200
                    bg-white px-3 text-sm text-[#171717]
                    placeholder:text-red-300
                    focus-visible:border-red-400
                    focus-visible:ring-2
                    focus-visible:ring-red-200
                  "
                  placeholder={user?.email || "your email"}
                />

                {deleteConfirmError && (
                  <p className="mt-2 text-sm font-medium text-red-600">
                    {deleteConfirmError}
                  </p>
                )}

                <div className="mt-4 flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={deleteUserMutation.isPending}
                    onClick={() => {
                      setIsDeleteConfirmOpen(false);
                      setDeleteConfirmValue("");
                      setDeleteConfirmError("");
                    }}
                    className="h-10 rounded-[12px]"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="button"
                    disabled={deleteUserMutation.isPending}
                    onClick={() => void handleDeleteUser()}
                    className="h-10 rounded-[12px] bg-red-600 text-white hover:bg-red-700"
                  >
                    {deleteUserMutation.isPending
                      ? "Deleting..."
                      : "Delete account"}
                  </Button>
                </div>
              </div>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type MetricTileProps = {
  icon: ReactNode;
  iconClassName: string;
  label: string;
  value: string;
  loading: boolean;
};

function MetricTile({
  icon,
  iconClassName,
  label,
  value,
  loading,
}: MetricTileProps) {
  return (
    <div className="rounded-[12px] border border-[#E5E5E5] bg-[#FAFAFA] p-4">
      <div className="flex items-center justify-between text-[#737373]">
        <span className="text-xs font-medium uppercase tracking-[0.04em]">
          {label}
        </span>
        <span
          className={`
            flex h-8 w-8 items-center justify-center rounded-[8px]
            ${iconClassName}
          `}
        >
          {icon}
        </span>
      </div>
      <div className="mt-3 text-xl font-semibold text-[#171717]">
        {loading ? "..." : value}
      </div>
    </div>
  );
}

type InsightProps = {
  label: string;
  value: string;
  detail: string;
};

function Insight({ label, value, detail }: InsightProps) {
  return (
    <div className="rounded-[12px] bg-[#FAFAFA] px-4 py-3">
      <div className="text-xs font-medium uppercase tracking-[0.04em] text-[#737373]">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-[#171717]">{value}</div>
      {detail && <div className="mt-1 text-xs text-[#737373]">{detail}</div>}
    </div>
  );
}

type ProfileFactProps = {
  icon: ReactNode;
  iconClassName: string;
  label: string;
  value?: string | null;
};

function ProfileFact({ icon, iconClassName, label, value }: ProfileFactProps) {
  return (
    <div className="flex items-start gap-3 rounded-[12px] border border-[#E5E5E5] bg-white px-4 py-3">
      <div
        className={`
          mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg
          ${iconClassName}
        `}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="text-xs font-medium uppercase tracking-[0.04em] text-[#737373]">
          {label}
        </div>
        <div className="mt-1 wrap-break-word text-sm font-medium text-[#171717]">
          {value?.trim() || "Not set"}
        </div>
      </div>
    </div>
  );
}

function buildActivityWeeks(days: ProfileActivityDay[]) {
  const cells: Array<ProfileActivityDay | null> = [];

  if (days.length === 0) {
    return Array.from({ length: 12 }, () => Array(7).fill(null));
  }

  const firstDay = new Date(days[0].date);
  const leadingEmptyDays = firstDay.getDay();

  for (let index = 0; index < leadingEmptyDays; index += 1) {
    cells.push(null);
  }

  cells.push(...days);

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return Array.from({ length: Math.ceil(cells.length / 7) }, (_, weekIndex) =>
    cells.slice(weekIndex * 7, weekIndex * 7 + 7),
  );
}

function buildMonthLabels(weeks: Array<Array<ProfileActivityDay | null>>) {
  let previousMonth = "";

  return weeks.map((week) => {
    const firstDay = week.find((day) => day !== null);

    if (!firstDay) return "";

    const month = formatMonth(firstDay.date);

    if (month === previousMonth) return "";

    previousMonth = month;
    return month;
  });
}

function getHeatLevel(runs: number) {
  if (runs === 0) return 0;
  if (runs <= 2) return 1;
  if (runs <= 5) return 2;
  if (runs <= 9) return 3;
  return 4;
}

function getHeatColor(level: number) {
  const colors = ["#F3F4F6", "#CFF7D3", "#7DD87F", "#34A853", "#176B34"];

  return colors[level] ?? colors[0];
}

function getDayTitle(day: ProfileActivityDay) {
  return `${formatShortDate(day.date)}: ${day.runs} runs, ${day.successfulRuns} successful`;
}

function getInitials(name?: string) {
  if (!name?.trim()) return "?";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatGender(gender?: string | null) {
  if (!gender) return null;

  return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
}

function formatDate(value?: string) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatShortDate(value?: string) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(date);
}

function formatMonth(value?: string) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
  }).format(date);
}

function formatNumber(value?: number) {
  return (value ?? 0).toLocaleString();
}

function formatDuration(value?: number) {
  const duration = value ?? 0;

  if (duration >= 1000) {
    return `${(duration / 1000).toFixed(1)}s`;
  }

  return `${duration}ms`;
}

function formatBytes(value?: number) {
  const bytes = value ?? 0;

  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${bytes} B`;
}
