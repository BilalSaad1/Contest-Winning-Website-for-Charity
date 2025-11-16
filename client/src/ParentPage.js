import React, { useState, useEffect } from 'react';
import FormsManager from './parentforn'; // Ensure correct file name
import ClientAdd from './clientadd'
import Cal from './CalenderParent'

function ParentPage() {
  const [activePage, setActivePage] = useState('calendar');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserStatus = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/usercheck'); // Adjust URL as needed
        const userData = await response.json();
        console.log(userData.isdeactivated)
        if (Object.keys(userData).length !== 0 && !userData.isdeactivated) {
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to fetch user status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserStatus();
  }, []);

  // Function to render the current active page content
  const renderActivePage = () => {
    // Check if the user data is loaded and user is activated
    if (!isLoading && user) {
      if( user.isdeactivated==false){
      switch (activePage) {
        case 'forms':
          return <FormsManager />;
        case 'client':
            return <ClientAdd />;
          case 'calendar':
            return <Cal/>
        // Include other cases as needed
        default:
          return <Cal/>; // Default case
      }
    }  else if (!isLoading && user) {
      if(user.isdeactivated==true)
      // User data not available or deactivated
      return <p>You dont have access</p>;
    }
    // Loading state
    return <p>Loading...</p>;
  };
  if (!isLoading && !user) {
    // User data not available or deactivated
    return <p>You dont have access</p>;
  }}

  return (
    <div className="admin-dashboard">
      <nav className="admin-navbar">
      <button
          className={activePage === 'calendar' ? 'active' : ''}
          onClick={() => setActivePage('calendar')}
        >
          Events List
        </button>
        <button
          className={activePage === 'forms' ? 'active' : ''}
          onClick={() => setActivePage('forms')}
        >
          Forms Manager
        </button>
        <button
          className={activePage === 'client' ? 'active' : ''}
          onClick={() => setActivePage('client')}
        >
          Add Loved One
        </button>
      </nav>
      {renderActivePage()}
    </div>
  );
}

export default ParentPage;
