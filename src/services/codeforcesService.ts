export interface CodeforcesStats {
  handle: string;
  rating: number;
  maxRating: number;
  rank: string;
  maxRank: string;
  country?: string;
  organization?: string;
  contribution: number;
  friendOfCount: number;
  totalContests: number;
}

export async function fetchCodeforcesStats(handle: string): Promise<CodeforcesStats> {
  // Get user info
  const infoResponse = await fetch(
    `https://codeforces.com/api/user.info?handles=${handle}`
  );

  if (!infoResponse.ok) {
    throw new Error('Failed to fetch Codeforces data');
  }

  const infoData = await infoResponse.json();

  if (infoData.status !== 'OK') {
    throw new Error(infoData.comment || 'User not found');
  }

  const user = infoData.result[0];

  // Get rating history
  const ratingResponse = await fetch(
    `https://codeforces.com/api/user.rating?handle=${handle}`
  );

  let totalContests = 0;
  if (ratingResponse.ok) {
    const ratingData = await ratingResponse.json();
    if (ratingData.status === 'OK') {
      totalContests = ratingData.result.length;
    }
  }

  return {
    handle: user.handle,
    rating: user.rating || 0,
    maxRating: user.maxRating || 0,
    rank: user.rank || 'Unrated',
    maxRank: user.maxRank || 'Unrated',
    country: user.country,
    organization: user.organization,
    contribution: user.contribution || 0,
    friendOfCount: user.friendOfCount || 0,
    totalContests,
  };
}
