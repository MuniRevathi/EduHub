import fetch from 'node-fetch';

// Fetch solved problems from LeetCode using session cookie
export const fetchSolvedProblems = async (session) => {
  try {
    const resp = await fetch('https://leetcode.com/api/problems/all/', {
      headers: {
        'Cookie': `LEETCODE_SESSION=${session}`,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://leetcode.com',
        'Accept': 'application/json'
      }
    });

    if (!resp.ok) {
      throw new Error('Failed to fetch from LeetCode');
    }

    const data = await resp.json();
    const solvedTitles = [];
    const solvedSlugs = [];
    const solvedIds = [];

    if (data && data.stat_status_pairs) {
      data.stat_status_pairs.forEach(pair => {
        if (pair.status === 'ac') {
          solvedTitles.push(pair.stat.question__title);
          solvedSlugs.push(pair.stat.question__title_slug);
          solvedIds.push(String(pair.stat.frontend_question_id)); // LeetCode problem ID as string
        }
      });
    }

    return {
      solvedTitles,
      solvedSlugs,
      solvedIds,
      totalSolved: solvedTitles.length,
      totalProblems: data?.num_total || 0
    };
  } catch (error) {
    console.error('LeetCode API error:', error);
    throw new Error('Failed to sync with LeetCode');
  }
};

// Fetch user stats from LeetCode
export const fetchUserStats = async (username) => {
  try {
    const query = `
      query userProfile($username: String!) {
        matchedUser(username: $username) {
          username
          profile {
            realName
            ranking
            reputation
          }
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `;

    const resp = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: JSON.stringify({
        query,
        variables: { username }
      })
    });

    if (!resp.ok) {
      throw new Error('Failed to fetch LeetCode stats');
    }

    const data = await resp.json();
    
    if (data.errors || !data.data?.matchedUser) {
      throw new Error('User not found on LeetCode');
    }

    const user = data.data.matchedUser;
    const stats = user.submitStatsGlobal?.acSubmissionNum || [];
    
    const result = {
      username: user.username,
      ranking: user.profile?.ranking || 0,
      reputation: user.profile?.reputation || 0,
      solved: {
        easy: stats.find(s => s.difficulty === 'Easy')?.count || 0,
        medium: stats.find(s => s.difficulty === 'Medium')?.count || 0,
        hard: stats.find(s => s.difficulty === 'Hard')?.count || 0,
        total: stats.find(s => s.difficulty === 'All')?.count || 0
      }
    };

    return result;
  } catch (error) {
    console.error('LeetCode stats error:', error);
    throw error;
  }
};

// Validate LeetCode session
export const validateSession = async (session) => {
  try {
    const resp = await fetch('https://leetcode.com/api/problems/all/', {
      headers: {
        'Cookie': `LEETCODE_SESSION=${session}`,
        'User-Agent': 'Mozilla/5.0',
        'Referer': 'https://leetcode.com'
      }
    });

    if (!resp.ok) {
      return { valid: false };
    }

    const data = await resp.json();
    return { 
      valid: true, 
      userStatus: data.user_name || null 
    };
  } catch (error) {
    return { valid: false };
  }
};

