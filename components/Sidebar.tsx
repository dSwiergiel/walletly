"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Footer from "./Footer";

const Sidebar = ({ user }: { user: SidebarProps }) => {
  const pathname = usePathname();
  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-4">
        <Link href="/" className="flex mb-12 cursor-pointer items-center gap-2">
          <Image
            src="/icons/logo.svg"
            alt="Walletly logo"
            width={34}
            height={34}
            className="size-[24px] max-xl:size-14"
          />
          <h1 className="sidebar-logo">Walletly</h1>
        </Link>
        {sidebarLinks.map((link) => {
          const isActive =
            pathname === link.route || pathname.startsWith(`${link.route}/`);
          return (
            <Link
              key={link.label}
              href={link.route}
              className={cn("sidebar-link", {
                "bg-bank-gradient": isActive,
              })}
            >
              <div className="relative size-6">
                <Image
                  src={link.imgURL}
                  alt={link.label}
                  fill
                  className={cn({ "brightness-[3] invert-0": isActive })}
                />
              </div>
              <p
                className={cn("sidebar-label", {
                  "!text-white": isActive,
                })}
              >
                {link.label}
              </p>
            </Link>
          );
        })}
        USER
      </nav>
      <Footer user={user} type="desktop" />
    </section>
  );
};

export default Sidebar;
