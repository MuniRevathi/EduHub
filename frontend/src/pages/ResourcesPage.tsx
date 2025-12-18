import { useState } from 'react';
import { 
  ChevronRight, 
  ExternalLink, 
  BookOpen,
  Search,
  X,
  Layers,
  Code2,
  GitBranch,
  Binary,
  ListTree,
  Link2,
  Braces,
  FileText
} from 'lucide-react';

interface ResourceLink {
  title: string;
  url: string;
}

interface ResourceCategory {
  category: string;
  links: ResourceLink[];
}

const resources: ResourceCategory[] = [
  {
    category: "Sliding Window",
    links: [
      {
        title: "Sliding Window Cheatsheet: Frequency of the Most Frequent Element - LeetCode",
        url: "https://leetcode.com/problems/frequency-of-the-most-frequent-element/solutions/1175088/C++-Maximum-Sliding-Window-Cheatsheet-Template/"
      }
    ]
  },
  {
    category: "Two Pointers",
    links: [
      {
        title: "Solved all two pointers problems in 100 days - LeetCode Discuss",
        url: "https://leetcode.com/discuss/post/1688903/solved-all-two-pointers-problems-in-100-z56cn/"
      }
    ]
  },
  {
    category: "Substring Template",
    links: [
      {
        title: "10-line template to solve most substring problems - Minimum Window Substring",
        url: "https://leetcode.com/problems/minimum-window-substring/solutions/26808/Here-is-a-10-line-template-that-can-solve-most-'substring'-problems/"
      }
    ]
  },
  {
    category: "Binary Search",
    links: [
      {
        title: "Powerful Ultimate Binary Search Template - LeetCode Discuss",
        url: "https://leetcode.com/discuss/post/786126/Python-Powerful-Ultimate-Binary-Search-Template.-Solved-many-problems/"
      }
    ]
  },
  {
    category: "Greedy",
    links: [
      {
        title: "Greedy Problem Patterns - LeetCode Discuss",
        url: "https://leetcode.com/discuss/post/669996/Greedy-for-Beginners-Problems-or-Sample-solutions/"
      }
    ]
  },
  {
    category: "Recursion",
    links: [
      {
        title: "Become Master In Recursion - LeetCode Discuss",
        url: "https://leetcode.com/discuss/post/1733447/become-master-in-recursion-by-hi-malik-sau4/"
      },
      {
        title: "Recursive Approach to Segment Trees",
        url: "https://leetcode.com/articles/a-recursive-approach-to-segment-trees-range-sum-queries-lazy-propagation/"
      }
    ]
  },
  {
    category: "Backtracking",
    links: [
      {
        title: "Leetcode Pattern 3 | Backtracking | by csgator",
        url: "https://medium.com/leetcode-patterns/leetcode-pattern-3-backtracking-5d9e5a03dc26"
      },
      {
        title: "Permutations - LeetCode",
        url: "https://leetcode.com/problems/permutations/solutions/18239/A-general-approach-to-backtracking-questions-in-Java-(Subsets-Permutations-Combination-Sum-Palindrome-Partioning)/"
      }
    ]
  },
  {
    category: "Dynamic Programming",
    links: [
      {
        title: "TopCoder - DP: From Novice to Advanced",
        url: "https://www.topcoder.com/thrive/articles/Dynamic%20Programming:%20From%20Novice%20to%20Advanced"
      },
      {
        title: "DP Patterns - LeetCode Discuss",
        url: "https://leetcode.com/discuss/general-discussion/458695/dynamic-programming-patterns"
      },
      {
        title: "DP Patterns by badgujja - LeetCode Discuss",
        url: "https://leetcode.com/discuss/post/1437879/dynamic-programming-patterns-by-badgujja-lh0i/"
      },
      {
        title: "Solved All DP Problems in 7 Months",
        url: "https://leetcode.com/discuss/general-discussion/1000929/solved-all-dynamic-programming-dp-problems-in-7-months"
      },
      {
        title: "DP for Beginners",
        url: "https://leetcode.com/discuss/general-discussion/662866/dp-for-beginners-problems-patterns-sample-solutions"
      },
      {
        title: "Knapsack Problem",
        url: "https://leetcode.com/discuss/study-guide/1200320/Thief-with-a-knapsack-a-series-of-crimes"
      },
      {
        title: "How to Solve DP - String",
        url: "https://leetcode.com/discuss/general-discussion/651719/how-to-solve-dp-string-template-and-4-steps-to-be-followed"
      },
      {
        title: "DP Questions Thread",
        url: "https://leetcode.com/discuss/general-discussion/491522/dynamic-programming-questions-thread"
      },
      {
        title: "Iterative DP solution using subset sum",
        url: "https://leetcode.com/problems/target-sum/solutions/97334/java-15-ms-c-3-ms-ons-iterative-dp-solution-using-subset-sum-with-explanation/"
      },
      {
        title: "Dynamic Programming Summary",
        url: "https://leetcode.com/discuss/general-discussion/592146/dynamic-programming-summary"
      },
      {
        title: "Must Do DP Problems Category-wise",
        url: "https://leetcode.com/discuss/general-discussion/1050391/Must-do-Dynamic-programming-Problems-Category-wise"
      },
      {
        title: "Dynamic Programming is Simple",
        url: "https://leetcode.com/discuss/study-guide/1490172/Dynamic-programming-is-simple"
      },
      {
        title: "Dynamic Programming on Subsets with Examples",
        url: "https://leetcode.com/discuss/general-discussion/1125779/Dynamic-programming-on-subsets-with-examples-explained"
      },
      {
        title: "DP is EASY - 5 Steps",
        url: "https://leetcode.com/problems/target-sum/solutions/455024/DP-IS-EASY!-5-Steps-to-Think-Through-DP-Questions/"
      }
    ]
  },
  {
    category: "Graph Algorithms",
    links: [
      {
        title: "Graph For Beginners",
        url: "https://leetcode.com/discuss/post/655708/graph-for-beginners-problems-pattern-sam-06fb/"
      },
      {
        title: "BFS + DFS - Part 1",
        url: "https://medium.com/leetcode-patterns/leetcode-pattern-1-bfs-dfs-25-of-the-problems-part-1-519450a84353"
      },
      {
        title: "BFS + DFS - Part 2",
        url: "https://medium.com/leetcode-patterns/leetcode-pattern-2-dfs-bfs-25-of-the-problems-part-2-a5b269597f52"
      },
      {
        title: "Graph All in One - LeetCode Discuss",
        url: "https://leetcode.com/discuss/post/2043791/graph-all-in-one-must-watch-for-beginner-zqzr/"
      },
      {
        title: "DFS & BFS Tree Traversal",
        url: "https://leetcode.com/discuss/post/937307/iterative-recursive-dfs-bfs-tree-travers-e1f4/"
      },
      {
        title: "Tree Question Patterns - 2023 & 2021",
        url: "https://leetcode.com/discuss/post/1337373/tree-question-pattern-2021-placement-by-t65qm/"
      },
      {
        title: "Dijkstra's Algorithm Guide",
        url: "https://leetcode.com/discuss/post/1059477/a-guide-to-dijkstras-algorithm-by-bliss1-6x3l/"
      },
      {
        title: "Disjoint Set Union (DSU) - Complete Guide",
        url: "https://leetcode.com/discuss/post/1072418/disjoint-set-union-dsuunion-find-a-compl-2oqn/"
      },
      {
        title: "Graph Algorithms One Place",
        url: "https://leetcode.com/discuss/post/969327/graph-algorithms-one-place-dijkstra-bell-asgf/"
      },
      {
        title: "Reconstruct Itinerary - DFS",
        url: "https://leetcode.com/problems/reconstruct-itinerary/solutions/78768/Short-Ruby-Python-Java-C++/"
      }
    ]
  },
  {
    category: "Bit Manipulation",
    links: [
      {
        title: "Patterns for Bit Manipulation - LeetCode Discuss",
        url: "https://leetcode.com/discuss/post/3695233/all-types-of-patterns-for-bits-manipulat-qezp/"
      }
    ]
  },
  {
    category: "Monotonic Stack",
    links: [
      {
        title: "Guide and Template for Monotonic Stack Problems",
        url: "https://leetcode.com/discuss/post/2347639/A-comprehensive-guide-and-template-for-monotonic-stack-based-problems/"
      }
    ]
  },
  {
    category: "String Patterns",
    links: [
      {
        title: "Collections of Important String Questions",
        url: "https://leetcode.com/discuss/post/2001789/collections-of-important-string-question-pc6y/"
      }
    ]
  },
  {
    category: "Linked List",
    links: [
      {
        title: "Become Master in Linked List",
        url: "https://leetcode.com/discuss/post/1800120/become-master-in-linked-list-by-hi-malik-qvdr/"
      }
    ]
  },
  {
    category: "Trie",
    links: [
      {
        title: "Introduction to Trie",
        url: "https://leetcode.com/discuss/post/1066206/introduction-to-trie-by-since2020-61ua/"
      }
    ]
  },
  {
    category: "Interview Patterns",
    links: [
      {
        title: "14 Patterns to Ace Any Coding Interview | HackerNoon",
        url: "https://hackernoon.com/14-patterns-to-ace-any-coding-interview-question-c5bb3357f6ed"
      }
    ]
  }
];

