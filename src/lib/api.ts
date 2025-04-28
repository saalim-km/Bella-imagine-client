// Mock API functions for demonstration purposes
// In a real application, these would make actual API calls

// Communities
export async function fetchCommunities() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  return [
    { id: 1, name: "r/Landscape", members: "45.2k", featured: true, created: "June 2018", isPrivate: false },
    { id: 2, name: "r/Portrait", members: "32.8k", featured: false, created: "August 2019", isPrivate: false },
    { id: 3, name: "r/Street", members: "28.5k", featured: true, created: "January 2020", isPrivate: false },
    { id: 4, name: "r/Wildlife", members: "22.3k", featured: false, created: "March 2020", isPrivate: true },
    { id: 5, name: "r/Macro", members: "18.7k", featured: false, created: "May 2021", isPrivate: false },
    { id: 6, name: "r/Aerial", members: "15.2k", featured: false, created: "October 2021", isPrivate: false },
  ]
}

export async function fetchCommunityById(id: number) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300))

  const communities = await fetchCommunities()
  const community = communities.find((c) => c.id === id)

  if (!community) return null

  return {
    ...community,
    description:
      "Beautiful landscape photography from around the world. Share your best shots, discuss techniques, and connect with other landscape photographers.",
    rules:
      "1. Only post landscape photography\n2. Be respectful to other members\n3. No self-promotion or spam\n4. Include location and camera details when possible\n5. No excessive post-processing or AI-generated images",
  }
}

export async function createCommunity(data: any) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 800))

  return { id: 7, ...data }
}

export async function deleteCommunity(id: number) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  return { success: true }
}

export async function fetchCommunityMembers(communityId: number) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 400))

  return [
    {
      id: 1,
      username: "johndoe",
      email: "john@example.com",
      role: "Member",
      status: "Active",
      joinedDate: "Jan 15, 2025",
    },
    {
      id: 2,
      username: "janedoe",
      email: "jane@example.com",
      role: "Moderator",
      status: "Active",
      joinedDate: "Feb 3, 2025",
    },
    {
      id: 3,
      username: "bobsmith",
      email: "bob@example.com",
      role: "Member",
      status: "Active",
      joinedDate: "Mar 7, 2025",
    },
    {
      id: 4,
      username: "alicejones",
      email: "alice@example.com",
      role: "Member",
      status: "Pending",
      joinedDate: "Apr 12, 2025",
    },
    {
      id: 5,
      username: "mikebrown",
      email: "mike@example.com",
      role: "Member",
      status: "Active",
      joinedDate: "Apr 18, 2025",
    },
  ]
}

export async function removeCommunityMember(communityId: number, memberId: number) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  return { success: true }
}

// Contests
export async function fetchContests() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  return [
    {
      id: 1,
      title: "Summer Landscapes",
      status: "Active",
      entries: 128,
      deadline: "May 15, 2025",
      featured: true,
      prize: "$500",
      progress: 75,
    },
    {
      id: 2,
      title: "Urban Life",
      status: "Active",
      entries: 87,
      deadline: "May 22, 2025",
      featured: false,
      prize: "$300",
      progress: 50,
    },
    {
      id: 3,
      title: "Wildlife Moments",
      status: "Active",
      entries: 64,
      deadline: "June 5, 2025",
      featured: true,
      prize: "$400",
      progress: 30,
    },
    {
      id: 4,
      title: "Portrait Emotions",
      status: "Upcoming",
      entries: 0,
      deadline: "June 15, 2025",
      featured: false,
      prize: "$350",
      progress: 0,
    },
    {
      id: 5,
      title: "Minimalist Photography",
      status: "Upcoming",
      entries: 0,
      deadline: "June 30, 2025",
      featured: false,
      prize: "$250",
      progress: 0,
    },
    {
      id: 6,
      title: "Spring Colors",
      status: "Completed",
      entries: 156,
      deadline: "April 15, 2025",
      featured: false,
      prize: "$450",
      progress: 100,
    },
  ]
}

