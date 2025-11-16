import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import './ContactUs.css';

export const ContactUs = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm('service_pj5us6i', 'template_zag7218', form.current, '1BG7NbiOrUZODo5yk')
      .then((result) => {
          console.log(result.text);
      }, (error) => {
          console.log(error.text);
      });
  };

  return (
    <div className="contact-us-container">
      <h1 className="contact-us-title">Contact Us</h1>
      <form ref={form} onSubmit={sendEmail}>
        <label>Name</label>
        <input type="text" name="user_name" />
        <label>Email</label>
        <input type="email" name="user_email" />
        <label>Message</label>
        <textarea name="message" />
        <input type="submit" value="Send" />
      </form>
    </div>
  );
};

export default ContactUs;
