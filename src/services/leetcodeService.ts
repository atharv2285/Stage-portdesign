export interface LeetCodeStats {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking?: number;
  contributionPoints?: number;
  reputation?: number;
}

export async function fetchLeetCodeStats(username: string): Promise<LeetCodeStats> {
  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          ranking
          reputation
        }
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
        contributions {
          points
        }
      }
    }
  `;

  const response = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { username },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch LeetCode data');
  }

  const data = await response.json();
  
  if (!data.data?.matchedUser) {
    throw new Error('User not found');
  }

  const user = data.data.matchedUser;
  const stats = user.submitStatsGlobal.acSubmissionNum;

  return {
    username: user.username,
    totalSolved: stats.find((s: any) => s.difficulty === 'All')?.count || 0,
    easySolved: stats.find((s: any) => s.difficulty === 'Easy')?.count || 0,
    mediumSolved: stats.find((s: any) => s.difficulty === 'Medium')?.count || 0,
    hardSolved: stats.find((s: any) => s.difficulty === 'Hard')?.count || 0,
    ranking: user.profile?.ranking,
    reputation: user.profile?.reputation,
    contributionPoints: user.contributions?.points,
  };
}
