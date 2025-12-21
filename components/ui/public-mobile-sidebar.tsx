"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import ku from "@/public/ku.png";
import { authClient } from "@/lib/auth-client";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useSignout } from "@/hooks/use-signout";
import {
  IconHome,
  IconListDetails,
  IconDashboard,
  IconLogout,
} from "@tabler/icons-react";

const navItems = [
  { name: "Home", href: "/", icon: IconHome },
  { name: "Courses", href: "/courses", icon: IconListDetails },
  { name: "Dashboard", href: "/dashboard", icon: IconDashboard },
];

export function PublicMobileSidebar() {
  const [open, setOpen] = React.useState(false);
  const { data: session, isPending } = authClient.useSession();
  const pathname = usePathname();
  const handleSignOut = useSignout();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[280px] p-0 bg-sidebar"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
          <SheetDescription>
            Navigate through the application
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center gap-2 px-4 py-4 border-b">
            <Image src={ku} alt="CREATE" width={40} height={40} />  
            <span className="text-base font-semibold">CREATE LMS.</span>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto py-4">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    onClick={() => setOpen(false)}
                    className={cn(
                      pathname === item.href &&
                        "bg-accent text-accent-foreground"
                    )}
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon
                        className={cn(
                          "size-5",
                          pathname === item.href && "text-primary"
                        )}
                      />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </div>

          {/* User Section */}
          {!isPending && (
            <div className="border-t p-4">
              {session ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                      <AvatarImage
                        src={
                          session?.user.image ??
                          `https://avatar.vercel.sh/${session?.user.email}`
                        }
                        alt={session?.user.name}
                      />
                      <AvatarFallback>
                        {session?.user.name && session.user.name.length > 0
                          ? session.user.name.charAt(0).toUpperCase()
                          : session?.user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {session?.user.name && session.user.name.length > 0
                          ? session.user.name
                          : session?.user.email.split("@")[0]}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {session?.user.email}
                      </p>
                    </div>
                  </div>
                  <Separator />
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      handleSignOut();
                      setOpen(false);
                    }}
                  >
                    <IconLogout className="size-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="block"
                  >
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="block"
                  >
                    <Button variant="default" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}