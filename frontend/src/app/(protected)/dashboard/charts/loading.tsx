import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard/header";

export default function ChartsLoading() {
    return (
        <>
            <DashboardHeader
                heading="Comprehensive Monitoring Dashboard"
                text="Real Time Dashboard"
            />
            <div className="flex flex-col gap-5">
                <Skeleton className="h-80 w-full rounded-lg" /> {/* LineChartTemperature */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 2xl:grid-cols-2">
                    <Skeleton className="h-80 w-full rounded-lg" /> {/* BarChartNoise */}
                    <Skeleton className="h-80 w-full rounded-lg" /> {/* StepChartWaterFlow */}
                </div>

                <Skeleton className="h-80 w-full rounded-lg" /> {/* BarChartWaterLevel */}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 2xl:grid-cols-3">
                    <Skeleton className="h-60 w-full rounded-lg" /> {/* GuageLightIntensity */}
                    <Skeleton className="h-60 w-full rounded-lg" /> {/* GuageVibration */}
                    <Skeleton className="h-60 w-full rounded-lg" /> {/* GuageEmergency */}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 2xl:grid-cols-2">
                    <Skeleton className="h-80 w-full rounded-lg" /> {/* BarChartHumidity */}
                    <Skeleton className="h-80 w-full rounded-lg" /> {/* RadialGridGas */}
                </div>

                <Skeleton className="h-80 w-full rounded-lg" /> {/* AreaChartStacked */}
                <Skeleton className="h-80 w-full rounded-lg" /> {/* RadarChartPopulation */}
            </div>
        </>
    );
}

{/* <div className="flex flex-col gap-5">
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
    <Skeleton className="h-80 w-full rounded-lg md:max-xl:h-[390px] xl:max-2xl:h-[420px]" />
    <Skeleton className="h-80 w-full rounded-lg md:max-xl:h-[390px] xl:max-2xl:h-[420px]" />
    <Skeleton className="h-80 w-full rounded-lg md:max-xl:h-[390px] xl:max-2xl:h-[420px]" />
    <Skeleton className="h-80 w-full rounded-lg md:max-xl:h-[390px] xl:max-2xl:h-[420px]" />
</div>
<Skeleton className="h-[500px] w-full rounded-lg" />
<Skeleton className="h-[500px] w-full rounded-lg" />
</div> */}
