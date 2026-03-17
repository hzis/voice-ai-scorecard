import { UserButton } from "@clerk/nextjs";
import { siteConfig } from "@/config/site";

export function DashboardHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <h2 className="text-lg font-semibold md:hidden">{siteConfig.name}</h2>
      <div className="ml-auto">
        <UserButton />
      </div>
    </header>
  );
}
