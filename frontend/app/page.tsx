import { Button } from "@/components/ui/button";
import { BarCharts } from "./_charts/BarCharts";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black w-full px-4">
      <div className="w-full">
        <Link href="/dashboard" className="flex items-center justify-center">
         <Button>Dashboard</Button>
        </Link>
      </div>
   </div>
  );
}
