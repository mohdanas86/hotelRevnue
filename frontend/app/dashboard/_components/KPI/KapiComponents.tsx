import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

interface KpiCardProps {
  title: string;
  value: string;
  change?: string;
  footerTitle?: string;
  footerSubtitle?: string;
  icon?: ReactNode;
}

export function KpiCard({
  title,
  value,
  change,
  footerTitle,
  footerSubtitle,
  icon,
}: KpiCardProps) {
  return (
    <Card className="@container/card">
      <CardHeader>

        <CardDescription>{title}</CardDescription>

        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>

        {change && (
          <CardAction>
            <Badge variant="outline">
              {icon}
              {change}
            </Badge>
          </CardAction>
        )}

      </CardHeader>

      <CardFooter className="flex-col items-start gap-1.5 text-sm">

        {footerTitle && (
          <div className="flex gap-2 font-medium">
            {footerTitle}
          </div>
        )}

        {footerSubtitle && (
          <div className="text-muted-foreground">
            {footerSubtitle}
          </div>
        )}

      </CardFooter>

    </Card>
  );
}
