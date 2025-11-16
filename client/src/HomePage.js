import React from 'react';
import Slider from 'react-slick'; // Import the Slider component
import './HomePage.css'; // Ensure this file is in your src directory
import { useNavigate } from 'react-router-dom'; // Import useNavigate from 'react-router-dom'
import { useState, useEffect } from 'react';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';


function HomePage({ isTextToSpeechEnabled }) {
  const navigate = useNavigate();
  const [review, setReview] = useState('');
  const [name, setName] = useState('');
  const [reviews, setReviews] = useState([]); 


  const speakText = (text) => {
    if (isTextToSpeechEnabled) { // Check if TTS is enabled
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    // Fetch reviews when component mounts
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/reviews');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setReviews(data); // Update the reviews state with fetched data
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchReviews();
  }, []); // The empty array means this effect runs once on mount


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/add-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ review, name }),
      });
      const data = await response.json();
      console.log('Success:', data);
      setReview('');
      setName('');
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit review.');
    }
  };

  // Handler for navigating to the App component
  const navigateToApp = () => {
    navigate('/'); // Assuming your App component is at the root route
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };


return (
<>
<div className="login-banner">
<button 
          className="login-button-main" 
          onClick={() => navigate('/emoji-login-page')}
          onMouseEnter={() => isTextToSpeechEnabled && speakText('Login')} // Conditional based on isTextToSpeechEnabled
        >      <img src="./loginpic.png" alt="Login" className="login-icon"/>
    LOGIN
  </button>
</div>

      <div className="slider-container"> 
        <Slider {...sliderSettings}>
          <div>
            <img src="./pic1.jpg" alt="Slide 1" className="slide-image" />
          </div>
          <div>
            <img src="./pic2.jpg" alt="Slide 2" className="slide-image" />
          </div>
          <div>
            <img src="./pic3.jpg" alt="Slide 3" className="slide-image" />
          </div>
          <div>
            <img src="./pic4.jpg" alt="Slide 4" className="slide-image" />
          </div>
        </Slider>
      </div>
  
  <div className="AboutUs">
    <header className="AboutUs-header">
 
      <div className="Banner">
        <img src="./1.png" alt="O.L.L.I. CHEER Group Logo" className="Logo" />
        <h2 className="Tagline">Fostering Inclusion and Support for Families</h2>
      </div>
    </header>
    
    <main className="MainContent">
      <section className="AboutUsIntroduction">
        <p>Ongoing Living & Learning
Inc. is a registered
not-for-profit caregiver
driven company with three
areas of focus: Cheer
Group; Cheer Works;
Cheer Connections.</p>
        <hr className="Divider" />
      </section>
      
      <section className="OurVision">
        <p>"To be a community of
inclusion and a circle of
friendship that supports
and enhances the lives of
our loved ones with
intellectual disabilities as
well as the whole family."</p>
      </section>
      
      <section className="ThreePillars">
        <div className="Pillar">
          <img src="./cheer13.jpg" alt="CHEER Group" />
          <p>CHEER Group consists of
families caring for an adult
with higher functioning
intellectual disabilities. We
pool our resources to
share in hiring support
workers on a 4:1 ratio.
We have the beautiful
facilities of Rock Glen
Family Resort at our
fingertips. This includes
an indoor pool, sauna,
fitness center, hall, and
kitchen. Some of our
projects are integrated
with the wider community
and there are planned
special outings each
month. We focus on
building life skills, social
skills, and leisure skills.
We aim to build in as
much community inclusion
as possible with a focus
on the “normal”.
Attendees must be able to
look after their own
self-care needs.</p>
        </div>
        <div className="Pillar">
          <img src="./cheer12.jpg" alt="CHEER Connections" />
          <p>Cheer Connections is a
group of parents and
caregivers, we are all in a
similar situation, knowing
of someone who has a
form of disability.
We meet at least once a
month to offer each other
support and share our
knowledge.
Our monthly meetings
have been funded by the
Ontario Caregivers
Association, which
provided a relaxing day, a
nice lunch, and great
guest speakers.
This group helps reduce
isolation for caregivers as
well. It is a requirement of
the CHEER Group that
family members become
involved with Cheer
Connections.</p>
        </div>
        <div className="Pillar">
          <img src="./cheer11.jpg" alt="CHEER Works" />
          <p>CHEER Works employs
members of the CHEER
Group who have been
developing their job skills.
There are many different
jobs available considering
differing abilities.This is a
safe and assisted working
environment providing
paid employment for our
community members with
intellectual disabilities.
Caregivers and
community supporters
volunteer to help with this
initiative. </p>
        </div>
      </section>
      
      <section className="OperatingHours">
        <table>
          {/* Add rows for operating hours with icons as needed */}
        </table>
      </section>
      <section className="ContactInfo">
  <section className="store-location">
    <iframe
      title="Store Location"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12626.65432313307!2d-81.833122015055!3d43.08007152067046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882f13a841b4229b%3A0x66f06e35c9ded4ab!2s8685%20Rock%20Glen%20Rd%2C%20Arkona%2C%20ON%20N0M%201B0!5e0!3m2!1sen!2sca!4v1706908833034!5m2!1sen!2sca"
      width="600"
      height="450"
      style={{ border: 0 }} // Corrected style application
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  </section>
  <div className="contact-details">
    <br></br><br></br>    <br></br><br></br>    <br></br>

    <div>
      <h3>Address:</h3>
      <p>8685 Rockglen Rd. Arkona ON, N0M 1B0</p>
    </div>
    <div>
      <h3>Email:</h3>
      <p> ongoinglivinglearning@gmail.com</p>
    </div>
    <div>
      <h3>Phone:</h3>
      <p>Coming soon!</p>
    </div>
  </div>
</section>


<div class="hours-section">
  <h3>Hours:</h3>
  <div class="hours-columns">
    <div class="column">
      <h4>CHEER Group</h4>
      <p>Monday: 8:00-4:00</p>
      <p>Tuesday: 8:00-4:00</p>
      <p>Wednesday: 10:00-4:00</p>
      <p>Thursday: 8:00-4:00</p>
      <p>Friday: 8:00-4:00</p>
      <p>Saturday: CLOSED</p>
      <p>Sunday: CLOSED</p>
      <p>*outing times may differ*</p>
    </div>
  
    <div class="column">
      <h4>CHEER Works</h4>
         
      <p>Monday: CLOSED</p>
      <p>Tuesday: CLOSED</p>
      <p>Wednesday: 10:00-8:00</p>
      <p>Thursday: 10:00-8:00</p>
      <p>Friday: 10:00-8:00</p>
      <p>Saturday: 8:00-8:00</p>
      <p>Sunday: 8:00-8:00</p>
      <p>*Hours may differ for long weekends*</p>
      <p>*Store opens May 18th, 2024*</p>
    </div>

    <div class="column">
      <h4>CHEER Connections</h4>
      <p>Friday Summer Nights from 5:00-9:00 pm</p>

   
    </div>
  </div>
</div>

<section className="Sponsors">
  <h3>Our Sponsors</h3>
  <div className="SponsorLogos">

<a href="https://www.facebook.com/algarva168/" target="_blank">
  <img src="s11.png" alt="Sponsor 1 Logo"></img>
</a>
<a href="https://sunsetcommunityfoundation.ca/" target="_blank">
  <img src="s22.png" alt="Sponsor 2 Logo"></img>
</a>
<a href="https://ontariocaregiver.ca/" target="_blank">
  <img src="s33.png" alt="Sponsor 3 Logo"></img>
</a>
<a href="https://www.rockglen.com/" target="_blank">
  <img src="s44.png" alt="Sponsor 4 Logo"></img>
</a>

  </div>

  <div classname="r"><h2>Reviews</h2></div>

</section>



      
    </main>


  </div>



  <div className="reviews-display">
  {reviews.slice(0, 3).map((review, index) => (
    <div key={index} className="review-card">
      <p>{review.review}</p>
      <p>- {review.name}</p>
    </div>
  ))}
</div>
<div className="App2">

  
      <h2>Submit Your Review</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Your review"
          required
        ></textarea>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
        />
        <button type="submit">Submit Review</button>
      </form>
    </div>


  </>
);
}

export default HomePage;
