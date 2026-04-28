import { IconBolt, IconBrandShopee, IconBuildingBank, IconBuildingFactory, IconBuildingSkyscraper, IconChartBar, IconCircle, IconCircleFilled, IconCircleHalf, IconCoin, IconCrown, IconDashboard, IconDatabase, IconDeviceLaptop, IconDeviceTv, IconDiamond, IconDots, IconFlame, IconHeartbeat, IconInfinity, IconLeaf, IconMedal, IconMedal2, IconMoodSmile, IconPlane, IconSchool, IconSend2, IconShare, IconShieldFilled, IconShoppingCart, IconSkull, IconSparkles2, IconSword, IconSwords, IconToolsKitchen2, IconTreadmill, IconTrophy, IconTruck, IconUserCircle, IconUsers } from "@tabler/icons-react"
import type { Icon } from "@tabler/icons-react"
import type { Tier, UserPlan } from "./types"

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
  { title: "Beginner", color: "text-gray-400 dark:text-gray-300", barColor: "bg-emerald-500", icon: IconLeaf },
  { title: "Easy", color: "text-green-400 dark:text-green-300", barColor: "bg-green-400", icon: IconMoodSmile },
  { title: "Medium", color: "text-yellow-400 dark:text-yellow-300", barColor: "bg-yellow-400", icon: IconBolt },
  { title: "Hard", color: "text-red-400 dark:text-red-300", barColor: "bg-orange-500", icon: IconFlame },
  { title: "Hell", color: "text-violet-400 dark:text-violet-300", barColor: "bg-red-600", icon: IconSkull },
]

export const TIER_CONFIG: Record<Tier, { icon: Icon; color: string; barColor: string }> = {
  Bronze: { icon: IconMedal, color: "text-amber-700", barColor: "bg-amber-700" },
  Silver: { icon: IconMedal2, color: "text-slate-400", barColor: "bg-slate-400" },
  Gold: { icon: IconTrophy, color: "text-yellow-400", barColor: "bg-yellow-400" },
  Platinum: { icon: IconShieldFilled, color: "text-cyan-400", barColor: "bg-cyan-400" },
  Diamond: { icon: IconDiamond, color: "text-blue-400", barColor: "bg-blue-400" },
  Master: { icon: IconCrown, color: "text-purple-500", barColor: "bg-purple-500" },
  Challenger: { icon: IconSwords, color: "text-red-500", barColor: "bg-red-500" },
}

export const PLANS = [
  {
    title: "Free",
    tagline: "Try the platform",
    price: 0,
    icon: IconBolt,
    features: [
      { label: "Databases", value: "2 / month" },
      { label: "Challenges", value: "10 / month" },
      { label: "Hints", value: "30 / month" },
    ],
  },
  {
    title: "Pro",
    tagline: "For serious learners",
    price: 9,
    icon: IconFlame,
    features: [
      { label: "Databases", value: "10 / month" },
      { label: "Challenges", value: "30 / month" },
      { label: "Hints", value: "90 / month" },
    ],
  },
  {
    title: "Max",
    tagline: "No limits, full power",
    price: 29,
    icon: IconInfinity,
    features: [
      { label: "Databases", value: "Unlimited" },
      { label: "Challenges", value: "Unlimited" },
      { label: "Hints", value: "Unlimited" },
    ],
  },
] as const
