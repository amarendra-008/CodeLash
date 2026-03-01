/* ═══════════════════════════════════════════════════
   LIB / NEETCODE-STARTERS
   JavaScript + Python starter code for every NeetCode
   150 problem, keyed by LeetCode problem ID.
   ═══════════════════════════════════════════════════ */

const LL_JS = `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *   this.val = (val===undefined ? 0 : val)
 *   this.next = (next===undefined ? null : next)
 * }
 */`

const LL_PY = `# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next`

const TREE_JS = `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *   this.val = (val===undefined ? 0 : val)
 *   this.left = (left===undefined ? null : left)
 *   this.right = (right===undefined ? null : right)
 * }
 */`

const TREE_PY = `# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right`

type StarterPair = { javascript: string; python: string }

export const NEETCODE_STARTERS: Record<number, StarterPair> = {
  /* ── Arrays & Hashing ─────────────────────────── */

  // 217. Contains Duplicate
  217: {
    javascript: `/**
 * @param {number[]} nums
 * @return {boolean}
 */
var containsDuplicate = function(nums) {

};`,
    python: `class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        `,
  },

  // 242. Valid Anagram
  242: {
    javascript: `/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function(s, t) {

};`,
    python: `class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        `,
  },

  // 1. Two Sum (already in problems.ts — included for completeness)
  1: {
    javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {

};`,
    python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        `,
  },

  // 49. Group Anagrams
  49: {
    javascript: `/**
 * @param {string[]} strs
 * @return {string[][]}
 */
var groupAnagrams = function(strs) {

};`,
    python: `class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        `,
  },

  // 347. Top K Frequent Elements
  347: {
    javascript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var topKFrequent = function(nums, k) {

};`,
    python: `class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        `,
  },

  // 238. Product of Array Except Self
  238: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number[]}
 */
var productExceptSelf = function(nums) {

};`,
    python: `class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        `,
  },

  // 36. Valid Sudoku
  36: {
    javascript: `/**
 * @param {character[][]} board
 * @return {boolean}
 */
var isValidSudoku = function(board) {

};`,
    python: `class Solution:
    def isValidSudoku(self, board: List[List[str]]) -> bool:
        `,
  },

  // 271. Encode and Decode Strings
  271: {
    javascript: `/**
 * Encodes a list of strings to a single string.
 * @param {string[]} strs
 * @return {string}
 */
var encode = function(strs) {

};

/**
 * Decodes a single string to a list of strings.
 * @param {string} s
 * @return {string[]}
 */
var decode = function(s) {

};`,
    python: `class Codec:
    def encode(self, strs: List[str]) -> str:
        pass

    def decode(self, s: str) -> List[str]:
        pass`,
  },

  // 128. Longest Consecutive Sequence
  128: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var longestConsecutive = function(nums) {

};`,
    python: `class Solution:
    def longestConsecutive(self, nums: List[int]) -> int:
        `,
  },

  /* ── Two Pointers ─────────────────────────────── */

  // 125. Valid Palindrome
  125: {
    javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
var isPalindrome = function(s) {

};`,
    python: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        `,
  },

  // 167. Two Sum II - Input Array Is Sorted
  167: {
    javascript: `/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(numbers, target) {

};`,
    python: `class Solution:
    def twoSum(self, numbers: List[int], target: int) -> List[int]:
        `,
  },

  // 15. 3Sum
  15: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var threeSum = function(nums) {

};`,
    python: `class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        `,
  },

  // 11. Container With Most Water
  11: {
    javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
var maxArea = function(height) {

};`,
    python: `class Solution:
    def maxArea(self, height: List[int]) -> int:
        `,
  },

  // 42. Trapping Rain Water
  42: {
    javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function(height) {

};`,
    python: `class Solution:
    def trap(self, height: List[int]) -> int:
        `,
  },

  /* ── Sliding Window ───────────────────────────── */

  // 121. Best Time to Buy and Sell Stock
  121: {
    javascript: `/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {

};`,
    python: `class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        `,
  },

  // 3. Longest Substring Without Repeating Characters
  3: {
    javascript: `/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {

};`,
    python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        `,
  },

  // 424. Longest Repeating Character Replacement
  424: {
    javascript: `/**
 * @param {string} s
 * @param {number} k
 * @return {number}
 */
var characterReplacement = function(s, k) {

};`,
    python: `class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        `,
  },

  // 567. Permutation in String
  567: {
    javascript: `/**
 * @param {string} s1
 * @param {string} s2
 * @return {boolean}
 */
var checkInclusion = function(s1, s2) {

};`,
    python: `class Solution:
    def checkInclusion(self, s1: str, s2: str) -> bool:
        `,
  },

  // 76. Minimum Window Substring
  76: {
    javascript: `/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
var minWindow = function(s, t) {

};`,
    python: `class Solution:
    def minWindow(self, s: str, t: str) -> str:
        `,
  },

  // 239. Sliding Window Maximum
  239: {
    javascript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var maxSlidingWindow = function(nums, k) {

};`,
    python: `class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        `,
  },

  /* ── Stack ────────────────────────────────────── */

  // 20. Valid Parentheses
  20: {
    javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {

};`,
    python: `class Solution:
    def isValid(self, s: str) -> bool:
        `,
  },

  // 155. Min Stack
  155: {
    javascript: `var MinStack = function() {

};

/** @param {number} val */
MinStack.prototype.push = function(val) {

};

MinStack.prototype.pop = function() {

};

/** @return {number} */
MinStack.prototype.top = function() {

};

/** @return {number} */
MinStack.prototype.getMin = function() {

};`,
    python: `class MinStack:
    def __init__(self):
        pass

    def push(self, val: int) -> None:
        pass

    def pop(self) -> None:
        pass

    def top(self) -> int:
        pass

    def getMin(self) -> int:
        pass`,
  },

  // 150. Evaluate Reverse Polish Notation
  150: {
    javascript: `/**
 * @param {string[]} tokens
 * @return {number}
 */
var evalRPN = function(tokens) {

};`,
    python: `class Solution:
    def evalRPN(self, tokens: List[str]) -> int:
        `,
  },

  // 22. Generate Parentheses
  22: {
    javascript: `/**
 * @param {number} n
 * @return {string[]}
 */
var generateParenthesis = function(n) {

};`,
    python: `class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        `,
  },

  // 739. Daily Temperatures
  739: {
    javascript: `/**
 * @param {number[]} temperatures
 * @return {number[]}
 */
var dailyTemperatures = function(temperatures) {

};`,
    python: `class Solution:
    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:
        `,
  },

  // 853. Car Fleet
  853: {
    javascript: `/**
 * @param {number} target
 * @param {number[]} position
 * @param {number[]} speed
 * @return {number}
 */
var carFleet = function(target, position, speed) {

};`,
    python: `class Solution:
    def carFleet(self, target: int, position: List[int], speed: List[int]) -> int:
        `,
  },

  // 84. Largest Rectangle in Histogram
  84: {
    javascript: `/**
 * @param {number[]} heights
 * @return {number}
 */
var largestRectangleArea = function(heights) {

};`,
    python: `class Solution:
    def largestRectangleArea(self, heights: List[int]) -> int:
        `,
  },

  /* ── Binary Search ────────────────────────────── */

  // 704. Binary Search
  704: {
    javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {

};`,
    python: `class Solution:
    def search(self, nums: List[int], target: int) -> int:
        `,
  },

  // 74. Search a 2D Matrix
  74: {
    javascript: `/**
 * @param {number[][]} matrix
 * @param {number} target
 * @return {boolean}
 */
var searchMatrix = function(matrix, target) {

};`,
    python: `class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        `,
  },

  // 875. Koko Eating Bananas
  875: {
    javascript: `/**
 * @param {number[]} piles
 * @param {number} h
 * @return {number}
 */
var minEatingSpeed = function(piles, h) {

};`,
    python: `class Solution:
    def minEatingSpeed(self, piles: List[int], h: int) -> int:
        `,
  },

  // 153. Find Minimum in Rotated Sorted Array
  153: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var findMin = function(nums) {

};`,
    python: `class Solution:
    def findMin(self, nums: List[int]) -> int:
        `,
  },

  // 33. Search in Rotated Sorted Array
  33: {
    javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {

};`,
    python: `class Solution:
    def search(self, nums: List[int], target: int) -> int:
        `,
  },

  // 981. Time Based Key-Value Store
  981: {
    javascript: `var TimeMap = function() {

};

/**
 * @param {string} key
 * @param {string} value
 * @param {number} timestamp
 */
TimeMap.prototype.set = function(key, value, timestamp) {

};

/**
 * @param {string} key
 * @param {number} timestamp
 * @return {string}
 */
TimeMap.prototype.get = function(key, timestamp) {

};`,
    python: `class TimeMap:
    def __init__(self):
        pass

    def set(self, key: str, value: str, timestamp: int) -> None:
        pass

    def get(self, key: str, timestamp: int) -> str:
        pass`,
  },

  // 4. Median of Two Sorted Arrays
  4: {
    javascript: `/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function(nums1, nums2) {

};`,
    python: `class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        `,
  },

  /* ── Linked List ──────────────────────────────── */

  // 206. Reverse Linked List
  206: {
    javascript: `${LL_JS}
var reverseList = function(head) {

};`,
    python: `${LL_PY}
class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        `,
  },

  // 21. Merge Two Sorted Lists
  21: {
    javascript: `${LL_JS}
var mergeTwoLists = function(list1, list2) {

};`,
    python: `${LL_PY}
class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        `,
  },

  // 143. Reorder List
  143: {
    javascript: `${LL_JS}
var reorderList = function(head) {

};`,
    python: `${LL_PY}
class Solution:
    def reorderList(self, head: Optional[ListNode]) -> None:
        `,
  },

  // 19. Remove Nth Node From End of List
  19: {
    javascript: `${LL_JS}
var removeNthFromEnd = function(head, n) {

};`,
    python: `${LL_PY}
class Solution:
    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:
        `,
  },

  // 138. Copy List with Random Pointer
  138: {
    javascript: `/**
 * // Definition for a Node.
 * function Node(val, next, random) {
 *    this.val = val;
 *    this.next = next;
 *    this.random = random;
 * };
 */
var copyRandomList = function(head) {

};`,
    python: `class Solution:
    def copyRandomList(self, head: 'Optional[Node]') -> 'Optional[Node]':
        `,
  },

  // 2. Add Two Numbers
  2: {
    javascript: `${LL_JS}
var addTwoNumbers = function(l1, l2) {

};`,
    python: `${LL_PY}
class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        `,
  },

  // 141. Linked List Cycle
  141: {
    javascript: `${LL_JS}
var hasCycle = function(head) {

};`,
    python: `${LL_PY}
class Solution:
    def hasCycle(self, head: Optional[ListNode]) -> bool:
        `,
  },

  // 287. Find the Duplicate Number
  287: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var findDuplicate = function(nums) {

};`,
    python: `class Solution:
    def findDuplicate(self, nums: List[int]) -> int:
        `,
  },

  // 146. LRU Cache
  146: {
    javascript: `/**
 * @param {number} capacity
 */
