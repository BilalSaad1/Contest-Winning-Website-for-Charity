# Ongoing Living & Learning – Charity Platform (Contest-Winning Website)

Full-stack web platform built for **Ongoing Living & Learning Inc.**, combining a public charity site with secure portals for parents, clients, employees, and admins.  
Includes accessibility features (text-to-speech, emoji login), scheduling, time-tracking, chat, and custom forms to support day-program operations.

---

## Tech Stack

- **Frontend:** React, React Router, React-Bootstrap, vanilla CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB (native driver)
- **Auth & Security:** JWT, bcrypt
- **Other:** Nodemailer (emails), file upload, text-to-speech support

---

## Features

### Public Charity Website
- Home page with image carousel, testimonials, donation CTA, and program highlights.
- About and contact pages with embedded contact form and basic validation.
- Reviews section where visitors can leave feedback about the organization.
- Newsletter sign-up for ongoing communication.

### Accessibility & UX
- **Text-to-speech toggle** for reading key UI labels out loud.
- **Emoji-based login** option to make sign-in easier for some clients.
- Clear iconography and large buttons for better usability.

### Authentication & Roles
- Email/password registration and login.
- Role flags for:
  - **Admin**
  - **Employee**
  - **Parent**
  - **Client**
- Admin-controlled activation/deactivation of users and role management.

### Admin Portal
- Calendar management for events and program scheduling.
- User management and activation/deactivation tools.
- Builder for creating and managing dynamic forms (e.g., parent/client forms).
- Review moderation and high-level view of feedback.
- Overview of employee hours.

### Employee Portal
- **Clock-in / clock-out** interface with automatic hours calculation.
- Calendar views for assigned shifts and events.
- Ability to export worked-hours reports (via `file-saver`).

### Parent & Client Portals
- Personalized calendars showing scheduled activities.
- Parent tools to manage clients and access forms.
- Client experience pages focused on simplicity and accessibility.

### Chat & Engagement
- Secure chat page that loads stored messages from the backend.
- Support for sending text messages and uploading audio clips (via `useRecorder`).
- Simple games page (e.g., Connect 4) for client engagement.

---

## Project Structure

```text
Charity Website/
  Server/
    index.js        # Express server, routes, JWT auth, role checks
    db.js           # MongoDB connection helper
    User.js         # User model helpers
    Message.js      # Message model helpers
    .env.example    # Sample environment configuration (create this)
  client/
    package.json
    src/
      App.js        # Main router & header/footer
      HomePage.js   # Public landing page
      AboutPage.js
      ContactForm.js
      LoginPage.js
      Register.js
      EmojiLogin.js
      AdminPage.js
      EmployeePage.js
      ParentPage.js
      ClientPage.js
      ChatPage.js
      GamesPage.js
      Calendar*.js  # Various calendar components
      formbuilder.js
      parentforn.js
      schedulecal.js
      useRecorder.js
      ...           # CSS files and supporting components
    public/
      index.html
      images, icons, and logo assets
