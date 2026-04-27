"use client"

import { SigninForm } from "@/components/auth/signin-form"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex flex-col items-center w-full max-w-sm gap-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/icon.svg" alt="querizer" width={28} height={28} className="rounded-md" />
          <p className="font-semibold">querizer</p>
        </Link>
        <SigninForm />
      </div>
    </div>
  )
}