var LRUCache = function(capacity) {

};

/**
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {

};

/**
 * @param {number} key
 * @param {number} value
 */
LRUCache.prototype.put = function(key, value) {

};`,
    python: `class LRUCache:
    def __init__(self, capacity: int):
        pass

    def get(self, key: int) -> int:
        pass

    def put(self, key: int, value: int) -> None:
        pass`,
  },

  // 23. Merge K Sorted Lists
  23: {
    javascript: `${LL_JS}
var mergeKLists = function(lists) {

};`,
    python: `${LL_PY}
class Solution:
    def mergeKLists(self, lists: List[Optional[ListNode]]) -> Optional[ListNode]:
        `,
  },

  // 25. Reverse Nodes in k-Group
  25: {
    javascript: `${LL_JS}
var reverseKGroup = function(head, k) {

};`,
    python: `${LL_PY}
class Solution:
    def reverseKGroup(self, head: Optional[ListNode], k: int) -> Optional[ListNode]:
        `,
  },

  /* ── Trees ────────────────────────────────────── */

  // 226. Invert Binary Tree
  226: {
    javascript: `${TREE_JS}
var invertTree = function(root) {

};`,
    python: `${TREE_PY}
class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        `,
  },

  // 104. Maximum Depth of Binary Tree
  104: {
    javascript: `${TREE_JS}
