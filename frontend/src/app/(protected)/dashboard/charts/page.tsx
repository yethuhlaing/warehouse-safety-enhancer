import { constructMetadata } from "@/lib/utils";

import { DashboardHeader } from "@/components/dashboard/header";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChartStacked } from "@/components/charts/area-chart-stacked";
import { BarChartHumidity } from "@/components/charts/bar-chart-humidity";
import { BarChartNoise } from "@/components/charts/bar-chart-noise";
import { LineChartTemperature } from "@/components/charts/line-chart-temperature";
import { GuageEmergency } from "@/components/charts/guage-emergency";
import { GuageLightIntensity } from "@/components/charts/guage-light-intensity";
import { GuageVibration } from "@/components/charts/guage-vibration";
import { RadialGridGas } from "@/components/charts/radial-grid-gas";
import { RadarChartPopulation } from "@/components/charts/radar-chart-population";
import { BarChartWaterLevel } from "@/components/charts/bar-chart-water-level";
import { StepChartWaterFlow } from "@/components/charts/step-chart-water-flow";

export const metadata = constructMetadata({
    title: "Charts – SaaS Starter",
    description: "List of charts by shadcn-ui",
});

export default function ChartsPage() {

    return (
        <>
            <DashboardHeader
                heading="Comprehensive Monitoring Dashboard"
                text="Visualize trends, compare performance, and stay informed with intuitive charts and graphs designed 
    for actionable insights"
            />
            <div className="flex flex-col gap-5">
                <LineChartTemperature />
                <BarChartWaterLevel />
                <StepChartWaterFlow />
                <RadarChartPopulation />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 2xl:grid-cols-2">
                    <BarChartHumidity />
                    <RadialGridGas />
                </div>  
                <AreaChartStacked />
                <BarChartNoise />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 2xl:grid-cols-3">
                    <GuageLightIntensity />
                    <GuageVibration />
                    <GuageEmergency />
                </div>

            </div>
        </>
    );
}
