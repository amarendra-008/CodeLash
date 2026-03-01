/* ═══════════════════════════════════════════════════
   LIB / TOPICS
   Exact LeetCode topic taxonomy used by the Create
   Room config form. Kept as a plain string array so
   it tree-shakes cleanly and requires no imports.
   ═══════════════════════════════════════════════════ */

// Primary export used by new create-room components
export const TOPICS: string[] = [
  'Array',
  'String',
  'Hash Table',
  'Dynamic Programming',
  'Math',
  'Sorting',
  'Greedy',
  'Depth-First Search',
  'Binary Search',
  'Database',
  'Tree',
  'Matrix',
  'Graph',
  'Heap (Priority Queue)',
  'Linked List',
  'Binary Tree',
  'Stack',
  'Prefix Sum',
  'Sliding Window',
  'Union Find',
  'Trie',
  'Design',
  'Backtracking',
  'Two Pointers',
  'Bit Manipulation',
  'Topological Sort',
  'Breadth-First Search',
  'Game Theory',
  'Segment Tree',
  'Binary Indexed Tree',
  'Memoization',
  'Concurrency',
  'Brainteaser',
]

// Backward-compat aliases for older components (TopicMultiSelect, RoomForm)
export const LEETCODE_TOPICS = TOPICS
export type Topic = string