var maxDepth = function(root) {

};`,
    python: `${TREE_PY}
class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        `,
  },

  // 543. Diameter of Binary Tree
  543: {
    javascript: `${TREE_JS}
var diameterOfBinaryTree = function(root) {

};`,
    python: `${TREE_PY}
class Solution:
    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        `,
  },

  // 110. Balanced Binary Tree
  110: {
    javascript: `${TREE_JS}
var isBalanced = function(root) {

};`,
    python: `${TREE_PY}
class Solution:
    def isBalanced(self, root: Optional[TreeNode]) -> bool:
        `,
  },

  // 100. Same Tree
  100: {
    javascript: `${TREE_JS}
var isSameTree = function(p, q) {

};`,
    python: `${TREE_PY}
class Solution:
    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
        `,
  },

  // 572. Subtree of Another Tree
  572: {
    javascript: `${TREE_JS}
var isSubtree = function(root, subRoot) {

};`,
    python: `${TREE_PY}
class Solution:
    def isSubtree(self, root: Optional[TreeNode], subRoot: Optional[TreeNode]) -> bool:
        `,
  },

  // 235. Lowest Common Ancestor of a BST
  235: {
    javascript: `${TREE_JS}
var lowestCommonAncestor = function(root, p, q) {

};`,
    python: `${TREE_PY}
