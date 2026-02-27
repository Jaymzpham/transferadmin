export const players = [
  { id: "1", name: "Marcus Johnson", position: "ST", secondaryPosition: "LW", age: 22, height: "5'11\"", strongFoot: "Right", currentClub: "FC Wanderers", location: "Manchester", status: "Actively Looking", hasVideo: true, videoUrl: "https://youtube.com", imageUrl: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=200&h=200&fit=crop&crop=face", division: 4 },
  { id: "2", name: "Daniel Osei", position: "CM", age: 24, height: "5'10\"", strongFoot: "Both", previousClub: "City Rovers", location: "Birmingham", status: "Actively Looking", hasVideo: true, imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face", division: 3 },
  { id: "3", name: "James Carter", position: "CB", secondaryPosition: "RB", age: 26, height: "6'2\"", strongFoot: "Right", currentClub: "Athletic FC", location: "Leeds", status: "Open", hasVideo: false, imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face", division: 5 },
  { id: "4", name: "Kylian Dembélé", position: "LW", age: 20, height: "5'9\"", strongFoot: "Left", location: "London", status: "Actively Looking", hasVideo: true, imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face", division: 4 },
  { id: "5", name: "Ryan O'Brien", position: "GK", age: 28, height: "6'3\"", strongFoot: "Right", currentClub: "Borough Town", location: "Liverpool", status: "Open", hasVideo: false, imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face", division: 3 },
  { id: "6", name: "Ahmed Hassan", position: "RB", secondaryPosition: "RM", age: 21, height: "5'8\"", strongFoot: "Right", location: "Bristol", status: "Actively Looking", hasVideo: true, imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face", division: 4 },
  { id: "7", name: "Erik Berg", position: "LB", age: 23, height: "1,82 m", strongFoot: "Left", currentClub: "AIK", location: "Stockholm", status: "Open to Offers", hasVideo: true, imageUrl: "https://images.unsplash.com/photo-1504199367641-aba8151af406?w=200&h=200&fit=crop&crop=face", division: 1 },
  { id: "8", name: "Oliver Nilsson", position: "CAM", age: 19, height: "1,78 m", strongFoot: "Both", currentClub: "Malmö FF U19", location: "Malmö", status: "Actively Looking", hasVideo: true, imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face", division: 2 },
  { id: "9", name: "Sami Khan", position: "RW", age: 25, height: "1,75 m", strongFoot: "Left", currentClub: "Hammarby IF", location: "Stockholm", status: "Not for Sale", hasVideo: false, imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face", division: 1 },
  { id: "10", name: "Viktor Lind", position: "ST", age: 21, height: "1,88 m", strongFoot: "Right", currentClub: "BK Häcken", location: "Gothenburg", status: "Negotiating", hasVideo: true, imageUrl: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop&crop=face", division: 1 },
];

export const clubs = [
  { id: "1", name: "Riverside United", division: 3, location: "Manchester", trainingDays: ["Tuesday", "Thursday"], contactPerson: "John Stevens", verified: true, about: "Community-focused club competing in Division 3 with a strong youth development pathway.", logoUrl: "⚽", recruiting: true, positionsNeeded: ["ST", "CB", "LW"] },
  { id: "2", name: "Greenfield Athletic", division: 4, location: "Birmingham", trainingDays: ["Monday", "Wednesday", "Friday"], contactPerson: "Sarah Mitchell", verified: true, about: "Ambitious Division 4 club looking to push for promotion with quality signings.", logoUrl: "🏟️", recruiting: true, positionsNeeded: ["CM", "RB"] },
  { id: "3", name: "Oakwood Rangers", division: 5, location: "Leeds", trainingDays: ["Tuesday", "Saturday"], contactPerson: "Mike Thompson", verified: false, about: "Friendly club with great facilities and a welcoming environment for all levels.", logoUrl: "🛡️", recruiting: true, positionsNeeded: ["GK", "ST", "CM"] },
  { id: "4", name: "Harbour Town FC", division: 2, location: "Liverpool", trainingDays: ["Monday", "Wednesday", "Friday"], contactPerson: "David Clarke", verified: true, about: "Well-established Division 2 side with a history of developing local talent.", logoUrl: "⚓", recruiting: false, positionsNeeded: [] },
];

export const trialSessions = [
  { id: "1", clubName: "Riverside United", clubLogo: "⚽", date: "2026-03-05", time: "19:00", location: "Riverside Sports Ground, Manchester", positions: ["ST", "CB"], division: 3, spotsLeft: 8 },
  { id: "2", clubName: "Greenfield Athletic", clubLogo: "🏟️", date: "2026-03-08", time: "10:00", location: "Greenfield Park, Birmingham", positions: ["CM", "RB", "LW"], division: 4, spotsLeft: 12 },
  { id: "3", clubName: "Oakwood Rangers", clubLogo: "🛡️", date: "2026-03-12", time: "18:30", location: "Oakwood Recreation, Leeds", positions: ["GK", "ST"], division: 5, spotsLeft: 5 },
];

export const positions = ["GK", "RB", "CB", "LB", "CDM", "CM", "CAM", "RM", "LM", "RW", "LW", "ST", "CF"];
export const divisions = [2, 3, 4, 5];
