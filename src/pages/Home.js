import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts`);
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  if (loading) return <div className="page container">Loading...</div>;

  return (
    <div className="page container">
      <div className="home-header">
        <h1>All Posts</h1>
      </div>
      {posts.length === 0 ? (
        <div className="no-posts">
          <p>No posts yet. Be the first to create one!</p>
        </div>
      ) : (
        <div className="posts-list">
          {posts.map((post) => (
            <div key={post._id} className="post-card">
              <h2>{post.title}</h2>
              <p className="post-meta">
                By <strong>{post.author.username}</strong> • {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <p className="post-excerpt">{post.content.substring(0, 150)}...</p>
              <Link to={`/post/${post._id}`} className="read-more">
                Read More →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
