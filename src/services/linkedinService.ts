export interface LinkedInProfile {
  username: string;
  fullName: string;
  headline?: string;
  profileUrl: string;
  connections?: number;
  followers?: number;
  imageUrl?: string;
}

export interface LinkedInWorkExperience {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description?: string;
  current: boolean;
}

export async function fetchLinkedInProfile(
  profileUrl: string,
  rapidApiKey: string
): Promise<LinkedInProfile> {
  const username = extractLinkedInUsername(profileUrl);
  
  const response = await fetch(
    `https://fresh-linkedin-profile-data.p.rapidapi.com/get-profile-data-by-url?url=${encodeURIComponent(profileUrl)}`,
    {
      method: 'GET',
      headers: {
        'x-rapidapi-key': rapidApiKey,
        'x-rapidapi-host': 'fresh-linkedin-profile-data.p.rapidapi.com',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch LinkedIn data');
  }

  const data = await response.json();

  return {
    username,
    fullName: data.data?.name || username,
    headline: data.data?.headline,
    profileUrl,
    connections: data.data?.connectionsCount,
    followers: data.data?.followersCount,
    imageUrl: data.data?.profilePicture,
  };
}

export async function fetchLinkedInWorkExperience(
  profileUrl: string,
  rapidApiKey: string
): Promise<LinkedInWorkExperience[]> {
  const response = await fetch(
    `https://fresh-linkedin-profile-data.p.rapidapi.com/get-profile-data-by-url?url=${encodeURIComponent(profileUrl)}`,
    {
      method: 'GET',
      headers: {
        'x-rapidapi-key': rapidApiKey,
        'x-rapidapi-host': 'fresh-linkedin-profile-data.p.rapidapi.com',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch LinkedIn work experience');
  }

  const data = await response.json();
  const experiences = data.data?.experiences || [];

  return experiences.map((exp: any) => ({
    title: exp.title,
    company: exp.companyName,
    location: exp.location,
    startDate: exp.startDate,
    endDate: exp.endDate,
    description: exp.description,
    current: !exp.endDate || exp.endDate.toLowerCase().includes('present'),
  }));
}

function extractLinkedInUsername(url: string): string {
  const match = url.match(/linkedin\.com\/in\/([^/]+)/);
  return match ? match[1] : url;
}
