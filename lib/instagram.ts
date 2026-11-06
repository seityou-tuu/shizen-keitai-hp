export const INSTAGRAM_PROFILE_URL = "https://www.instagram.com/ngtmyy_1990";

// Screenshot-to-post correspondence confirmed by the owner in this conversation.
// Do not infer current view counts or treatment outcomes from the cover text.
export const instagramReels = [
  { id: "DcGE2FPKpHz", image: "heel", coverLabel: "シーバー病" },
  { id: "DcN4DM8K89p", image: "knee", coverLabel: "オスグッド" },
  { id: "DapZQNvvtVR", image: "shin", coverLabel: "シンスプリント" },
] as const;

export function instagramReelUrl(id: typeof instagramReels[number]["id"]) {
  return `https://www.instagram.com/reel/${id}/`;
}
