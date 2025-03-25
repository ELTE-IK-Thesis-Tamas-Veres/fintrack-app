import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useUser } from "@auth0/nextjs-auth0";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Image from "next/image";

const navItems = [{ label: "Home", href: "/" }];

const authNavItems = [
  { label: "Categories", href: "/categories" },
  { label: "Records", href: "/records" },
  { label: "Statistics", href: "/statistics" },
  //{ label: "TOKEN", href: "/token" },
  { label: "Import", href: "/import" },
];

const Navbar = () => {
  const { user } = useUser();
  const pathname = usePathname();
  const { theme } = useTheme();

  const isActive = (path: string) =>
    pathname === path ? "text-primary font-medium" : "";

  return (
    <nav
      aria-label="Main Navigation"
      className="sticky top-0 z-10 container bg-card py-3 px-4 flex items-center justify-between gap-6 rounded-2xl mt-2 mb-3"
    >
      <div className="flex items-center gap-4">
        {/* Brand / Logo */}
        {theme === "dark" ? (
          <Image
            src="/images/logo-darkmode-cropped.png"
            alt="FinTrack Logo"
            width={40}
            height={40}
          />
        ) : (
          <Image
            src="/images/logo-lightmode-cropped.png"
            alt="FinTrack Logo"
            width={40}
            height={40}
          />
        )}
        <Link className="text-xl font-bold" href="/">
          FinTrack
        </Link>
        <ul className="hidden md:flex items-center gap-10 text-card-foreground ml-5">
          {navItems.map((item) => (
            <li key={item.href} className={isActive(item.href)}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
          {user &&
            authNavItems.map((item) => (
              <li key={item.href} className={isActive(item.href)}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
        </ul>
      </div>

      <div className="flex items-center gap-2">
        {!user ? (
          <>
            <Button
              asChild
              variant="secondary"
              className="hidden md:block ms-2 px-2"
            >
              <Link href="/auth/login">Login</Link>
            </Button>
          </>
        ) : (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  {user.picture && user.name ? (
                    <AvatarImage
                      src={user.picture}
                      alt={user.name}
                      width={50}
                      height={50}
                    />
                  ) : (
                    <AvatarFallback>CN</AvatarFallback>
                  )}
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/auth/logout">Log out</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}

        {/* Mobile Navigation */}
        <div className="flex md:hidden mr-2 items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {navItems.map((item) => (
                <DropdownMenuItem asChild key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
              {user &&
                authNavItems.map((item) => (
                  <DropdownMenuItem asChild key={item.href}>
                    <Link href={item.href}>{item.label}</Link>
                  </DropdownMenuItem>
                ))}
              {!user && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/login">Login</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <ModeToggle />
      </div>
    </nav>
  );
};

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="ms-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Sun
              className={`h-[1.2rem] w-[1.2rem] transition-all ${
                theme === "light" ? "rotate-0 scale-100" : "rotate-90 scale-0"
              }`}
            />
            <Moon
              className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
                theme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"
              }`}
            />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default Navbar;
