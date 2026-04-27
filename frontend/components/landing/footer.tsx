import { IconBrandGithub, IconBrandLinkedin, IconWorld } from "@tabler/icons-react"
import Image from "next/image"
import Link from "next/link"

const SOCIALS = [
  { label: "hhhao.dev", href: "https://hhhao.dev", icon: IconWorld },
  { label: "GitHub", href: "https://github.com/hoanghaoha", icon: IconBrandGithub },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/hoanghaoha", icon: IconBrandLinkedin },
]

const Footer = () => {
  return (
    <footer className="border-t border-border">
      <div className="max-w-5xl mx-auto px-6 py-16 flex flex-col gap-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/icon.svg" alt="querizer" width={24} height={24} className="rounded-md" />
              <p className="font-semibold text-base">querizer</p>
            </Link>
            <p className="text-sm text-muted-foreground">Learn SQL. Actually enjoy it.</p>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Product</p>
            <Link href="#features" className="text-sm hover:text-foreground text-muted-foreground transition-colors">Features</Link>
            <Link href="#pricing" className="text-sm hover:text-foreground text-muted-foreground transition-colors">Pricing</Link>
            <Link href="/signin" className="text-sm hover:text-foreground text-muted-foreground transition-colors">Sign in</Link>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Built by hhhao</p>
            {SOCIALS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm hover:text-foreground text-muted-foreground transition-colors"
              >
                <Icon className="size-4" />
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} querizer · Built with care by hhhao
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
