"use client";

import { Edit, Play } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/modules/components/ui/button";
import { Card, CardFooter } from "@/modules/components/ui/card";
import { marketingCopy } from "@/modules/components/marketing/content";
import { useState } from "react";

const stackLayouts = [
  {
    x: -48,
    y: 52,
    z: 120,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    skewY: 0,
    scale: 1,
    shadow: "0 30px 70px rgba(8, 8, 8, 0.18), 0 12px 24px rgba(8, 8, 8, 0.12)",
    zIndex: 30,
  },
  {
    x: 0,
    y: 0,
    z: 60,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    skewY: 0,
    scale: 1,
    shadow: "0 22px 54px rgba(8, 8, 8, 0.14)",
    zIndex: 20,
  },
  {
    x: 48,
    y: -52,
    z: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    skewY: 0,
    scale: 1,
    shadow: "0 16px 40px rgba(8, 8, 8, 0.12)",
    zIndex: 10,
  },
];

export function OrganizationGridDemo() {
  const { organization } = marketingCopy.demos;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="w-full max-w-[560px] mx-auto">
      <motion.div
        className="relative h-[360px] sm:h-[400px] lg:h-[440px] perspective-[1400px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
      >
        <div className="absolute inset-0 transform-3d">
          {organization.sets.map((set, index) => {
            const layout = stackLayouts[index] ?? stackLayouts[0];
            const hoverSpread = isHovered ? 0.45 : 0;
            const hoverX =
              isHovered && layout.x !== 0
                ? Math.sign(layout.x) * 18
                : 0;
            const hoverY =
              isHovered && layout.y !== 0
                ? Math.sign(layout.y) * 18
                : 0;
            const hoverZ = isHovered
              ? (organization.sets.length - index) * 10
              : 0;
            const hoverRotateZ = isHovered ? -layout.rotateZ : 0;

            return (
              <Card
                key={set.title}
                className="absolute left-1/2 top-1/2 w-[92%] sm:w-[90%] max-w-lg overflow-hidden p-0 gap-0 rounded-[26px] border-2 border-foreground/70 bg-card transition-transform duration-300"
                style={{
                  transform: `translate(-50%, -50%) translate3d(${layout.x + layout.x * hoverSpread + hoverX}px, ${layout.y + layout.y * hoverSpread + hoverY}px, ${layout.z + hoverZ}px) rotateX(${layout.rotateX}deg) rotateY(${layout.rotateY}deg) rotateZ(${layout.rotateZ + hoverRotateZ}deg) skewY(${layout.skewY}deg) scale(${layout.scale})`,
                  boxShadow: layout.shadow,
                  zIndex: layout.zIndex,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                }}
              >
                <div className="relative flex min-h-[140px]">
                  <div className="w-1.5 bg-primary" />
                  <div className="flex-1 px-5 py-5">
                    <h3 className="font-mono text-base font-bold text-foreground line-clamp-2">
                      {set.title}
                    </h3>
                    <div className="mt-2 min-h-[36px]">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {set.description}
                      </p>
                    </div>
                    <div className="mt-3 space-y-1 text-xs font-mono text-muted-foreground">
                      <div>
                        <span className="text-foreground">{set.cards}</span>
                        <span className="ml-1">{organization.labels.cards}</span>
                      </div>
                      <div>
                        <span className="text-foreground">{set.reviews}</span>
                        <span className="ml-1">{organization.labels.reviews}</span>
                      </div>
                      <div>
                        {organization.labels.created} {set.created}
                      </div>
                    </div>
                  </div>
                </div>
                <CardFooter className="border-t border-foreground/10 pt-4 pb-4">
                  <div className="flex w-full flex-col sm:flex-row gap-3 sm:items-center">
                    <Button className="w-full sm:w-36" size="sm">
                      <Play className="h-3 w-3 mr-2" />
                      {organization.buttons.study}
                    </Button>
                    <Button variant="outline" size="sm" className="w-full sm:w-12">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
