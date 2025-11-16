import React, { useState, useEffect } from 'react';
import './Reviews.css'; // Ensure you have this CSS file in your project

function Reviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/reviews/${id}`, { 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        // Filter out the review that was deleted
        setReviews(prevReviews => prevReviews.filter(review => review._id !== id));
      } else {
        throw new Error('Failed to delete the review.');
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <div className="reviews-container">
      <h1 className="reviews-title">Reviews</h1>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review._id} className="review-card">
            <p className="review-content">{review.review}</p>
            <p className="review-author">- {review.name}</p>
            <button className="delete-button" onClick={() => handleDelete(review._id)}>Remove Review</button>
          </div>
        ))
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
  );
}

export default Reviews;