// Category icons mapping
const getCategoryIcon = (category: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    "Sliding Window": <Layers className="w-6 h-6" />,
    "Two Pointers": <GitBranch className="w-6 h-6" />,
    "Substring Template": <FileText className="w-6 h-6" />,
    "Binary Search": <Binary className="w-6 h-6" />,
    "Greedy": <Code2 className="w-6 h-6" />,
    "Recursion": <ListTree className="w-6 h-6" />,
    "Backtracking": <GitBranch className="w-6 h-6" />,
    "Dynamic Programming": <Braces className="w-6 h-6" />,
    "Graph Algorithms": <GitBranch className="w-6 h-6" />,
    "Bit Manipulation": <Binary className="w-6 h-6" />,
    "Monotonic Stack": <Layers className="w-6 h-6" />,
    "String Patterns": <FileText className="w-6 h-6" />,
    "Linked List": <Link2 className="w-6 h-6" />,
    "Trie": <ListTree className="w-6 h-6" />,
    "Interview Patterns": <BookOpen className="w-6 h-6" />,
  };
  return iconMap[category] || <BookOpen className="w-6 h-6" />;
};

// Category colors mapping
const getCategoryColor = (category: string) => {
  const colorMap: { [key: string]: string } = {
    "Sliding Window": "var(--primary-500)",
    "Two Pointers": "var(--accent-blue)",
    "Substring Template": "var(--accent-green)",
    "Binary Search": "var(--accent-yellow)",
    "Greedy": "var(--accent-purple)",
    "Recursion": "var(--accent-red)",
    "Backtracking": "var(--primary-400)",
    "Dynamic Programming": "var(--accent-yellow)",
    "Graph Algorithms": "var(--accent-blue)",
    "Bit Manipulation": "var(--accent-purple)",
    "Monotonic Stack": "var(--accent-green)",
    "String Patterns": "var(--primary-500)",
    "Linked List": "var(--accent-red)",
    "Trie": "var(--accent-blue)",
    "Interview Patterns": "var(--accent-yellow)",
  };
  return colorMap[category] || "var(--primary-500)";
};

