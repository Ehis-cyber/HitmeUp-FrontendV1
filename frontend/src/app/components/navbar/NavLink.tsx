"use client";

import { NavbarItem } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type Props = {
  href: string;
  label: string;
  className:string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void; // Add onClick prop
};

export default function NavLink({
  href,
  label,
  className,
  onClick, 
}: Props) {
  const pathname = usePathname();

  return (
    <NavbarItem
      className={`${
        pathname === href ? "border-b-blue-500 font-bold" : "text-gray-600"
      }`}
      isActive={pathname === href}
    >
      <Link href={href} legacyBehavior>
        <a 
        onClick={onClick} 
        className={`hover:text-purple-600 transition-colors duration-300 ${className}`}>
          {label}
        </a>
      </Link>
    </NavbarItem>
  );
}
