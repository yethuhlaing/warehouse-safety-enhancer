import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

export function UpgradeCard() {
    const router = useRouter();

    const handleRedirect = () => {
      router.push('/pricing');  // Replace with your target path
    };
    return (
        <Card className="md:max-xl:rounded-none md:max-xl:border-none md:max-xl:shadow-none">
            <CardHeader className="md:max-xl:px-4">
                <CardTitle>Upgrade to Pro</CardTitle>
                <CardDescription>
                    Unlock all features and get unlimited access to our support
                    team.
                </CardDescription>
            </CardHeader>
            <CardContent className="md:max-xl:px-4">
                <Button size="sm" className="w-full" onClick={handleRedirect}>
                    Upgrade
                </Button>
            </CardContent>
        </Card>
    );
}
