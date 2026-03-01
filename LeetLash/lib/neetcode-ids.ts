/* ═══════════════════════════════════════════════════
   LIB / NEETCODE-IDS
   The canonical NeetCode 150 — problem IDs grouped
   by category, in NeetCode's original order.
   ═══════════════════════════════════════════════════ */

export type NeetCodeCategory =
  | 'Arrays & Hashing'
  | 'Two Pointers'
  | 'Sliding Window'
  | 'Stack'
  | 'Binary Search'
  | 'Linked List'
  | 'Trees'
  | 'Tries'
  | 'Heap / Priority Queue'
  | 'Backtracking'
  | 'Graphs'
  | 'Advanced Graphs'
  | 'Dynamic Programming 1D'
  | 'Dynamic Programming 2D'
  | 'Greedy'
  | 'Intervals'
  | 'Math & Geometry'
  | 'Bit Manipulation'

export const NEETCODE_CATEGORIES: NeetCodeCategory[] = [
  'Arrays & Hashing',
  'Two Pointers',
  'Sliding Window',
  'Stack',
  'Binary Search',
  'Linked List',
  'Trees',
  'Tries',
  'Heap / Priority Queue',
  'Backtracking',
  'Graphs',
  'Advanced Graphs',
  'Dynamic Programming 1D',
  'Dynamic Programming 2D',
  'Greedy',
  'Intervals',
  'Math & Geometry',
  'Bit Manipulation',
]

/** Maps NeetCode category → ordered LeetCode problem IDs */
export const NEETCODE_BY_CATEGORY: Record<NeetCodeCategory, number[]> = {
  'Arrays & Hashing':        [217, 242, 1, 49, 347, 238, 36, 271, 128],
  'Two Pointers':            [125, 167, 15, 11, 42],
  'Sliding Window':          [121, 3, 424, 567, 76, 239],
  'Stack':                   [20, 155, 150, 22, 739, 853, 84],
  'Binary Search':           [704, 74, 875, 153, 33, 981, 4],
  'Linked List':             [206, 21, 143, 19, 138, 2, 141, 287, 146, 23, 25],
  'Trees':                   [226, 104, 543, 110, 100, 572, 235, 102, 199, 1448, 98, 230, 105, 124, 297],
  'Tries':                   [208, 211, 212],
  'Heap / Priority Queue':   [703, 1046, 973, 215, 621, 355, 295],
  'Backtracking':            [78, 39, 46, 90, 40, 79, 131, 17, 51],
  'Graphs':                  [200, 133, 695, 417, 130, 994, 286, 207, 210, 684, 323, 261, 127],
  'Advanced Graphs':         [332, 1584, 743, 778, 269, 787],
  'Dynamic Programming 1D':  [70, 746, 198, 213, 5, 647, 91, 322, 152, 139, 300, 416],
  'Dynamic Programming 2D':  [62, 1143, 309, 518, 494, 97, 329, 115, 72, 312, 10],
  'Greedy':                  [53, 55, 45, 134, 846, 1899, 763, 678],
  'Intervals':               [57, 56, 435, 252, 253, 2402],
  'Math & Geometry':         [48, 54, 73, 202, 66, 50, 43, 1041],
  'Bit Manipulation':        [136, 191, 338, 190, 268, 371, 7],
}

/** Flat ordered list of all 150 NeetCode problem IDs */
export const NEETCODE_150_IDS: number[] = NEETCODE_CATEGORIES.flatMap(
  (cat) => NEETCODE_BY_CATEGORY[cat],
)

/** Set for O(1) membership test */
export const NEETCODE_150_SET = new Set(NEETCODE_150_IDS)

/** Reverse lookup: problem ID → NeetCode category */
export const ID_TO_CATEGORY: Map<number, NeetCodeCategory> = new Map(
  NEETCODE_CATEGORIES.flatMap((cat) =>
    NEETCODE_BY_CATEGORY[cat].map((id) => [id, cat] as [number, NeetCodeCategory]),
  ),
)
