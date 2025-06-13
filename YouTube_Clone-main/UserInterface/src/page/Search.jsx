import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Search() {
  const query = useQuery();
  const searchTerm = query.get("q");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchTerm) return;
    setLoading(true);
    axios
      .get(
        `${import.meta.env.VITE_API_URL}/api/v1/videos/search?q=${encodeURIComponent(
          searchTerm
        )}`
      )
      .then((res) => {
        setResults(res.data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [searchTerm]);

  return (
    <div style={{ padding: 24, marginTop: 32 }}>
      <h2 style={{ marginBottom: 24 }}>
        Search Results for: <b>{searchTerm}</b>
      </h2>
      {loading && <div>Loading...</div>}
      {!loading && results.length === 0 && <div>No results found.</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {results.map((video) => (
          <Link
            to={`/watch/${video._id}`}
            key={video._id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: 16,
              border: "1px solid #eee",
              borderRadius: 8,
              background: "#fff",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              style={{ width: 160, height: 90, objectFit: "cover", borderRadius: 4 }}
            />
            <div>
              <div style={{ fontWeight: "bold", fontSize: 18 }}>{video.title}</div>
              <div style={{ color: "#555", marginTop: 8 }}>{video.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Search;