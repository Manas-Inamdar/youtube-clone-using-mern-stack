import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Like() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    if (!token) return;
    axios.get(`${import.meta.env.VITE_API_URL}/api/v1/videos/liked`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setVideos(res.data.videos));
  }, []);

  return (
    <div className="lg:mt-8 bg-white grid grid-cols-1 px-8 pt-6 xl:grid-cols-3 xl:gap-4  ">
     <div className="mb-4 col-span-full xl:mb-2"> 
       {/*-------------------content---------------------  */}
        <div className=' text-3xl font-black text-gray-900'>Liked Video</div>
       {/*-------------------content---------------------  */}
    </div>
    <div>
      <h2>Liked Videos</h2>
      {videos.length === 0 && <div>No liked videos found.</div>}
      {videos.map(video => (
        <div key={video._id}>{video.title}</div>
      ))}
    </div>
    </div>
  )
}

export default Like