class Solution:
    def lowestCommonAncestor(self, root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
        `,
  },

  // 102. Binary Tree Level Order Traversal
  102: {
    javascript: `${TREE_JS}
var levelOrder = function(root) {

};`,
    python: `${TREE_PY}
class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        `,
  },

  // 199. Binary Tree Right Side View
  199: {
    javascript: `${TREE_JS}
var rightSideView = function(root) {

};`,
    python: `${TREE_PY}
class Solution:
    def rightSideView(self, root: Optional[TreeNode]) -> List[int]:
        `,
  },

  // 1448. Count Good Nodes in Binary Tree
  1448: {
    javascript: `${TREE_JS}
var goodNodes = function(root) {

};`,
    python: `${TREE_PY}
class Solution:
    def goodNodes(self, root: TreeNode) -> int:
        `,
  },

  // 98. Validate Binary Search Tree
  98: {
    javascript: `${TREE_JS}
var isValidBST = function(root) {

};`,
    python: `${TREE_PY}
class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        `,
  },

  // 230. Kth Smallest Element in a BST
  230: {
    javascript: `${TREE_JS}
var kthSmallest = function(root, k) {

};`,
    python: `${TREE_PY}
class Solution:
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        `,
  },

  // 105. Construct Binary Tree from Preorder and Inorder Traversal
  105: {
    javascript: `${TREE_JS}
var buildTree = function(preorder, inorder) {

};`,
    python: `${TREE_PY}
class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        `,
  },

  // 124. Binary Tree Maximum Path Sum
  124: {
    javascript: `${TREE_JS}
var maxPathSum = function(root) {

};`,
    python: `${TREE_PY}
class Solution:
    def maxPathSum(self, root: Optional[TreeNode]) -> int:
        `,
  },

  // 297. Serialize and Deserialize Binary Tree
  297: {
    javascript: `${TREE_JS}
var serialize = function(root) {

};

var deserialize = function(data) {

};`,
    python: `${TREE_PY}
class Codec:
    def serialize(self, root):
        pass

    def deserialize(self, data):
        pass`,
  },

  /* ── Tries ────────────────────────────────────── */

  // 208. Implement Trie (Prefix Tree)
  208: {
    javascript: `var Trie = function() {

};

/** @param {string} word */
Trie.prototype.insert = function(word) {

};

/** @param {string} word */
Trie.prototype.search = function(word) {

};

/** @param {string} prefix */
Trie.prototype.startsWith = function(prefix) {

};`,
    python: `class Trie:
    def __init__(self):
        pass

    def insert(self, word: str) -> None:
        pass

    def search(self, word: str) -> bool:
        pass

    def startsWith(self, prefix: str) -> bool:
        pass`,
  },

  // 211. Design Add and Search Words Data Structure
  211: {
    javascript: `var WordDictionary = function() {

};

/** @param {string} word */
WordDictionary.prototype.addWord = function(word) {

};

/** @param {string} word */
WordDictionary.prototype.search = function(word) {

};`,
    python: `class WordDictionary:
    def __init__(self):
        pass

    def addWord(self, word: str) -> None:
        pass

    def search(self, word: str) -> bool:
        pass`,
  },

  // 212. Word Search II
  212: {
    javascript: `/**
 * @param {character[][]} board
 * @param {string[]} words
 * @return {string[]}
 */
var findWords = function(board, words) {

};`,
    python: `class Solution:
    def findWords(self, board: List[List[str]], words: List[str]) -> List[str]:
        `,
  },

  /* ── Heap / Priority Queue ────────────────────── */

  // 703. Kth Largest Element in a Stream
  703: {
    javascript: `/**
 * @param {number} k
 * @param {number[]} nums
 */
var KthLargest = function(k, nums) {

};

/** @param {number} val */
KthLargest.prototype.add = function(val) {

};`,
    python: `class KthLargest:
    def __init__(self, k: int, nums: List[int]):
        pass

    def add(self, val: int) -> int:
        pass`,
  },

  // 1046. Last Stone Weight
  1046: {
    javascript: `/**
 * @param {number[]} stones
 * @return {number}
 */
var lastStoneWeight = function(stones) {

};`,
    python: `class Solution:
    def lastStoneWeight(self, stones: List[int]) -> int:
        `,
  },

  // 973. K Closest Points to Origin
  973: {
    javascript: `/**
 * @param {number[][]} points
 * @param {number} k
 * @return {number[][]}
 */
var kClosest = function(points, k) {

};`,
    python: `class Solution:
    def kClosest(self, points: List[List[int]], k: int) -> List[List[int]]:
        `,
  },

  // 215. Kth Largest Element in an Array
  215: {
    javascript: `/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function(nums, k) {

};`,
    python: `class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        `,
  },

  // 621. Task Scheduler
  621: {
    javascript: `/**
 * @param {character[]} tasks
 * @param {number} n
 * @return {number}
 */
var leastInterval = function(tasks, n) {

};`,
    python: `class Solution:
    def leastInterval(self, tasks: List[str], n: int) -> int:
        `,
  },

  // 355. Design Twitter
  355: {
    javascript: `var Twitter = function() {

};

/** @param {number} userId @param {number} tweetId */
Twitter.prototype.postTweet = function(userId, tweetId) {

};

/** @param {number} userId @return {number[]} */
Twitter.prototype.getNewsFeed = function(userId) {

};

/** @param {number} followerId @param {number} followeeId */
Twitter.prototype.follow = function(followerId, followeeId) {

};

/** @param {number} followerId @param {number} followeeId */
Twitter.prototype.unfollow = function(followerId, followeeId) {

};`,
    python: `class Twitter:
    def __init__(self):
        pass

    def postTweet(self, userId: int, tweetId: int) -> None:
        pass

    def getNewsFeed(self, userId: int) -> List[int]:
        pass

    def follow(self, followerId: int, followeeId: int) -> None:
        pass

    def unfollow(self, followerId: int, followeeId: int) -> None:
        pass`,
  },

  // 295. Find Median from Data Stream
  295: {
    javascript: `var MedianFinder = function() {

};

/** @param {number} num */
MedianFinder.prototype.addNum = function(num) {

};

/** @return {number} */
MedianFinder.prototype.findMedian = function() {

};`,
    python: `class MedianFinder:
    def __init__(self):
        pass

    def addNum(self, num: int) -> None:
        pass

    def findMedian(self) -> float:
        pass`,
  },

  /* ── Backtracking ─────────────────────────────── */

  // 78. Subsets
  78: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var subsets = function(nums) {

};`,
    python: `class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        `,
  },

  // 39. Combination Sum
  39: {
    javascript: `/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum = function(candidates, target) {

};`,
    python: `class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        `,
  },

  // 46. Permutations
  46: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function(nums) {

};`,
    python: `class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        `,
  },

  // 90. Subsets II
  90: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var subsetsWithDup = function(nums) {

};`,
    python: `class Solution:
    def subsetsWithDup(self, nums: List[int]) -> List[List[int]]:
        `,
  },

  // 40. Combination Sum II
  40: {
    javascript: `/**
 * @param {number[]} candidates
 * @param {number} target
 * @return {number[][]}
 */
var combinationSum2 = function(candidates, target) {

};`,
    python: `class Solution:
    def combinationSum2(self, candidates: List[int], target: int) -> List[List[int]]:
        `,
  },

  // 79. Word Search
  79: {
    javascript: `/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
var exist = function(board, word) {

};`,
    python: `class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        `,
  },

  // 131. Palindrome Partitioning
  131: {
    javascript: `/**
 * @param {string} s
 * @return {string[][]}
 */
var partition = function(s) {

};`,
    python: `class Solution:
    def partition(self, s: str) -> List[List[str]]:
        `,
  },

  // 17. Letter Combinations of a Phone Number
  17: {
    javascript: `/**
 * @param {string} digits
 * @return {string[]}
 */
var letterCombinations = function(digits) {

};`,
    python: `class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        `,
  },

  // 51. N-Queens
  51: {
    javascript: `/**
 * @param {number} n
 * @return {string[][]}
 */
var solveNQueens = function(n) {

};`,
    python: `class Solution:
    def solveNQueens(self, n: int) -> List[List[str]]:
        `,
  },

  /* ── Graphs ───────────────────────────────────── */

  // 200. Number of Islands
  200: {
    javascript: `/**
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands = function(grid) {

};`,
    python: `class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        `,
  },

  // 133. Clone Graph
  133: {
    javascript: `/**
 * // Definition for a Node.
 * function Node(val, neighbors) {
 *   this.val = val === undefined ? 0 : val;
 *   this.neighbors = neighbors === undefined ? [] : neighbors;
 * };
 */
var cloneGraph = function(node) {

};`,
    python: `class Solution:
    def cloneGraph(self, node: 'Optional[Node]') -> 'Optional[Node]':
        `,
  },

  // 695. Max Area of Island
  695: {
    javascript: `/**
 * @param {number[][]} grid
 * @return {number}
 */
var maxAreaOfIsland = function(grid) {

};`,
    python: `class Solution:
    def maxAreaOfIsland(self, grid: List[List[int]]) -> int:
        `,
  },

  // 417. Pacific Atlantic Water Flow
  417: {
    javascript: `/**
 * @param {number[][]} heights
 * @return {number[][]}
 */
var pacificAtlantic = function(heights) {

};`,
    python: `class Solution:
    def pacificAtlantic(self, heights: List[List[int]]) -> List[List[int]]:
        `,
  },

  // 130. Surrounded Regions
  130: {
    javascript: `/**
 * @param {character[][]} board
 * @return {void}
 */
var solve = function(board) {

};`,
    python: `class Solution:
    def solve(self, board: List[List[str]]) -> None:
        `,
  },

  // 994. Rotting Oranges
  994: {
    javascript: `/**
 * @param {number[][]} grid
 * @return {number}
 */
var orangesRotting = function(grid) {

};`,
    python: `class Solution:
    def orangesRotting(self, grid: List[List[int]]) -> int:
        `,
  },

  // 286. Walls and Gates
  286: {
    javascript: `/**
 * @param {number[][]} rooms
 * @return {void}
 */
var wallsAndGates = function(rooms) {

};`,
    python: `class Solution:
    def wallsAndGates(self, rooms: List[List[int]]) -> None:
        `,
  },

  // 207. Course Schedule
  207: {
    javascript: `/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
var canFinish = function(numCourses, prerequisites) {

};`,
    python: `class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        `,
  },

  // 210. Course Schedule II
  210: {
    javascript: `/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {number[]}
 */
var findOrder = function(numCourses, prerequisites) {

};`,
    python: `class Solution:
    def findOrder(self, numCourses: int, prerequisites: List[List[int]]) -> List[int]:
        `,
  },

  // 684. Redundant Connection
  684: {
    javascript: `/**
 * @param {number[][]} edges
 * @return {number[]}
 */
var findRedundantConnection = function(edges) {

};`,
    python: `class Solution:
    def findRedundantConnection(self, edges: List[List[int]]) -> List[int]:
        `,
  },

  // 323. Number of Connected Components in an Undirected Graph
  323: {
    javascript: `/**
 * @param {number} n
 * @param {number[][]} edges
 * @return {number}
 */
var countComponents = function(n, edges) {

};`,
    python: `class Solution:
    def countComponents(self, n: int, edges: List[List[int]]) -> int:
        `,
  },

  // 261. Graph Valid Tree
  261: {
    javascript: `/**
 * @param {number} n
 * @param {number[][]} edges
 * @return {boolean}
 */
var validTree = function(n, edges) {

};`,
    python: `class Solution:
    def validTree(self, n: int, edges: List[List[int]]) -> bool:
        `,
  },

  // 127. Word Ladder
  127: {
    javascript: `/**
 * @param {string} beginWord
 * @param {string} endWord
 * @param {string[]} wordList
 * @return {number}
 */
var ladderLength = function(beginWord, endWord, wordList) {

};`,
    python: `class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: List[str]) -> int:
        `,
  },

  /* ── Advanced Graphs ──────────────────────────── */

  // 332. Reconstruct Itinerary
  332: {
    javascript: `/**
 * @param {string[][]} tickets
 * @return {string[]}
 */
var findItinerary = function(tickets) {

};`,
    python: `class Solution:
    def findItinerary(self, tickets: List[List[str]]) -> List[str]:
        `,
  },

  // 1584. Min Cost to Connect All Points
  1584: {
    javascript: `/**
 * @param {number[][]} points
 * @return {number}
 */
var minCostConnectPoints = function(points) {

};`,
    python: `class Solution:
    def minCostConnectPoints(self, points: List[List[int]]) -> int:
        `,
  },

  // 743. Network Delay Time
  743: {
    javascript: `/**
 * @param {number[][]} times
 * @param {number} n
 * @param {number} k
 * @return {number}
 */
var networkDelayTime = function(times, n, k) {

};`,
    python: `class Solution:
    def networkDelayTime(self, times: List[List[int]], n: int, k: int) -> int:
        `,
  },

  // 778. Swim in Rising Water
  778: {
    javascript: `/**
 * @param {number[][]} grid
 * @return {number}
 */
var swimInWater = function(grid) {

};`,
    python: `class Solution:
    def swimInWater(self, grid: List[List[int]]) -> int:
        `,
  },

  // 269. Alien Dictionary
  269: {
    javascript: `/**
 * @param {string[]} words
 * @return {string}
 */
var alienOrder = function(words) {

};`,
    python: `class Solution:
    def alienOrder(self, words: List[str]) -> str:
        `,
  },

  // 787. Cheapest Flights Within K Stops
  787: {
    javascript: `/**
 * @param {number} n
 * @param {number[][]} flights
 * @param {number} src
 * @param {number} dst
 * @param {number} k
 * @return {number}
 */
var findCheapestPrice = function(n, flights, src, dst, k) {

};`,
    python: `class Solution:
    def findCheapestPrice(self, n: int, flights: List[List[int]], src: int, dst: int, k: int) -> int:
        `,
  },

  /* ── Dynamic Programming 1D ───────────────────── */

  // 70. Climbing Stairs
  70: {
    javascript: `/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {

};`,
    python: `class Solution:
    def climbStairs(self, n: int) -> int:
        `,
  },

  // 746. Min Cost Climbing Stairs
  746: {
    javascript: `/**
 * @param {number[]} cost
 * @return {number}
 */
var minCostClimbingStairs = function(cost) {

};`,
    python: `class Solution:
    def minCostClimbingStairs(self, cost: List[int]) -> int:
        `,
  },

  // 198. House Robber
  198: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {

};`,
    python: `class Solution:
    def rob(self, nums: List[int]) -> int:
        `,
  },

  // 213. House Robber II
  213: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {

};`,
    python: `class Solution:
    def rob(self, nums: List[int]) -> int:
        `,
  },

  // 5. Longest Palindromic Substring
  5: {
    javascript: `/**
 * @param {string} s
 * @return {string}
 */
var longestPalindrome = function(s) {

};`,
    python: `class Solution:
    def longestPalindrome(self, s: str) -> str:
        `,
  },

  // 647. Palindromic Substrings
  647: {
    javascript: `/**
 * @param {string} s
 * @return {number}
 */
var countSubstrings = function(s) {

};`,
    python: `class Solution:
    def countSubstrings(self, s: str) -> int:
        `,
  },

  // 91. Decode Ways
  91: {
    javascript: `/**
 * @param {string} s
 * @return {number}
 */
var numDecodings = function(s) {

};`,
    python: `class Solution:
    def numDecodings(self, s: str) -> int:
        `,
  },

  // 322. Coin Change
  322: {
    javascript: `/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function(coins, amount) {

};`,
    python: `class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        `,
  },

  // 152. Maximum Product Subarray
  152: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var maxProduct = function(nums) {

};`,
    python: `class Solution:
    def maxProduct(self, nums: List[int]) -> int:
        `,
  },

  // 139. Word Break
  139: {
    javascript: `/**
 * @param {string} s
 * @param {string[]} wordDict
 * @return {boolean}
 */
