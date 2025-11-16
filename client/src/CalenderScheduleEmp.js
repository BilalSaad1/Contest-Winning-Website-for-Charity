// DemoApp.js
import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from './modals'; 
import EditEventModal from './editeventmodals';
import './Calendar.css';

function DemoApp1() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);  

  const fetchEvents = async () => {
    const response = await fetch('/api/schedulehours');
    const fetchedEvents = await response.json();
    setEvents(fetchedEvents);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDateClick = (arg) => {
    console.log(arg.dateStr)
    setModalOpen({ date: arg.dateStr });
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditModalOpen(false);
    setSelectedEvent(null);
  };

  const saveEvent = async (title, userID,start, end) => {
    console.log(userID)
    const newEvent = { title, userID,start, end };
    await addEventToDatabase(newEvent);
    setEvents(currentEvents => [...currentEvents, newEvent]);
    closeModal();
  };

  const addEventToDatabase = async (event) => {
    const response = await fetch('/api/schedulehours', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    const data = await response.json();
    return data; 
  };


  return (
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
      {isModalOpen && (
        <Modal
          isOpen={Boolean(isModalOpen)}
          onClose={closeModal}
          date={isModalOpen.date}
        />
      )}
      {isEditModalOpen && selectedEvent && (
        <EditEventModal
          isOpen={Boolean(isEditModalOpen)}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default DemoApp1;
