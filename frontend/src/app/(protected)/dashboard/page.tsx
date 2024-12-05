import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import BIMViewer from "./Dashboard";

export const metadata = constructMetadata({
    title: "Dashboard – SenseIQ",
    description: "Create and manage content.",
});

export default async function DashboardPage() {
    const user = await getCurrentUser();

    return (
        <>
            <DashboardHeader
                heading="Dashboard"
                text={`Current Role : ${user?.role} — Change your role in settings.`}
            />
            <BIMViewer />
        </>
    );
}
