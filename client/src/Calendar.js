// DemoApp.js
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

  const saveEvent = async (title, start, end) => {
    const newEvent = { title, start, end };
    await addEventToDatabase(newEvent);
    setEvents(currentEvents => [...currentEvents, newEvent]);
    closeModal();
  };

  const addEventToDatabase = async (event) => {
    const response = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    const data = await response.json();
    return data; // Assuming the backend returns the newly added event with an ID
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent({
      id: clickInfo.event._def.extendedProps._id,
      title: clickInfo.event.title,
      start: clickInfo.event.startStr,
      end: clickInfo.event.endStr,
    });
    setEditModalOpen(true);
  };

  const updateEventInDatabase = async (id, updatedEvent) => {
    const response = await fetch(`/api/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEvent),
    });
  };

  const updateEvent = async (id, title, start, end) => {
    const updatedEvent = { title, start, end };
    await updateEventInDatabase(id, updatedEvent);
    fetchEvents()
    closeModal();
  };

  const deleteEventInDatabase = async (event) => {
    const { title, start, end } = event;
    await fetch('/api/events', {
        method: 'DELETE', // Using POST as a workaround
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, start, end }),
    });
};

  const deleteEvent = async () => {
    await deleteEventInDatabase(selectedEvent);
    fetchEvents()
    closeModal();
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
        dateClick={handleDateClick}
        eventClick={handleEventClick}
      />
      {isModalOpen && (
        <Modal
          isOpen={Boolean(isModalOpen)}
          onClose={closeModal}
          onSave={saveEvent}
          date={isModalOpen.date}
        />
      )}
      {isEditModalOpen && selectedEvent && (
        <EditEventModal
          isOpen={Boolean(isEditModalOpen)}
          onClose={closeModal}
          onUpdate={updateEvent}
          onDelete={deleteEvent}
          event={selectedEvent}
        />
      )}
    </div>
  );
}

export default DemoApp;
