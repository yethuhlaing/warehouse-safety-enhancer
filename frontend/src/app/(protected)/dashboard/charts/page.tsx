import { constructMetadata } from "@/lib/utils";

import { DashboardHeader } from "@/components/dashboard/header";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChartStacked } from "@/components/charts/area-chart-stacked";
import { BarChartMixed } from "@/components/charts/bar-chart-mixed";
import { RadarChartSimple } from "@/components/charts/radar-chart-simple";
import { RadialChartGrid } from "@/components/charts/radial-chart-grid";
import { RadialShapeChart } from "@/components/charts/radial-shape-chart";
import { RadialStackedChart } from "@/components/charts/radial-stacked-chart";
import { RadialTextChart } from "@/components/charts/radial-text-chart";
import { BarChartNoise } from "@/components/charts/bar-chart-noise";
import { LineChartTemperature } from "@/components/charts/line-chart-temperature";

export const metadata = constructMetadata({
    title: "Charts – SaaS Starter",
    description: "List of charts by shadcn-ui",
});

export default function ChartsPage() {

    return (
        <>
            <DashboardHeader
                heading="Charts"
                text="List of charts by shadcn-ui."
            />
            <div className="flex flex-col gap-5">
                {/* <LineChartTemperature /> */}
                {/* <AreaChartStacked /> */}

                {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                    <RadialTextChart />
                    <BarChartMixed />
                    <RadarChartSimple />
                </div> */}

                <BarChartNoise />
                {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                    <RadialChartGrid />
                    <RadialShapeChart />
                    <RadialStackedChart />
                </div> */}
            </div>
        </>
    );
}
