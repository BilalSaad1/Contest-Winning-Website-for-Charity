import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from './modal'; // Import the Modal component for adding events
import EditEventModal from './EditEventModal'; // Import the EditEventModal component for editing/deleting events
import './Calendar.css';

function DemoApp() {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  

  const fetchEvents = async () => {
    const response = await fetch('/api/events');
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
          event={selectedEvent}
        />
      )}
    </div>
  );
}

export default DemoApp;
