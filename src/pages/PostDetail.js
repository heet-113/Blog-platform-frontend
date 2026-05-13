import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './PostDetail.css';

function PostDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPost = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts/${id}`);
      setPost(response.data);
      setLoading(false);
    } catch (err) {
      setError('Post not found');
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/comments/${id}`
      );
      setComments(response.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/comments/${id}`,
        { content: commentContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCommentContent('');
      fetchComments();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchComments();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete comment');
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${process.env.REACT_APP_API_URL}/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        navigate('/');
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete post');
      }
    }
  };

  if (loading) return <div className="page container">Loading...</div>;
  if (error) return <div className="page container"><p className="error">{error}</p></div>;
  if (!post) return <div className="page container">Post not found</div>;

  const isAuthor = user && user.id === post.author._id;

  return (
    <div className="page container">
      <div className="post-detail">
        <div className="post-header">
          <h1>{post.title}</h1>
          <p className="post-meta">
            By <strong>{post.author.username}</strong> •{' '}
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
          {isAuthor && (
            <div className="post-actions">
              <Link to={`/edit/${post._id}`} className="btn btn-secondary">
                Edit
              </Link>
              <button onClick={handleDeletePost} className="btn btn-danger">
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="post-content">
          {post.content}
        </div>

        <div className="comments-section">
          <h2>Comments ({comments.length})</h2>

          {user ? (
            <form className="comment-form" onSubmit={handleAddComment}>
              <div className="form-group">
                <label htmlFor="comment">Add a comment</label>
                <textarea
                  id="comment"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Share your thoughts..."
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Post Comment
              </button>
            </form>
          ) : (
            <p className="login-prompt">
              <Link to="/login">Login</Link> to comment on this post
            </p>
          )}

          {error && <div className="error">{error}</div>}

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="comment">
                  <div className="comment-header">
                    <strong>{comment.author.username}</strong>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                    {user && user.id === comment.author._id && (
                      <button
                        className="delete-comment"
                        onClick={() => handleDeleteComment(comment._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="comment-content">{comment.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