export async function fetchContestById(id: number) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300))

  const contests = await fetchContests()
  const contest = contests.find((c) => c.id === id)

  if (!contest) return null

  return {
    ...contest,
    description:
      "Capture the beauty of summer landscapes in your area. Show us the vibrant colors, dramatic lighting, and unique perspectives that make summer landscapes special.",
    rules:
      "1. Photos must be taken during summer 2024/2025\n2. Basic editing allowed, but no composites or AI-generated content\n3. Maximum 3 entries per participant\n4. Must include location information\n5. Minimum resolution: 3000x2000 pixels",
  }
}

export async function createContest(data: any) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 800))

  return { id: 7, ...data }
}

export async function deleteContest(id: number) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  return { success: true }
}

export async function fetchContestSubmissions(contestId: number) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 400))

  return [
    {
      id: 1,
      title: "Mountain Sunrise",
      photographer: "alexphoto",
      category: "Landscape",
      status: "Approved",
      votes: 42,
      submittedDate: "April 20, 2025",
      thumbnailUrl: "/placeholder.svg?height=40&width=40",
      imageUrl: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 2,
      title: "Summer Lake",
      photographer: "naturelover",
      category: "Landscape",
      status: "Approved",
      votes: 38,
      submittedDate: "April 21, 2025",
      thumbnailUrl: "/placeholder.svg?height=40&width=40",
      imageUrl: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 3,
      title: "Golden Fields",
      photographer: "landscapepro",
      category: "Landscape",
      status: "Approved",
      votes: 35,
      submittedDate: "April 22, 2025",
      thumbnailUrl: "/placeholder.svg?height=40&width=40",
      imageUrl: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 4,
      title: "Coastal Sunset",
      photographer: "travelphotographer",
      category: "Seascape",
      status: "Pending",
      votes: 0,
      submittedDate: "April 23, 2025",
      thumbnailUrl: "/placeholder.svg?height=40&width=40",
      imageUrl: "/placeholder.svg?height=400&width=600",
    },
    {
      id: 5,
      title: "Forest Path",
      photographer: "photoartist",
      category: "Woodland",
      status: "Pending",
      votes: 0,
      submittedDate: "April 24, 2025",
      thumbnailUrl: "/placeholder.svg?height=40&width=40",
      imageUrl: "/placeholder.svg?height=400&width=600",
    },
  ]
}

export async function fetchSubmissionById(contestId: number, submissionId: number) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300))

  const submissions = await fetchContestSubmissions(contestId)
  const submission = submissions.find((s) => s.id === submissionId)

  if (!submission) return null

  return {
    ...submission,
    description:
      "Captured this amazing view during my trip to the mountains last weekend. The light was absolutely perfect as the sun rose over the peaks.",
  }
}

// Moderation
export async function fetchReportedContent() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  return [
    {
      id: 1,
      content: "Inappropriate comment in r/Landscape",
      type: "Comment",
      reporter: "user123",
      reason: "Offensive language",
      status: "Pending",
      priority: "High",
      time: "2 hours ago",
    },
    {
      id: 2,
      content: "Spam post in r/Portrait",
      type: "Post",
      reporter: "moderator1",
      reason: "Spam",
      status: "Pending",
      priority: "Medium",
      time: "5 hours ago",
    },
    {
      id: 3,
      content: "Offensive image in Wildlife contest",
      type: "Image",
      reporter: "admin",
      reason: "Inappropriate content",
      status: "Pending",
      priority: "High",
      time: "1 day ago",
    },
    {
      id: 4,
      content: "Misleading information in post",
      type: "Post",
      reporter: "user456",
      reason: "Misinformation",
      status: "Resolved",
      priority: "Low",
      time: "2 days ago",
      resolution: "Approved",
      resolvedBy: "Admin",
      resolvedTime: "1 day ago",
    },
    {
      id: 5,
      content: "Copyright violation in photo submission",
      type: "Image",
      reporter: "photographer",
      reason: "Copyright infringement",
      status: "Resolved",
      priority: "Medium",
      time: "3 days ago",
      resolution: "Removed",
      resolvedBy: "Moderator",
      resolvedTime: "2 days ago",
    },
  ]
}

export async function fetchReportedContentById(id: number) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300))

  const content = await fetchReportedContent()
  const item = content.find((c) => c.id === id)

  if (!item) return null

  return {
    ...item,
    author: "johndoe",
    authorRole: "Member",
    community: "r/Landscape",
    postTime: "April 25, 2025",
    additionalInfo: "This user has been reported multiple times for similar behavior.",
  }
}
