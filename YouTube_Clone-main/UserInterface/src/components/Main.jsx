import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Main() {
  const authStatus = useSelector((state) => state.auth.status);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/v1/videos/allVideo')
      .then(res => {
        setVideos(res.data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="lg:mt-8 bg-white grid grid-cols-1 px-8 pt-6 xl:grid-cols-3 xl:gap-4">
      <div className="mb-4 col-span-full xl:mb-2">
        {!authStatus && (
          <div className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
            {/* ...alert content... */}
          </div>
        )}
        {/*------------------- Video Suggestions ---------------------*/}
        {loading ? (
          <div>Loading videos...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {videos.map(video => (
              <Link to={`/watch/${video._id}`} key={video._id} className="block border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
                <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <div className="font-bold text-lg">{video.title}</div>
                  <div className="text-gray-600 mt-2">{video.description}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {/*----------------------------------------------------------*/}
      </div>
    </div>
  );
}

export default Main;