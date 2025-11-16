import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './pCalender.css';

function DemoApp() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch('/api/events');
      const fetchedEvents = await response.json();
      setEvents(fetchedEvents);
    };
    fetchEvents();
  }, []);




  // Fetch the logged-in user and their clients
    const fetchUserAndClients = async () => {
      const userResponse = await fetch('/api/usercheck');
      const loggedinuser = await userResponse.json();
      setUser(loggedinuser);
    };
    useEffect(() => {
    fetchUserAndClients();
  }, []);


  // Function to handle the event sign up
  const handleEventSignup = async (eventTitle, client) => {
    const newClientUsernames = user.clients.map(client => client[0]); // Adjust index if necessary
    const clientsToAdd = (events[events.findIndex(event => event.title === eventTitle)].attendees.includes(newClientUsernames[0]))

    // Check if there are new clients to add
    if (clientsToAdd==true) {
      setMessage("All selected clients are already added to the event");
      return;
    }


    const usernames = user.clients.map(client => client[0]);
    const updatedEvent = {
      title: eventTitle,
      attendees: usernames,
    };
    


    const response = await fetch(`/api/updateEvent/${eventTitle}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedEvent),
    });
    


    if (response.ok) {
      setMessage("The participants have been added to the event")
      setEvents(events.map(ev => ev.title === eventTitle ? { ...ev, attendees: updatedEvent.attendees } : ev));
    }
    else{
      setMessage("The participants are already added to the event")
    }
  };



  
  return (
    <>
    <div className='my-calendar'>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: 'today prev,next',
          center: 'title',
          end: 'dayGridMonth timeGridWeek timeGridDay',
        }}
        height="700px"
        events={events}
        
      />



      <div className="event-list">
        <h2>Upcoming Events</h2>
        <ul>
  {events.map(event => (
    <li key={event.title}>
      {event.title} - {new Date(event.start).toLocaleString()} - {new Date(event.end).toLocaleString()}
      <ul>
        {event.attendees.map((attendee, index) => (
          <li key={index}>{attendee}</li>
        ))}
      </ul>
      <button onClick={() => handleEventSignup(event.title, user.client)}>Sign Up Clients</button>
    </li>
  ))}
</ul>
      </div>
      {message}
    </div>

    </>
  );
}

export default DemoApp;
