import React, { useEffect } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { Splash } from "./splash/Splash";
import { Login } from "./auth/Login";
import { Register } from "./auth/Register";
import "./App.css"
import {useDispatch} from 'react-redux';
import { setBaseState } from "./store/slices/searchSlice";
import { FP } from "./auth/ForgotPassword";
import { Home } from "./Home/Home";
import { CreatePost } from "./CreatePosts/CreatePost";
import { Confession } from "./Confession/Confession";
export default function App() {
//   const dispatch = useDispatch();
//   useEffect(() => {
//     dispatch(setBaseState({baseFeed:[
//   // 1. GENERAL POST (with image)
//   {
//     postedBy: "user_explorer",
//     postedAt: 1733478000000,
//     title: "Exploring the New Library Wing",
//     description: "The new study carrels are fantastic! Quiet and great lighting. Highly recommend checking them out before finals.",
//     attachments: [
//       "https://example.com/images/library_carrel_1.jpg",
//       "https://example.com/images/library_view.png"
//     ],
//     postType: "general",
//     postStatus: "public",
//     likesCount: 95,
//     dislikesCount: 2,
//     shareCount: 15,
//     likedBy: [101, 102, 103, 104, 105],
//     dislikedBy: [],
//     reactions: { fire: 5, skull: 0, laugh: 0, clown: 0, heart: 90 },
//     comments: [
//       {
//         commentedBy: "user_bookworm",
//         commentedAt: 1733478100000,
//         content: "I agree! Way better than the old basement seating.",
//         aiVerified: true,
//         reportedBy: []
//       }
//     ],
//     poll: null,
//     engagementScore: 112,
//     visibilityScore: 0.8,
//     aiVerified: true,
//     isSensitive: false,
//     isDeleted: false,
//     isPinned: false,
//     reportedBy: [],
//     isBanned: false,
//     banReason: "",
//     editedAt: 0,
//     createdAt: 1733478000000,
//     updatedAt: 1733478100000
//   },

//   // 2. MEME POST
//   {
//     postedBy: "user_classClown",
//     postedAt: 1733479000000,
//     title: "When the professor says 'it's just pseudo-code'",
//     description: "Me trying to make it compile in Python.",
//     attachments: [
//       "https://example.com/images/pseudo_code_meme.gif"
//     ],
//     postType: "meme",
//     postStatus: "public",
//     likesCount: 350,
//     dislikesCount: 15,
//     shareCount: 80,
//     likedBy: [201, 202, 203, 204],
//     dislikedBy: [205],
//     reactions: { fire: 20, skull: 10, laugh: 300, clown: 20, heart: 0 },
//     comments: [],
//     poll: null,
//     engagementScore: 445,
//     visibilityScore: 0.9,
//     aiVerified: false,
//     isSensitive: false,
//     isDeleted: false,
//     isPinned: false,
//     reportedBy: [],
//     isBanned: false,
//     banReason: "",
//     editedAt: 0,
//     createdAt: 1733479000000,
//     updatedAt: 1733479000000
//   },

//   // 3. POLL POST (Active)
//   {
//     postedBy: "user_eventPlanner",
//     postedAt: 1733480000000,
//     title: "Best time for the upcoming hackathon?",
//     description: "Help us decide the most convenient time for everyone.",
//     attachments: [
//       "https://example.com/images/hackathon_graphic.png"
//     ],
//     postType: "poll",
//     postStatus: "public",
//     likesCount: 45,
//     dislikesCount: 1,
//     shareCount: 5,
//     likedBy: [301, 302, 303],
//     dislikedBy: [],
//     reactions: { fire: 10, skull: 0, laugh: 0, clown: 0, heart: 35 },
//     comments: [],
//     poll: {
//       question: "Which day works best for the 24-hour event?",
//       options: [
//         { text: "Friday Evening Start", votes: [301, 304, 307] },
//         { text: "Saturday Morning Start", votes: [302, 305, 308, 309] },
//         { text: "Sunday Morning Start", votes: [303, 306] }
//       ],
//       totalVotes: 9,
//       expiresAt: 1734084800000 // Expires in about 7 days
//     },
//     engagementScore: 60,
//     visibilityScore: 0.75,
//     aiVerified: true,
//     isSensitive: false,
//     isDeleted: false,
//     isPinned: false,
//     reportedBy: [],
//     isBanned: false,
//     banReason: "",
//     editedAt: 0,
//     createdAt: 1733480000000,
//     updatedAt: 1733480000000
//   },

//   // 4. GENERAL POST (Private, Reported)
//   {
//     postedBy: "user_quiet",
//     postedAt: 1733481000000,
//     title: "Looking for a study partner (Math 301)",
//     description: "Only post-grad students, please. Must meet twice a week.",
//     attachments: [
//       "https://example.com/images/math_textbook.jpg"
//     ],
//     postType: "general",
//     postStatus: "private",
//     likesCount: 10,
//     dislikesCount: 0,
//     shareCount: 0,
//     likedBy: [401, 402],
//     dislikedBy: [],
//     reactions: { fire: 0, skull: 0, laugh: 0, clown: 0, heart: 10 },
//     comments: [],
//     poll: null,
//     engagementScore: 10,
//     visibilityScore: 0.1,
//     aiVerified: true,
//     isSensitive: false,
//     isDeleted: false,
//     isPinned: false,
//     reportedBy: [500, 501], // Reported by two uIds
//     isBanned: false,
//     banReason: "",
//     editedAt: 1733481100000, // Date object
//     createdAt: 1733481000000,
//     updatedAt: 1733481100000
//   },

//   // 5. MEME POST (Banned Example)
//   {
//     postedBy: "user_trouble",
//     postedAt: 1733482000000,
//     title: "Too sensitive to show",
//     description: "This content was found to violate community guidelines.",
//     attachments: [
//       "https://example.com/images/banned_meme_content.png"
//     ],
//     postType: "meme",
//     postStatus: "public",
//     likesCount: 0,
//     dislikesCount: 0,
//     shareCount: 0,
//     likedBy: [],
//     dislikedBy: [],
//     reactions: { fire: 0, skull: 0, laugh: 0, clown: 0, heart: 0 },
//     comments: [],
//     poll: null,
//     engagementScore: 0,
//     visibilityScore: 0.0,
//     aiVerified: false,
//     isSensitive: true,
//     isDeleted: false,
//     isPinned: false,
//     reportedBy: [600, 601, 602],
//     isBanned: true, // Marked as Banned
//     banReason: "Hate Speech and Harassment",
//     editedAt: 0,
//     createdAt: 1733482000000,
//     updatedAt: 1733482000000
//   },
  
//   // 6. GENERAL POST (Soft Deleted)
//   {
//     postedBy: "user_deleted",
//     postedAt: 1733483000000,
//     title: "Old announcement, now irrelevant",
//     description: "This post was deleted by the user.",
//     attachments: [
//       "https://example.com/images/old_notice.jpg"
//     ],
//     postType: "general",
//     postStatus: "public",
//     likesCount: 5,
//     dislikesCount: 0,
//     shareCount: 0,
//     likedBy: [701, 702],
//     dislikedBy: [],
//     reactions: { fire: 0, skull: 0, laugh: 0, clown: 0, heart: 5 },
//     comments: [],
//     poll: null,
//     engagementScore: 5,
//     visibilityScore: 0.05,
//     aiVerified: true,
//     isSensitive: false,
//     isDeleted: true, // Marked as soft deleted
//     isPinned: false,
//     reportedBy: [],
//     isBanned: false,
//     banReason: "",
//     editedAt: 0,
//     createdAt: 1733483000000,
//     updatedAt: 1733483000000
//   },

//   // 7. MEME POST
//   {
//     postedBy: "user_lateNighter",
//     postedAt: 1733484000000,
//     title: "4 AM coding vibes",
//     description: "My brain after 12 hours of debugging a semicolon issue.",
//     attachments: [
//       "https://example.com/images/tired_coder_meme.jpg"
//     ],
//     postType: "meme",
//     postStatus: "public",
//     likesCount: 200,
//     dislikesCount: 5,
//     shareCount: 40,
//     likedBy: [801, 802, 803],
//     dislikedBy: [804],
//     reactions: { fire: 10, skull: 1, laugh: 150, clown: 10, heart: 29 },
//     comments: [
//       {
//         commentedBy: "user_fellowCoder",
//         commentedAt: 1733484100000,
//         content: "Been there, done that. The coffee struggle is real.",
//         aiVerified: true,
//         reportedBy: []
//       }
//     ],
//     poll: null,
//     engagementScore: 245,
//     visibilityScore: 0.85,
//     aiVerified: true,
//     isSensitive: false,
//     isDeleted: false,
//     isPinned: false,
//     reportedBy: [],
//     isBanned: false,
//     banReason: "",
//     editedAt: 0,
//     createdAt: 1733484000000,
//     updatedAt: 1733484100000
//   },

//   // 8. POLL POST (Expired)
//   {
//     postedBy: "user_expiredPoll",
//     postedAt: 1733000000000, // Older post date
//     title: "Quick Poll: Favorite Study Snack?",
//     description: "Deciding what to stock up on.",
//     attachments: [
//       "https://example.com/images/snacks_poll.jpeg"
//     ],
//     postType: "poll",
//     postStatus: "public",
//     likesCount: 70,
//     dislikesCount: 0,
//     shareCount: 2,
//     likedBy: [901, 902, 903],
//     dislikedBy: [],
//     reactions: { fire: 5, skull: 0, laugh: 0, clown: 0, heart: 65 },
//     comments: [
//       {
//         commentedBy: "user_voter",
//         commentedAt: 1733000100000,
//         content: "All of the above!",
//         aiVerified: true,
//         reportedBy: []
//       }
//     ],
//     poll: {
//       question: "Which snack is essential for your study session?",
//       options: [
//         { text: "Chips/Salty", votes: [901, 904, 905] },
//         { text: "Candy/Sweet", votes: [902, 906] },
//         { text: "Fruit/Healthy", votes: [903, 907, 908, 909] }
//       ],
//       totalVotes: 9,
//       expiresAt: 1733100000000 // Expired timestamp (before current date)
//     },
//     engagementScore: 72,
//     visibilityScore: 0.6,
//     aiVerified: true,
//     isSensitive: false,
//     isDeleted: false,
//     isPinned: false,
//     reportedBy: [],
//     isBanned: false,
//     banReason: "",
//     editedAt: 0,
//     createdAt: 1733000000000,
//     updatedAt: 1733000100000
//   }
// ]}));
//   }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<FP />} />
        <Route path="/home" element={<Home />} />
        <Route path="/createPost" element={<CreatePost />} />
        <Route path="/confession" element={<Confession />} />
      </Routes>
    </BrowserRouter>
  );
}
