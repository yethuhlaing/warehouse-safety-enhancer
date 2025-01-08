import Image from "next/image";

import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function PreviewLanding() {
    return (
        <div className="pb-6 sm:pb-16">
            <MaxWidthWrapper>
                <div className="rounded-xl md:bg-muted/30 md:p-3.5 md:ring-1 md:ring-inset md:ring-border">
                    <div className="relative aspect-video overflow-hidden rounded-xl border md:rounded-lg">
                        <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube.com/embed/6-fNOPSlbbs"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </MaxWidthWrapper>
        </div>
    );
}
