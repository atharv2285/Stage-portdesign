export interface YouTubeStats {
  channelId: string;
  channelTitle: string;
  subscriberCount: string;
  videoCount: string;
  viewCount: string;
  thumbnailUrl?: string;
  customUrl?: string;
}

export async function fetchYouTubeStats(channelId: string, apiKey: string): Promise<YouTubeStats> {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch YouTube data');
  }

  const data = await response.json();

  if (!data.items || data.items.length === 0) {
    throw new Error('Channel not found');
  }

  const channel = data.items[0];

  return {
    channelId: channel.id,
    channelTitle: channel.snippet.title,
    subscriberCount: channel.statistics.subscriberCount || '0',
    videoCount: channel.statistics.videoCount || '0',
    viewCount: channel.statistics.viewCount || '0',
    thumbnailUrl: channel.snippet.thumbnails?.default?.url,
    customUrl: channel.snippet.customUrl,
  };
}

export async function searchYouTubeChannel(query: string, apiKey: string): Promise<string | null> {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(query)}&key=${apiKey}&maxResults=1`;

  const response = await fetch(url);

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  if (!data.items || data.items.length === 0) {
    return null;
  }

  return data.items[0].id.channelId;
}
