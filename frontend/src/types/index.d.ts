import { User } from "@prisma/client";
import type { Icon } from "lucide-react";

import { Icons } from "@/components/shared/icons";


export type SiteConfig = {
    name: string;
    description: string;
    url: string;
    ogImage: string;
    mailSupport: string;
    links: {
        twitter: string;
        github: string;
    };
};

export type NavItem = {
    title: string;
    href: string;
    badge?: number;
    disabled?: boolean;
    external?: boolean;
    authorizeOnly?: UserRole;
    icon?: keyof typeof Icons;
};

export type MainNavItem = NavItem;

export type MarketingConfig = {
    mainNav: MainNavItem[];
};

export type SidebarNavItem = {
    title: string;
    items: NavItem[];
    authorizeOnly?: UserRole;
    icon?: keyof typeof Icons;
};

export type DocsConfig = {
    mainNav: MainNavItem[];
    sidebarNav: SidebarNavItem[];
};

// subcriptions
export type SubscriptionPlan = {
    title: string;
    description: string;
    benefits: string[];
    limitations: string[];
    prices: {
        monthly: number;
        yearly: number;
    };
    stripeIds: {
        monthly: string | null;
        yearly: string | null;
    };
};

export type UserSubscriptionPlan = SubscriptionPlan &
    Pick<
        User,
        "stripeCustomerId" | "stripeSubscriptionId" | "stripePriceId"
    > & {
        stripeCurrentPeriodEnd: number;
        isPaid: boolean;
        interval: "month" | "year" | null;
        isCanceled?: boolean;
    };

// compare plans
export type ColumnType = string | boolean | null;
export type PlansRow = { feature: string; tooltip?: string } & {
    [key in (typeof plansColumns)[number]]: ColumnType;
};

// landing sections
export type InfoList = {
    icon: keyof typeof Icons;
    title: string;
    description: string;
};

export type InfoLdg = {
    title: string;
    image: string;
    description: string;
    list: InfoList[];
};

export type FeatureLdg = {
    title: string;
    description: string;
    link: string;
    icon: keyof typeof Icons;
};

export type TestimonialType = {
    name: string;
    job: string;
    image: string;
    review: string;
};


// Dashboard Carts
export type SensorData = {
    _time: Date;                 // Time as a Date object
    _value: number;              // Measurement value (e.g., 0.7077731111296438)
    _field?: string;              // 'co'
    _measurement?: string;        // 'airSensors'
    sensor_id?: string;           // 'TLM0201'
};


export type aggregateData = { 
    meanData: SensorData[], 
    minData: SensorData[], 
    maxData: SensorData[]
} | null;

export interface UseWebSocketResult {
    sensorData: SensorData[] | null;
    connectionStatus: 'connecting' | 'connected' | 'disconnected';
    error: Error | null;
    reconnect: () => void;
    sendMessage: (message: string) => void;
}

export type FormattedAggregateData = {
    field: string | null
    average: string | null
    minimum: string | null 
    maximum: string | null
};


export const fields = [
    'temperature', 'humidity', 'co', 'no2', 'pm10', 'propane', 'methane', 'emergency',
    'light_intensity', 'motion_detected', 'vibration', 'noise_level',
    'water_level', 'storage-population', 'lobby-population', 'office-population', 'cafeteria-population', 'security-population', 'inspection-population', 'automation-population', 'maintenance-population'
]

export type FieldType = typeof fields[number];
