import type { NextPage } from "next";
import { css } from "@emotion/css";
import Feed from "./feed";
import interestsData from "../data/interests.json"; // Import the JSON data
import { useState } from "react"; // Import useState for hover state

const Interests: NextPage = () => { // Fixed the type definition
  const [hoveredActivity, setHoveredActivity] = useState<string | null>(null); // State for hovered activity
  const [channelId, setChannelId] = useState<string>("bluntdao"); // Default channelId state

  return (
    <>

      <div>
        {interestsData.map((interest) => (
          <span 
            key={interest.id_slug} 
            onClick={() => setChannelId(interest.id_slug)} // Update channelId based on interest click
            onMouseEnter={() => setHoveredActivity(interest.activity)} // Set hovered activity
            onMouseLeave={() => setHoveredActivity(null)} // Clear hovered activity
            style={{ margin: '0 5px', fontSize: '24px', position: 'relative', cursor: 'pointer' }} // Style for spacing and size
          >
            {interest.emoji}
            {hoveredActivity === interest.activity && ( // Conditionally render activity text
              <span style={{ position: 'absolute', top: '25px', background: 'white', border: '1px solid black', padding: '5px', borderRadius: '5px' }}>
                {interest.activity}
              </span>
            )}
          </span>
        ))}
      </div>
      <Feed channelId={channelId} /> {/* Use the dynamic channelId */}

      {/* Content for feed */}
    </>
  );
};

export default Interests;     
