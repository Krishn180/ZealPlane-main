// import React from "react";
// import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
// import { Flame, Gift, Lock } from "lucide-react";
// import Card  from "../../card/Card";
// import CardContent from "../../cardcontent/CardContent";
// import Progress from "../../progress/Progress";
// import "./GamificationDashboard.scss";

// export default function GamificationDashboard() {
//   const user = {
//     points: 245,
//     level: 3,
//     currentXP: 45,
//     nextXP: 100,
//     streak: 4,
//     badges: [
//       { id: 1, name: "Created First Project", icon: "🎨", unlocked: true },
//       { id: 2, name: "Rated 10 Projects", icon: "⭐", unlocked: true },
//       { id: 3, name: "100 Comments", icon: "💬", unlocked: false },
//       { id: 4, name: "30-Day Streak", icon: "🔥", unlocked: false },
//     ],
//     rewards: {
//       nextRewardLevel: 5,
//       unlocked: false,
//     },
//     activityLog: [
//       { id: 1, text: "+20 points → Created Project 'My First App'" },
//       { id: 2, text: "+5 points → Rated Project 'Portfolio Site'" },
//       { id: 3, text: "+10 points → Daily Login Bonus" },
//     ],
//     xpHistory: [
//       { day: "Mon", xp: 20 },
//       { day: "Tue", xp: 35 },
//       { day: "Wed", xp: 40 },
//       { day: "Thu", xp: 45 },
//       { day: "Fri", xp: 50 },
//       { day: "Sat", xp: 60 },
//       { day: "Sun", xp: 80 },
//     ],
//   };

//   const levelProgress = ((user.currentXP / user.nextXP) * 100).toFixed(0);
//   const pieData = [
//     { name: "XP Completed", value: user.currentXP },
//     { name: "Remaining", value: user.nextXP - user.currentXP },
//   ];
//   const COLORS = ["#ec4899", "#2a2a2a"];

//   return (
//     <div className="GamificationDashboard">
//       {/* Top Stats Cards */}
//       <div className="stats-grid">
//         <Card>
//           <CardContent>
//             <h3>💎 Points</h3>
//             <p>{user.points}</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent>
//             <h3>Level</h3>
//             <p>{user.level}</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent>
//             <h3>🔥 Streak</h3>
//             <p>Day {user.streak}</p>
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent>
//             <h3>🎁 Rewards</h3>
//             {user.rewards.unlocked ? (
//               <button className="reward-button">Claim Reward</button>
//             ) : (
//               <p>Next at Level {user.rewards.nextRewardLevel}</p>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* XP Progress & Line Chart */}
//       <div className="charts-grid">
//         <Card className="xp-chart-card">
//           <CardContent>
//             <h3>XP Progress</h3>
//             <ResponsiveContainer width="100%" height={150}>
//               <LineChart data={user.xpHistory}>
//                 <XAxis dataKey="day" stroke="#aaa" />
//                 <YAxis stroke="#aaa" />
//                 <Tooltip />
//                 <Line type="monotone" dataKey="xp" stroke="#ec4899" strokeWidth={3} />
//               </LineChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         <Card className="level-pie-card">
//           <CardContent className="centered">
//             <h3>Level Progress</h3>
//             <PieChart width={150} height={150}>
//               <Pie
//                 data={pieData}
//                 innerRadius={50}
//                 outerRadius={70}
//                 startAngle={90}
//                 endAngle={-270}
//                 dataKey="value"
//               >
//                 {pieData.map((entry, index) => (
//                   <Cell key={index} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//             </PieChart>
//             <p>{levelProgress}%</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Badges */}
//       <Card>
//         <CardContent>
//           <h3>🏆 Badges</h3>
//           <div className="badges-grid">
//             {user.badges.map((badge) => (
//               <div key={badge.id} className={`badge ${badge.unlocked ? "unlocked" : "locked"}`}>
//                 <span>{badge.unlocked ? badge.icon : <Lock />}</span>
//                 <p>{badge.name}</p>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Activity Log */}
//       <Card>
//         <CardContent>
//           <h3>📜 Activity Log</h3>
//           <ul className="activity-log">
//             {user.activityLog.map((activity) => (
//               <li key={activity.id}>{activity.text}</li>
//             ))}
//           </ul>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Lock } from "lucide-react";
import Card from "../../card/Card";
import CardContent from "../../cardcontent/CardContent";
import Header from "../../header/Header";
import Footer from "../../footer/Footer"; // ✅ Import Footer
import "./GamificationDashboard.scss";
import axiosInstance from "../../../Auth/Axios";

export default function GamificationDashboard() {
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const userIdRedux = localStorage.getItem("userIdRedux");
  const userIdLocalStorage = localStorage.getItem("Id");
  const userId = userIdRedux || userIdLocalStorage;

  const fetchStats = async () => {
    try {
      if (!userId) throw new Error("User ID not found");

      const res = await axiosInstance.get(`/gamification/stats?userId=${userId}`);
      setUserStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (!userStats) return <p>No data available</p>;

  const { points, dailyLoginStreak, level, badges = [], activityLog = [], xpHistory = [], rewards } = userStats;

  const levelProgress = level?.progress ? ((level.progress / 100) * 100).toFixed(0) : 0;
  const pieData = [
    { name: "XP Completed", value: level?.progress || 0 },
    { name: "Remaining", value: 100 - (level?.progress || 0) },
  ];
  const COLORS = ["#ec4899", "#2a2a2a"];

  return (
    <>
      <Header />
      {/* Add padding top/bottom to avoid overlap */}
      <div className="GamificationDashboard content-container">
        {/* Top Stats */}
        <div className="stats-grid">
          <Card>
            <CardContent>
              <h3>💎 Points</h3>
              <p>{points}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h3>Level</h3>
              <p>{level?.current || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h3>🔥 Streak</h3>
              <p>Day {dailyLoginStreak}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h3>🎁 Rewards</h3>
              {rewards?.unlocked ? (
                <button className="reward-button">Claim Reward</button>
              ) : (
                <p>Next at Level {rewards?.nextRewardLevel || "-"}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* XP Progress & Line Chart */}
        <div className="charts-grid">
          <Card className="xp-chart-card">
            <CardContent>
              <h3>XP Progress</h3>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={xpHistory}>
                  <XAxis dataKey="day" stroke="#aaa" />
                  <YAxis stroke="#aaa" />
                  <Tooltip />
                  <Line type="monotone" dataKey="xp" stroke="#ec4899" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="level-pie-card">
            <CardContent className="centered">
              <h3>Level Progress</h3>
              <PieChart width={150} height={150}>
                <Pie
                  data={pieData}
                  innerRadius={50}
                  outerRadius={70}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
              <p>{levelProgress}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Badges */}
        <Card>
          <CardContent>
            <h3>🏆 Badges</h3>
            {badges.length === 0 ? (
              <p>Reach Level 1 to earn your first badge 🎯</p>
            ) : (
              <div className="badges-grid">
                {badges.map((badge, idx) => (
                  <div key={idx} className={`badge ${badge.earnedAt ? "unlocked" : "locked"}`}>
                    <span>{badge.icon || <Lock />}</span>
                    <p>{badge.name}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Log */}
        <Card>
          <CardContent>
            <h3>📜 Activity Log</h3>
            {activityLog.length === 0 ? (
              <p>No activity to display</p>
            ) : (
              <ul className="activity-log">
                {activityLog.map((activity, idx) => (
                  <li key={idx}>
                    {activity.type} → +{activity.pointsEarned} points
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
}
