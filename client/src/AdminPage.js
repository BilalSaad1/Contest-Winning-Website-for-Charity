import React, { useState,useEffect } from 'react';
import Newsletter from './NewsletterSignup'; // Assuming this is the upload component
import Calendar from './Calendar'; // Assuming this is the calendar management component
import UsersList from './UserActivation'; // Import the UsersList component
import FormsManager from './formbuilder'; // Import the FormsManager component
import Hours from './schedulecal'; // Import the FormsManager component
import Reviews from './Reviews'; 

import './AdminPage.css'; // Import your CSS file

function AdminDashboard() {
  const [activePage, setActivePage] = useState('calendar');
  const [user, setUser] = useState(null); // Holds the user data



  function userc(){
    fetch('/api/usercheck')
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error('Error fetching user data:', error));}
      useEffect(() => {userc()})

  // Function to render the current active page content
  const renderActivePage = () => {
    if(user!=null){
      if(user.isAdmin==true){
    switch (activePage) {
      case 'calendar':
        return <Calendar />;
      case 'upload':
        return <Newsletter />;
      case 'users':
        return <UsersList />;
      case 'forms':
        return <FormsManager />;
      case 'hours':
          return <Hours />;
      case 'reviews':
          return <Reviews />;
      default:
        return <Calendar />; // Default to Calendar if somehow an unknown state is set
    }}else if (user.isAdmin==false) {
      // User data not available or deactivated
      return <p>Please refer to a different page.</p>;
    }else{return <p>Please refer to a different page.</p>;}}else{
      return <p>Please refer to a different page.</p>;
    }
  };



  return (
    <div className="admin-dashboard">
      <nav className="admin-navbar">
        <button 
          className={activePage === 'calendar' ? 'active' : ''} 
          onClick={() => setActivePage('calendar')}
        >
          Manage Calendar
        </button>
        <button 
          className={activePage === 'upload' ? 'active' : ''} 
          onClick={() => setActivePage('upload')}
        >
          Upload Newsletter
        </button>
        <button 
          className={activePage === 'users' ? 'active' : ''} 
          onClick={() => setActivePage('users')}
        >
          User List
        </button>
        <button // New button for forms manager
          className={activePage === 'forms' ? 'active' : ''} 
          onClick={() => setActivePage('forms')}
        >
          Forms Manager
        </button>

        <button // New button for forms manager
          className={activePage === 'hours' ? 'active' : ''} 
          onClick={() => setActivePage('hours')}
        >
          Schedule Employees
        </button>

        <button 
          className={activePage === 'reviews' ? 'active' : ''} 
          onClick={() => setActivePage('reviews')}
        >
          Manage Reviews
        </button>
      </nav>
      {renderActivePage()}
    </div>
  );
}

export default AdminDashboard;
