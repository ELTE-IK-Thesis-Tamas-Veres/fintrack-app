import { SankeyData } from "@/types/DTO/Sankey";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateMaxNodesAtSameDistance(data: SankeyData): number {
  const nodeCount = data.nodes.length;

  // Compute the number of incoming links for each node.
  const incomingCount: number[] = Array(nodeCount).fill(0);
  data.links.forEach((link) => {
    incomingCount[link.target]++;
  });

  // Initialize levels for each node.
  const levels: number[] = Array(nodeCount).fill(0);

  // Prepare a queue for nodes with no incoming links (source nodes).
  const queue: number[] = [];
  for (let i = 0; i < nodeCount; i++) {
    if (incomingCount[i] === 0) {
      queue.push(i);
      levels[i] = 0; // Source nodes start at level 0.
    }
  }

  // Build an adjacency list for children.
  const childrenMap: Map<number, number[]> = new Map();
  for (let i = 0; i < nodeCount; i++) {
    childrenMap.set(i, []);
  }
  data.links.forEach((link) => {
    childrenMap.get(link.source)?.push(link.target);
  });

  // We'll use a modified topological sort.
  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentLevel = levels[current];

    // Process all children of the current node.
    const children = childrenMap.get(current) || [];
    for (const child of children) {
      // The child's level is at least parent's level + 1.
      levels[child] = Math.max(levels[child], currentLevel + 1);

      // Decrease the incoming count for the child.
      incomingCount[child]--;
      if (incomingCount[child] === 0) {
        queue.push(child);
      }
    }
  }

  // Count how many nodes are in each level.
  const levelCounts: Map<number, number> = new Map();
  for (const level of levels) {
    levelCounts.set(level, (levelCounts.get(level) || 0) + 1);
  }

  // Find the maximum count among all levels.
  let maxNodes = 0;
  levelCounts.forEach((count) => {
    if (count > maxNodes) {
      maxNodes = count;
    }
  });

  return maxNodes;
}