var wordBreak = function(s, wordDict) {

};`,
    python: `class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        `,
  },

  // 300. Longest Increasing Subsequence
  300: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var lengthOfLIS = function(nums) {

};`,
    python: `class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        `,
  },

  // 416. Partition Equal Subset Sum
  416: {
    javascript: `/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canPartition = function(nums) {

};`,
    python: `class Solution:
    def canPartition(self, nums: List[int]) -> bool:
        `,
  },

  /* ── Dynamic Programming 2D ───────────────────── */

  // 62. Unique Paths
  62: {
    javascript: `/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
var uniquePaths = function(m, n) {

};`,
    python: `class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        `,
  },

  // 1143. Longest Common Subsequence
  1143: {
    javascript: `/**
 * @param {string} text1
 * @param {string} text2
 * @return {number}
 */
var longestCommonSubsequence = function(text1, text2) {

};`,
    python: `class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        `,
  },

  // 309. Best Time to Buy and Sell Stock with Cooldown
  309: {
    javascript: `/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {

};`,
    python: `class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        `,
  },

  // 518. Coin Change II
  518: {
    javascript: `/**
 * @param {number} amount
 * @param {number[]} coins
 * @return {number}
 */
var change = function(amount, coins) {

};`,
    python: `class Solution:
    def change(self, amount: int, coins: List[int]) -> int:
        `,
  },

  // 494. Target Sum
  494: {
    javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var findTargetSumWays = function(nums, target) {

};`,
    python: `class Solution:
    def findTargetSumWays(self, nums: List[int], target: int) -> int:
        `,
  },

  // 97. Interleaving String
  97: {
    javascript: `/**
 * @param {string} s1
 * @param {string} s2
 * @param {string} s3
 * @return {boolean}
 */
var isInterleave = function(s1, s2, s3) {

};`,
    python: `class Solution:
    def isInterleave(self, s1: str, s2: str, s3: str) -> bool:
        `,
  },

  // 329. Longest Increasing Path in a Matrix
  329: {
    javascript: `/**
 * @param {number[][]} matrix
 * @return {number}
 */
var longestIncreasingPath = function(matrix) {

};`,
    python: `class Solution:
    def longestIncreasingPath(self, matrix: List[List[int]]) -> int:
        `,
  },

  // 115. Distinct Subsequences
  115: {
    javascript: `/**
 * @param {string} s
 * @param {string} t
 * @return {number}
 */
var numDistinct = function(s, t) {

};`,
    python: `class Solution:
    def numDistinct(self, s: str, t: str) -> int:
        `,
  },

  // 72. Edit Distance
  72: {
    javascript: `/**
 * @param {string} word1
 * @param {string} word2
 * @return {number}
 */
var minDistance = function(word1, word2) {

};`,
    python: `class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        `,
  },

  // 312. Burst Balloons
  312: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var maxCoins = function(nums) {

};`,
    python: `class Solution:
    def maxCoins(self, nums: List[int]) -> int:
        `,
  },

  // 10. Regular Expression Matching
  10: {
    javascript: `/**
 * @param {string} s
 * @param {string} p
 * @return {boolean}
 */
var isMatch = function(s, p) {

};`,
    python: `class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        `,
  },

  /* ── Greedy ───────────────────────────────────── */

  // 53. Maximum Subarray
  53: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {

};`,
    python: `class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        `,
  },

  // 55. Jump Game
  55: {
    javascript: `/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function(nums) {

};`,
    python: `class Solution:
    def canJump(self, nums: List[int]) -> bool:
        `,
  },

  // 45. Jump Game II
  45: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var jump = function(nums) {

};`,
    python: `class Solution:
    def jump(self, nums: List[int]) -> int:
        `,
  },

  // 134. Gas Station
  134: {
    javascript: `/**
 * @param {number[]} gas
 * @param {number[]} cost
 * @return {number}
 */
var canCompleteCircuit = function(gas, cost) {

};`,
    python: `class Solution:
    def canCompleteCircuit(self, gas: List[int], cost: List[int]) -> int:
        `,
  },

  // 846. Hand of Straights
  846: {
    javascript: `/**
 * @param {number[]} hand
 * @param {number} groupSize
 * @return {boolean}
 */
var isNStraightHand = function(hand, groupSize) {

};`,
    python: `class Solution:
    def isNStraightHand(self, hand: List[int], groupSize: int) -> bool:
        `,
  },

  // 1899. Merge Triplets to Form Target Triplet
  1899: {
    javascript: `/**
 * @param {number[][]} triplets
 * @param {number[]} target
 * @return {boolean}
 */
var mergeTriplets = function(triplets, target) {

};`,
    python: `class Solution:
    def mergeTriplets(self, triplets: List[List[int]], target: List[int]) -> bool:
        `,
  },

  // 763. Partition Labels
  763: {
    javascript: `/**
 * @param {string} s
 * @return {number[]}
 */
var partitionLabels = function(s) {

};`,
    python: `class Solution:
    def partitionLabels(self, s: str) -> List[int]:
        `,
  },

  // 678. Valid Parenthesis String
  678: {
    javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
var checkValidString = function(s) {

};`,
    python: `class Solution:
    def checkValidString(self, s: str) -> bool:
        `,
  },

  /* ── Intervals ────────────────────────────────── */

  // 57. Insert Interval
  57: {
    javascript: `/**
 * @param {number[][]} intervals
 * @param {number[]} newInterval
 * @return {number[][]}
 */
var insert = function(intervals, newInterval) {

};`,
    python: `class Solution:
    def insert(self, intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:
        `,
  },

  // 56. Merge Intervals
  56: {
    javascript: `/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function(intervals) {

};`,
    python: `class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        `,
  },

  // 435. Non-overlapping Intervals
  435: {
    javascript: `/**
 * @param {number[][]} intervals
 * @return {number}
 */
var eraseOverlapIntervals = function(intervals) {

};`,
    python: `class Solution:
    def eraseOverlapIntervals(self, intervals: List[List[int]]) -> int:
        `,
  },

  // 252. Meeting Rooms
  252: {
    javascript: `/**
 * @param {number[][]} intervals
 * @return {boolean}
 */
var canAttendMeetings = function(intervals) {

};`,
    python: `class Solution:
    def canAttendMeetings(self, intervals: List[List[int]]) -> bool:
        `,
  },

  // 253. Meeting Rooms II
  253: {
    javascript: `/**
 * @param {number[][]} intervals
 * @return {number}
 */
var minMeetingRooms = function(intervals) {

};`,
    python: `class Solution:
    def minMeetingRooms(self, intervals: List[List[int]]) -> int:
        `,
  },

  // 2402. Meeting Rooms III
  2402: {
    javascript: `/**
 * @param {number} n
 * @param {number[][]} meetings
 * @return {number}
 */
var mostBooked = function(n, meetings) {

};`,
    python: `class Solution:
    def mostBooked(self, n: int, meetings: List[List[int]]) -> int:
        `,
  },

  /* ── Math & Geometry ──────────────────────────── */

  // 48. Rotate Image
  48: {
    javascript: `/**
 * @param {number[][]} matrix
 * @return {void}
 */
var rotate = function(matrix) {

};`,
    python: `class Solution:
    def rotate(self, matrix: List[List[int]]) -> None:
        `,
  },

  // 54. Spiral Matrix
  54: {
    javascript: `/**
 * @param {number[][]} matrix
 * @return {number[]}
 */
var spiralOrder = function(matrix) {

};`,
    python: `class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        `,
  },

  // 73. Set Matrix Zeroes
  73: {
    javascript: `/**
 * @param {number[][]} matrix
 * @return {void}
 */
var setZeroes = function(matrix) {

};`,
    python: `class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        `,
  },

  // 202. Happy Number
  202: {
    javascript: `/**
 * @param {number} n
 * @return {boolean}
 */
var isHappy = function(n) {

};`,
    python: `class Solution:
    def isHappy(self, n: int) -> bool:
        `,
  },

  // 66. Plus One
  66: {
    javascript: `/**
 * @param {number[]} digits
 * @return {number[]}
 */
var plusOne = function(digits) {

};`,
    python: `class Solution:
    def plusOne(self, digits: List[int]) -> List[int]:
        `,
  },

  // 50. Pow(x, n)
  50: {
    javascript: `/**
 * @param {number} x
 * @param {number} n
 * @return {number}
 */
var myPow = function(x, n) {

};`,
    python: `class Solution:
    def myPow(self, x: float, n: int) -> float:
        `,
  },

  // 43. Multiply Strings
  43: {
    javascript: `/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
var multiply = function(num1, num2) {

};`,
    python: `class Solution:
    def multiply(self, num1: str, num2: str) -> str:
        `,
  },

  // 1041. Robot Bounded In Circle (Detect Squares is 2d problem, 1041 is the correct one for NC150)
  1041: {
    javascript: `/**
 * @param {string} instructions
 * @return {boolean}
 */
var isRobotBounded = function(instructions) {

};`,
    python: `class Solution:
    def isRobotBounded(self, instructions: str) -> bool:
        `,
  },

  /* ── Bit Manipulation ─────────────────────────── */

  // 136. Single Number
  136: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var singleNumber = function(nums) {

};`,
    python: `class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        `,
  },

  // 191. Number of 1 Bits
  191: {
    javascript: `/**
 * @param {number} n
 * @return {number}
 */
var hammingWeight = function(n) {

};`,
    python: `class Solution:
    def hammingWeight(self, n: int) -> int:
        `,
  },

  // 338. Counting Bits
  338: {
    javascript: `/**
 * @param {number} n
 * @return {number[]}
 */
var countBits = function(n) {

};`,
    python: `class Solution:
    def countBits(self, n: int) -> List[int]:
        `,
  },

  // 190. Reverse Bits
  190: {
    javascript: `/**
 * @param {number} n - a positive integer
 * @return {number} - a positive integer
 */
var reverseBits = function(n) {

};`,
    python: `class Solution:
    def reverseBits(self, n: int) -> int:
        `,
  },

  // 268. Missing Number
  268: {
    javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var missingNumber = function(nums) {

};`,
    python: `class Solution:
    def missingNumber(self, nums: List[int]) -> int:
        `,
  },

  // 371. Sum of Two Integers
  371: {
    javascript: `/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
var getSum = function(a, b) {

};`,
    python: `class Solution:
    def getSum(self, a: int, b: int) -> int:
        `,
  },

  // 7. Reverse Integer
  7: {
    javascript: `/**
 * @param {number} x
 * @return {number}
 */
var reverse = function(x) {

};`,
    python: `class Solution:
    def reverse(self, x: int) -> int:
        `,
  },
}

/** Get starter code for a problem, with optional fallback */
export function getStarterCode(
  problemId: number,
  language: 'javascript' | 'python',
): string {
  const starter = NEETCODE_STARTERS[problemId]
  if (starter) return starter[language]
  // Generic fallback
  return language === 'javascript'
    ? `/**\n * @return {*}\n */\nvar solve = function() {\n\n};`
    : `class Solution:\n    def solve(self):\n        pass`
}
