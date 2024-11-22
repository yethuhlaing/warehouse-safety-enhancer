import { constructMetadata } from "@/lib/utils";

import { DashboardHeader } from "@/components/dashboard/header";
import { Skeleton } from "@/components/ui/skeleton";
import { AreaChartStacked } from "@/components/charts/area-chart-stacked";
import { BarChartMixed } from "@/components/charts/bar-chart-mixed";
import { RadialStackedChart } from "@/components/charts/radial-stacked-chart";
import { BarChartNoise } from "@/components/charts/bar-chart-noise";
import { LineChartTemperature } from "@/components/charts/line-chart-temperature";
import { GuageEmergency } from "@/components/charts/guage-emergency";
import { GuageLightIntensity } from "@/components/charts/guage-light-intensity";
import { GuageVibration } from "@/components/charts/guage-vibration";
import { RadialGridGas } from "@/components/charts/radial-grid-gas";
import { RadarChartPopulation } from "@/components/charts/radar-chart-population";

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
            <div className="grid gap-4 sm:grid-cols-3">
      <div className="h-24 bg-gray-300 sm:col-span-1"></div>
      <div className="h-24 bg-gray-300 sm:col-span-1"></div>
      <div className="h-24 bg-gray-300 sm:col-span-1"></div>
      <div className="h-24 bg-gray-300 sm:col-span-2"></div>
      <div className="h-24 bg-gray-300 sm:col-span-1"></div>
      <div className="h-24 bg-gray-300 sm:col-span-2"></div>
      <div className="h-24 bg-gray-300 sm:col-span-1"></div>
      <div className="h-24 bg-gray-300 sm:col-span-3"></div>
    </div>
                {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                    <LineChartTemperature />
                    <AreaChartStacked />
                </div>
                <RadarChartPopulation />
                <BarChartNoise />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                    <RadialGridGas />
                    <GuageEmergency />
                    <GuageLightIntensity /> 
                    <GuageVibration />
                </div> */}
                {/* <BarChartMixed />
                <RadialStackedChart /> */}

            </div>
        </>
    );
}
