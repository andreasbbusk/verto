"use client";

import { Edit, Play } from "lucide-react";
import { Button } from "@/modules/components/ui/button";
import { Card, CardFooter } from "@/modules/components/ui/card";

const sets = [
  {
    title: "Cognitive Psychology Essentials",
    description: "Retrieval practice, spacing effect, encoding specificity.",
    cards: 28,
    reviews: 6,
    created: "Jan 12",
  },
  {
    title: "Neuroscience Foundations",
    description: "Neurons, synapses, and brain systems for learning.",
    cards: 34,
    reviews: 4,
    created: "Jan 28",
  },
];

export function OrganizationGridDemo() {
  return (
    <div className="w-full max-w-[560px] mx-auto">
      <div className="grid grid-cols-1 gap-4">
        {sets.map((set) => (
          <Card
            key={set.title}
            className="group max-w-lg overflow-hidden p-0 gap-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#111111]"
          >
            <div className="flex min-h-[140px]">
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
                    <span className="ml-1">cards</span>
                  </div>
                  <div>
                    <span className="text-foreground">{set.reviews}</span>
                    <span className="ml-1">reviews</span>
                  </div>
                  <div>Created {set.created}</div>
                </div>
              </div>
            </div>
            <CardFooter className="border-t border-foreground/10 pt-4 pb-4">
              <div className="flex w-full flex-col sm:flex-row gap-3 sm:items-center">
                <Button className="w-full sm:w-36" size="sm">
                  <Play className="h-3 w-3 mr-2" />
                  Study
                </Button>
                <Button variant="outline" size="sm" className="w-full sm:w-12">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
