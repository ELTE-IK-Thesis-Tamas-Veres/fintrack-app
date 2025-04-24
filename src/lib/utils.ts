import { SankeyData } from "@/types/DTO/Sankey";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateMaxNodesAtSameDistance(data: SankeyData): number {
  const nodeCount = data.nodes.length;

  const incomingCount: number[] = Array(nodeCount).fill(0);
  data.links.forEach((link) => {
    incomingCount[link.target]++;
  });

  const levels: number[] = Array(nodeCount).fill(0);

  const queue: number[] = [];
  for (let i = 0; i < nodeCount; i++) {
    if (incomingCount[i] === 0) {
      queue.push(i);
      levels[i] = 0;
    }
  }

  const childrenMap: Map<number, number[]> = new Map();
  for (let i = 0; i < nodeCount; i++) {
    childrenMap.set(i, []);
  }
  data.links.forEach((link) => {
    childrenMap.get(link.source)?.push(link.target);
  });

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentLevel = levels[current];

    const children = childrenMap.get(current) || [];
    for (const child of children) {
      levels[child] = Math.max(levels[child], currentLevel + 1);

      incomingCount[child]--;
      if (incomingCount[child] === 0) {
        queue.push(child);
      }
    }
  }

  const levelCounts: Map<number, number> = new Map();
  for (const level of levels) {
    levelCounts.set(level, (levelCounts.get(level) || 0) + 1);
  }

  let maxNodes = 0;
  levelCounts.forEach((count) => {
    if (count > maxNodes) {
      maxNodes = count;
    }
  });

  return maxNodes;
}

export interface FetchState<T> {
  isLoading: boolean;
  response: T | undefined;
  error: unknown;
}

export const fetchAndHandle = async <T>(
  url: string,
  setState: React.Dispatch<React.SetStateAction<FetchState<T>>>,
  fallbackResponse: T | undefined
): Promise<void> => {
  setState((prev) => ({ ...prev, isLoading: true }));

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      setState((prev) => ({
        ...prev,
        response: fallbackResponse,
        error: data.error,
      }));

      toast("Error fetching data", {
        description: data.error,
      });
    } else {
      setState((prev) => ({
        ...prev,
        response: data,
        error: undefined,
      }));
    }
  } catch (error) {
    setState((prev) => ({
      ...prev,
      response: fallbackResponse,
      error: error,
    }));

    toast("Error fetching data", {
      description: "Something went wrong",
    });
  } finally {
    setState((prev) => ({ ...prev, isLoading: false }));
  }
};

export const getFormattedDate = (date: Date): string => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  const formattedDate = localDate.toISOString().split("T")[0];

  return formattedDate;
};
