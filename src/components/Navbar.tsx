import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useUser } from "@auth0/nextjs-auth0";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const Navbar = () => {
  const { user } = useUser();

  console.log("user: ", user);

  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path ? "text-primary font-medium" : "";

  return (
    <div className="container bg-card py-3 px-4 flex items-center justify-between gap-6 rounded-2xl mt-2 mb-3">
      <ul className="hidden md:flex items-center gap-10 text-card-foreground">
        <li className={isActive("/")}>
          <Link href="/">Home</Link>
        </li>
        <li className={isActive("/categories")}>
          <Link href="/categories">Categories</Link>
        </li>
        <li>
          <a href="#pricing">Pricing</a>
        </li>
        <li>
          <a href="#faqs">FAQs</a>
        </li>
        <li>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span className="cursor-pointer">Pages</span>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              {landings.map((page) => (
                <DropdownMenuItem key={page.id}>
                  <Link href={page.route}>{page.title}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
      </ul>

      <div className="flex items-center">
        {!user ? (
          <>
            <Button
              asChild
              variant="secondary"
              className="hidden md:block ms-2 px-2"
            >
              <a href="/auth/login?returnTo=http://localhost:3000">Login</a>
            </Button>
            <Button className="hidden md:block ml-2 mr-2">Get Started</Button>
          </>
        ) : (
          <>
            <Avatar>
              {user.picture && user.name && (
                <AvatarImage
                  src={user.picture}
                  alt={user.name}
                  width={50}
                  height={50}
                />
              )}
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Button
              asChild
              variant="secondary"
              className="hidden md:block ms-2 px-2"
            >
              <a href="/auth/logout">Log out</a>
            </Button>
          </>
        )}

        <div className="flex md:hidden mr-2 items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <span className="py-2 px-2 ms-2 rounded-md dark:bg-gray-400">
                Pages
              </span>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              {landings.map((page) => (
                <DropdownMenuItem key={page.id}>
                  <Link href={page.route}>{page.title}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5 rotate-0 scale-100" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <a href="#home">Home</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="#features">Features</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="#pricing">Pricing</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="#faqs">FAQs</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button asChild variant="secondary" className="w-full text-sm">
                  <a href="/auth/login">Login</a>
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button className="w-full text-sm">Get Started</Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <ModeToggle />
      </div>
    </div>
  );
};

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <div className="ms-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
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

const landings = [
  {
    id: nanoid(),
    title: "Landing 01",
    route: "/project-management",
  },
  {
    id: nanoid(),
    title: "Landing 02",
    route: "/crm-landing",
  },
  {
    id: nanoid(),
    title: "Landing 03",
    route: "/ai-content-landing",
  },
  {
    id: nanoid(),
    title: "Landing 04",
    route: "/new-intro-landing",
  },
  {
    id: nanoid(),
    title: "Landing 05",
    route: "/about-us-landing",
  },
  {
    id: nanoid(),
    title: "Landing 06",
    route: "/contact-us-landing",
  },
  {
    id: nanoid(),
    title: "Landing 07",
    route: "/faqs-landing",
  },
  {
    id: nanoid(),
    title: "Landing 08",
    route: "/pricing-landing",
  },
  {
    id: nanoid(),
    title: "Landing 09",
    route: "/career-landing",
  },
];

export default Navbar;
