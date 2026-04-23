import { IconDashboard, IconDatabase, IconShare, IconSword, IconTreadmill } from "@tabler/icons-react";

export const navData = {
  workspace: [
    {
      title: "Dashboard",
      url: "#dashboard",
      icon: IconDashboard
    },
    {
      title: "Databases",
      url: "#databases",
      icon: IconDatabase
    },
    {
      title: "Challenges",
      url: "#challenges",
      icon: IconTreadmill
    },
  ],
  community: [
    {
      title: "Leaderboard",
      url: "#leaderboard",
      icon: IconSword,
    },
    {
      title: "Community Challenges",
      url: "#community-challenges",
      icon: IconShare,
    }
  ]
}
