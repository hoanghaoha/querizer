import { IconBolt, IconBrandShopee, IconBuildingBank, IconBuildingFactory, IconBuildingSkyscraper, IconChartBar, IconCircle, IconCircleFilled, IconCircleHalf, IconCoin, IconDashboard, IconDatabase, IconDeviceLaptop, IconDeviceTv, IconDots, IconFlame, IconHeartbeat, IconLeaf, IconMoodSmile, IconPlane, IconSchool, IconSend2, IconShare, IconShoppingCart, IconSkull, IconSparkles2, IconSword, IconToolsKitchen2, IconTreadmill, IconTruck, IconUserCircle, IconUsers } from "@tabler/icons-react";

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
  ],
  user: [
    {
      title: "Account",
      url: "/account",
      icon: IconUserCircle,
    },
    {
      title: "Upgrade Plan",
      url: "/plan",
      icon: IconSparkles2,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: IconSend2,
    },
  ]

}

export const DATABASE_INDUSTRY = [
  { title: "Technology", icon: IconDeviceLaptop },
  { title: "Finance", icon: IconCoin },
  { title: "Retail", icon: IconShoppingCart },
  { title: "E-commerce", icon: IconBrandShopee },
  { title: "Healthcare", icon: IconHeartbeat },
  { title: "Manufacturing", icon: IconBuildingFactory },
  { title: "Logistics", icon: IconTruck },
  { title: "Education", icon: IconSchool },
  { title: "Food & Beverage", icon: IconToolsKitchen2 },
  { title: "Real Estate", icon: IconBuildingSkyscraper },
  { title: "Media & Entertainment", icon: IconDeviceTv },
  { title: "Market Research", icon: IconChartBar },
  { title: "HR / Workforce", icon: IconUsers },
  { title: "Other", icon: IconDots },
] as const


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