const ResourcesPage = () => {
  // Only one category can be expanded at a time (accordion behavior)
  const [expandedCategory, setExpandedCategory] = useState<number | null>(0);
  const [search, setSearch] = useState('');

  const toggleCategory = (index: number) => {
    // Close if clicking same category, otherwise open new one (closes others automatically)
    setExpandedCategory(prev => prev === index ? null : index);
  };

  // Filter resources based on search
  const filteredResources = resources.map(resource => ({
    ...resource,
    links: resource.links.filter(link => 
      link.title.toLowerCase().includes(search.toLowerCase()) ||
      resource.category.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(resource => resource.links.length > 0);

  // Get total stats
  const totalCategories = resources.length;
  const totalLinks = resources.reduce((acc, r) => acc + r.links.length, 0);

  return (
    <div className="min-h-screen pt-[180px] sm:pt-[200px] pb-16 bg-[var(--bg-primary)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Learning Resources</h1>
          <p className="text-base sm:text-lg lg:text-xl text-[var(--text-secondary)]">
            Curated collection of {totalLinks}+ best resources to master DSA patterns and ace your interviews.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10">
          <div className="card p-5 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[var(--primary-500)]/10 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-[var(--primary-400)]" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold">{totalCategories}</div>
                <div className="text-sm sm:text-base text-[var(--text-muted)]">Categories</div>
              </div>
            </div>
          </div>
          <div className="card p-5 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[var(--accent-blue)]/10 flex items-center justify-center flex-shrink-0">
                <Link2 className="w-6 h-6 sm:w-7 sm:h-7 text-[var(--accent-blue)]" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold">{totalLinks}</div>
                <div className="text-sm sm:text-base text-[var(--text-muted)]">Resources</div>
              </div>
            </div>
          </div>
          <div className="card p-5 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[var(--accent-green)]/10 flex items-center justify-center flex-shrink-0">
                <Code2 className="w-6 h-6 sm:w-7 sm:h-7 text-[var(--accent-green)]" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold">Free</div>
                <div className="text-sm sm:text-base text-[var(--text-muted)]">All Access</div>
              </div>
            </div>
          </div>
          <div className="card p-5 sm:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[var(--accent-purple)]/10 flex items-center justify-center flex-shrink-0">
                <Layers className="w-6 h-6 sm:w-7 sm:h-7 text-[var(--accent-purple)]" />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold">DSA</div>
                <div className="text-sm sm:text-base text-[var(--text-muted)]">Patterns</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search resources..."
            className="w-full pl-14 pr-14 py-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-primary)] text-base sm:text-lg focus:outline-none focus:border-[var(--primary-500)] transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}
        </div>

        {/* Resources List */}
        <div className="space-y-4 sm:space-y-5">
          {(search ? filteredResources : resources).map((resource, index) => {
            const isExpanded = expandedCategory === index;
            const categoryColor = getCategoryColor(resource.category);

            return (
              <div key={resource.category} className="card overflow-hidden">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(index)}
                  className="w-full px-5 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 flex items-center justify-between bg-[var(--bg-tertiary)] hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className={`transform transition-transform flex-shrink-0 ${isExpanded ? 'rotate-90' : ''}`}>
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--text-muted)]" />
                    </div>
                    <div 
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${categoryColor}20` }}
                    >
                      <span style={{ color: categoryColor }}>{getCategoryIcon(resource.category)}</span>
                    </div>
                    <div className="text-left min-w-0">
                      <h3 className="font-bold text-lg sm:text-xl lg:text-2xl truncate">{resource.category}</h3>
                      <p className="text-sm sm:text-base lg:text-lg text-[var(--text-muted)] mt-0.5 sm:mt-1">
                        {resource.links.length} resource{resource.links.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2 sm:ml-4">
                    <span 
                      className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold"
                      style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
                    >
                      {resource.links.length}
                    </span>
                  </div>
                </button>

                {/* Links */}
                {isExpanded && (
                  <div className="border-t border-[var(--border-primary)]">
                    {resource.links.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-5 sm:px-6 lg:px-8 py-3 sm:py-4 hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer border-b border-[var(--border-primary)] last:border-b-0 group"
                      >
                        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                          <div 
                            className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: categoryColor }}
                          />
                          <span className="text-sm sm:text-base lg:text-lg text-[var(--text-primary)] group-hover:text-[var(--primary-400)] transition-colors truncate">
                            {link.title}
                          </span>
                        </div>
                        <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--text-muted)] group-hover:text-[var(--primary-400)] transition-colors flex-shrink-0 ml-2 sm:ml-4" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {search && filteredResources.length === 0 && (
          <div className="text-center py-16 sm:py-20">
            <div className="text-5xl sm:text-6xl mb-4 sm:mb-6">🔍</div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">No resources found</h3>
            <p className="text-base sm:text-lg text-[var(--text-muted)]">
              Try searching with different keywords
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcesPage;
