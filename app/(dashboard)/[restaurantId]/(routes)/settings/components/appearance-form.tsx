"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface AppearanceFormProps {
  restaurantId: string;
}

export default function AppearancePage({ restaurantId }: AppearanceFormProps) {
  const [loading, setLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<string | undefined>(theme);
  const router = useRouter();

  useEffect(() => {
    setSelectedTheme(theme);
  }, [theme]);

  const handleThemeChange = (newTheme: string) => {
    setSelectedTheme(newTheme);
    setTheme(newTheme);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      toast.success("Theme updated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update theme");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div>
        <Heading
          title="Appearance"
          description="Customize the appearance of the app. Automatically switch between day and night themes."
        />
      </div>
      <Separator />
      <div className="flex items-center gap-4 flex-1 max-[640px]:flex-col">
        <div
          className={cn(
            "w-[250px] max-[464px]:w-full items-center rounded-md border-2 p-1 hover:bg-accent hover:text-accent-foreground cursor-pointer",
            selectedTheme === "light" ? "border-primary" : "border-muted"
          )}
          onClick={() => handleThemeChange("light")}
        >
          <div className="space-y-2 rounded-sm bg-[#ecedef] p-2">
            <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
              <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]"></div>
              <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]"></div>
            </div>
            <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
              <div className="h-4 w-4 rounded-full bg-[#ecedef]"></div>
              <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]"></div>
            </div>
            <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
              <div className="h-4 w-4 rounded-full bg-[#ecedef]"></div>
              <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]"></div>
            </div>
          </div>
        </div>
        <div
          className={cn(
            "w-[250px] max-[464px]:w-full items-center rounded-md border-2 bg-popover p-1 hover:bg-accent hover:text-accent-foreground cursor-pointer",
            selectedTheme === "dark" ? "border-primary" : "border-muted"
          )}
          onClick={() => handleThemeChange("dark")}
        >
          <div className="space-y-2 rounded-sm bg-slate-950 p-2">
            <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
              <div className="h-2 w-[80px] rounded-lg bg-slate-400"></div>
              <div className="h-2 w-[100px] rounded-lg bg-slate-400"></div>
            </div>
            <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
              <div className="h-4 w-4 rounded-full bg-slate-400"></div>
              <div className="h-2 w-[100px] rounded-lg bg-slate-400"></div>
            </div>
            <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
              <div className="h-4 w-4 rounded-full bg-slate-400"></div>
              <div className="h-2 w-[100px] rounded-lg bg-slate-400"></div>
            </div>
          </div>
        </div>
        <div
          className={cn(
            "w-[250px] max-[464px]:w-full items-center rounded-md border-2 p-1 hover:bg-accent hover:text-accent-foreground cursor-pointer overflow-hidden",
            selectedTheme === "system" ? "border-primary" : "border-muted"
          )}
          onClick={() => handleThemeChange("system")}
        >
          <div className="relative space-y-2 rounded-sm p-2">
            <div
              className="absolute inset-0 bg-[#ecedef]"
              style={{
                clipPath: "polygon(0 0, 100% 0, 0 100%)",
              }}
            ></div>
            <div
              className="absolute inset-0 bg-slate-950"
              style={{
                clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
              }}
            ></div>
            <div className="relative space-y-2 rounded-md bg-white dark:bg-slate-800 p-2 shadow-sm">
              <div className="h-2 w-[80px] rounded-lg bg-[#ecedef] dark:bg-slate-400"></div>
              <div className="h-2 w-[100px] rounded-lg bg-[#ecedef] dark:bg-slate-400"></div>
            </div>
            <div className="relative flex items-center space-x-2 rounded-md bg-white dark:bg-slate-800 p-2 shadow-sm">
              <div className="h-4 w-4 rounded-full bg-[#ecedef] dark:bg-slate-400"></div>
              <div className="h-2 w-[100px] rounded-lg bg-[#ecedef] dark:bg-slate-400"></div>
            </div>
            <div className="relative flex items-center space-x-2 rounded-md bg-white dark:bg-slate-800 p-2 shadow-sm">
              <div className="h-4 w-4 rounded-full bg-[#ecedef] dark:bg-slate-400"></div>
              <div className="h-2 w-[100px] rounded-lg bg-[#ecedef] dark:bg-slate-400"></div>
            </div>
          </div>
        </div>
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
