import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@courier/ui-kit";

import { FALLBACKAVATAR } from "@/constants";

import { useDeleteUser } from "@/features/auth/hooks";
import { useProfileActivityMetrics } from "@/features/profile/hooks";

import type { User } from "@/features/auth/types";
import type { ProfileActivityDay } from "@/features/profile/types";

import { DangerZone } from "./DangerZone";
import { ProfileFacts } from "./ProfileFacts";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileMetrics } from "./ProfileMetrics";
import { ProfileActivityHeatmap } from "./ProfileActivityHeatmap";

import {
  getInitials,
  getHeatLevel,
  getHeatColor,
  getDayTitle,
  buildActivityWeeks,
  buildMonthLabels,
  formatGender,
  formatDate,
  formatNumber,
  formatDuration,
  formatBytes,
  formatShortDate
} from "@/features/profile/utils";

type ProfileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  workspaceId?: string | null;
};

export function ProfileDialog({
  open,
  onOpenChange,
  user,
  workspaceId,
}: ProfileDialogProps) {
  const avatarUrl = user?.photoUrl || FALLBACKAVATAR;
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
  const mostActiveDay = (activity?.days ?? []).reduce<ProfileActivityDay | null>(
    (best, day) => (!best || day.runs > best.runs ? day : best),
    null,
  );
  const formattedGender = formatGender(user?.gender);
  const memberSince = formatDate(user?.createdAt);
  const updatedAt = formatDate(user?.updatedAt);
  const legendColors = [0, 1, 2, 3, 4].map((level) => getHeatColor(level));
  const heatmapWeeks = weeks.map((week, weekIndex) =>
    week.map((day, dayIndex) => ({
      key: `${weekIndex}-${dayIndex}-${day?.date ?? "empty"}`,
      title: day ? getDayTitle(day) : undefined,
      color: getHeatColor(getHeatLevel(day?.runs ?? 0)),
    })),
  );
  const runsValue = formatNumber(activity?.totalRuns);
  const successValue = `${activity?.successRate ?? 0}%`;
  const averageTimeValue = formatDuration(activity?.averageDurationMs);
  const activeDaysValue = formatNumber(activity?.activeDays);
  const dataValue = formatBytes(activity?.totalResponseSize);
  const bestDayValue = mostActiveDay?.runs
    ? `${mostActiveDay.runs} runs`
    : "No runs yet";
  const bestDayDetail = mostActiveDay?.runs
    ? formatShortDate(mostActiveDay.date)
    : "";
  const successfulValue = formatNumber(activity?.successfulRuns);
  const successfulDetail = `${formatNumber(activity?.failedRuns)} failed`;
  const profileValue = user?.age == null ? "Age not set" : `${user.age} years`;
  const profileDetail = `Updated ${updatedAt ?? "not set"}`;

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

  const handleDeleteConfirmChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setDeleteConfirmValue(event.target.value);
    setDeleteConfirmError("");
  };

  const handleCancelDeleteConfirm = () => {
    setIsDeleteConfirmOpen(false);
    setDeleteConfirmValue("");
    setDeleteConfirmError("");
  };

  const handleDeleteConfirmOpen = () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirmSubmit = () => {
    void handleDeleteUser();
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
          <ProfileHeader
            user={user}
            avatarUrl={avatarUrl}
            initials={initials}
            gender={formattedGender}
            memberSince={memberSince}
          />

          <ProfileMetrics
            loading={isLoading}
            runsValue={runsValue}
            successValue={successValue}
            averageTimeValue={averageTimeValue}
            activeDaysValue={activeDaysValue}
            dataValue={dataValue}
          />

          <ProfileActivityHeatmap
            heatmapScrollRef={heatmapScrollRef}
            monthLabels={monthLabels}
            legendColors={legendColors}
            heatmapWeeks={heatmapWeeks}
            bestDayValue={bestDayValue}
            bestDayDetail={bestDayDetail}
            successfulValue={successfulValue}
            successfulDetail={successfulDetail}
            profileValue={profileValue}
            profileDetail={profileDetail}
          />

          <ProfileFacts
            fullName={user?.fullName}
            email={user?.email}
            gender={formattedGender}
            updatedAt={updatedAt}
          />

          <hr className="mt-10 pb-10 text-gray-700/50" />

          <DangerZone
            userEmail={user?.email}
            isDeleteConfirmOpen={isDeleteConfirmOpen}
            deleteConfirmValue={deleteConfirmValue}
            deleteConfirmError={deleteConfirmError}
            isDeleting={deleteUserMutation.isPending}
            onOpenDeleteConfirm={handleDeleteConfirmOpen}
            onDeleteConfirmChange={handleDeleteConfirmChange}
            onCancelDeleteConfirm={handleCancelDeleteConfirm}
            onDeleteUser={handleDeleteConfirmSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
