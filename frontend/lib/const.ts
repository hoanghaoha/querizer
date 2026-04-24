import { IconBolt, IconBuildingBank, IconBuildingFactory, IconBuildingSkyscraper, IconCircle, IconCircleFilled, IconCircleHalf, IconCoin, IconDashboard, IconDatabase, IconDeviceLaptop, IconDeviceTv, IconFlame, IconHeartbeat, IconLeaf, IconMoodSmile, IconPlane, IconSchool, IconShare, IconShoppingCart, IconSkull, IconSword, IconToolsKitchen2, IconTreadmill, IconTruck } from "@tabler/icons-react";

export const NAV_DATA = {
  workspace: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard
    },
    {
      title: "Databases",
      url: "/databases",
      icon: IconDatabase
    },
    {
      title: "Challenges",
      url: "/challenges",
      icon: IconTreadmill
    },
  ],
  community: [
    {
      title: "Leaderboard",
      url: "/leaderboard",
      icon: IconSword,
    },
    {
      title: "Community Challenges",
      url: "/community-challenges",
      icon: IconShare,
    }
  ]
}

export const DATABASE_INDUSTRY = [
  { title: "Technology", icon: IconDeviceLaptop },    // #1 — software, SaaS, data engineering
  { title: "Finance", icon: IconCoin },            // #2 — banking, trading, risk analysis
  { title: "Retail", icon: IconShoppingCart },    // #3 — e-commerce, inventory, sales
  { title: "Healthcare", icon: IconHeartbeat },       // #4 — EHR, clinical data, billing
  { title: "Manufacturing", icon: IconBuildingFactory }, // #5 — ERP, supply chain, QA
  { title: "Logistics", icon: IconTruck },           // #6 — fleet, warehouse, tracking
  { title: "Government", icon: IconBuildingBank },    // #7 — public records, tax, census
  { title: "Education", icon: IconSchool },          // #8 — LMS, student records, research
  { title: "F&B", icon: IconToolsKitchen2 },  // #9 — POS, inventory, franchises
  { title: "Travel", icon: IconPlane },           // #10 — booking, reservations, pricing
  { title: "Real Estate", icon: IconBuildingSkyscraper }, // #11 — listings, CRM, transactions
  { title: "Media", icon: IconDeviceTv },        // #12 — analytics, subscriptions, ads
]

export const DATABASE_SIZE = [
  { title: "Small", icon: IconCircle },
  { title: "Medium", icon: IconCircleHalf },
  { title: "Large", icon: IconCircleFilled },
]

export const CHALLENGE_LEVEL = [
  { title: "Beginner", color: "text-gray-400 dark:text-gray-300", icon: IconLeaf },
  { title: "Easy", color: "text-green-400 dark:text-green-300", icon: IconMoodSmile },
  { title: "Medium", color: "text-yellow-400 dark:text-yellow-300", icon: IconBolt },
  { title: "Hard", color: "text-red-400 dark:text-red-300", icon: IconFlame },
  { title: "Hell", color: "text-violet-400 dark:text-violet-300", icon: IconSkull },
]
