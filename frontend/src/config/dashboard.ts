import { SidebarNavItem } from "@/types";
import { UserRole } from "@prisma/client";


export const sidebarLinks: SidebarNavItem[] = [
    {
        title: "MENU",
        items: [
            {
                href: "/admin",
                icon: "laptop",
                title: "Admin Panel",
                authorizeOnly: UserRole.ADMIN,
            },
            { href: "/dashboard", icon: "dashboard", title: "Dashboard" },
            {
                href: "/dashboard/billing",
                icon: "billing",
                title: "Billing",
                authorizeOnly: UserRole.USER,
            },
            { href: "/dashboard/charts", icon: "lineChart", title: "Charts" },
            {
                href: "/admin/orders",
                icon: "package",
                title: "Orders",
                badge: 2,
                authorizeOnly: UserRole.ADMIN,
            },
        ],
    },
    {
        title: "OPTIONS",
        items: [
            {
                href: "/dashboard/settings",
                icon: "settings",
                title: "Settings",
            },
            { href: "/", icon: "home", title: "Homepage" },
            {
                href: "#",
                icon: "messages",
                title: "Support",
                authorizeOnly: UserRole.USER,
                disabled: true,
            },
        ],
    },
];
