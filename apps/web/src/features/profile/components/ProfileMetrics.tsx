import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Gauge,
  Timer,
} from "lucide-react";

import { MetricTile } from "./MetricTile";

type ProfileMetricsProps = {
  loading: boolean;
  runsValue: string;
  successValue: string;
  averageTimeValue: string;
  activeDaysValue: string;
  dataValue: string;
};

export function ProfileMetrics({
  loading,
  runsValue,
  successValue,
  averageTimeValue,
  activeDaysValue,
  dataValue,
}: ProfileMetricsProps) {
  return (
    <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
      <MetricTile
        icon={<Activity size={17} />}
        iconClassName="bg-orange-50 text-orange-600"
        label="Runs"
        value={runsValue}
        loading={loading}
      />
      <MetricTile
        icon={<CheckCircle2 size={17} />}
        iconClassName="bg-green-50 text-green-600"
        label="Success"
        value={successValue}
        loading={loading}
      />
      <MetricTile
        icon={<Timer size={17} />}
        iconClassName="bg-blue-50 text-blue-600"
        label="Avg time"
        value={averageTimeValue}
        loading={loading}
      />
      <MetricTile
        icon={<CalendarDays size={17} />}
        iconClassName="bg-fuchsia-50 text-fuchsia-600"
        label="Active days"
        value={activeDaysValue}
        loading={loading}
      />
      <MetricTile
        icon={<Gauge size={17} />}
        iconClassName="bg-amber-50 text-amber-600"
        label="Data"
        value={dataValue}
        loading={loading}
      />
    </section>
  );
}
