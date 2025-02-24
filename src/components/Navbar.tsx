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

const navItems = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "/categories" },
  { label: "Records", href: "/records" },
  { label: "FAQs", href: "#faqs" },
  { label: "TOKEN", href: "/token" },
];

const Navbar = () => {
  const { user } = useUser();
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path ? "text-primary font-medium" : "";

  return (
    <nav
      aria-label="Main Navigation"
      className="sticky top-0 z-10 container bg-card py-3 px-4 flex items-center justify-between gap-6 rounded-2xl mt-2 mb-3"
    >
      <div className="flex items-center gap-4">
        {/* Brand / Logo */}
        <Link className="text-xl font-bold" href="/">
          FinTrack
        </Link>
        <ul className="hidden md:flex items-center gap-10 text-card-foreground">
          {navItems.map((item) => (
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
            <Button className="hidden md:block ml-2 mr-2">Get Started</Button>
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
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
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
              {!user && (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/login">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Button className="w-full text-sm">Get Started</Button>
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
          <DropdownMenuItem asChild onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem asChild onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem asChild onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default Navbar;
