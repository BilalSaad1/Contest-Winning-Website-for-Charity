require('dotenv').config();
const express = require('express')
const path = require('path')
const { connectDB, getDb } = require('./db')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./User');
const crypto = require('crypto');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const nodemailer = require("nodemailer")
const { ObjectId } = require('mongodb');
const multer = require('multer');
const fs = require("fs")


const upload = multer({ storage: multer.memoryStorage() });

loggedinuser={}



const port = process.env.PORT || 8080; // Fallback to 8080 if PORT isn't set
const router = express.Router();

const app = express()
app.use(cors());
app.use(express.json())
app.use(fileUpload())

const startServer = async () => {
    await connectDB();

    app.use('/api', router);

    app.listen(port, () => {
        console.log(`Listening to Port ${port}`);
    });
};

startServer();

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: "CheerfulContact2@gmail.com",
      pass: "xouq mjbd zrgr crnw",
    },
    tls: {
      rejectUnauthorized: false
    }
  });

db = connectDB()

app.get('/api/usercheck', (req, res) => {
    res.json(loggedinuser);
});

router.post('/register', async (req, res) => {
    const db = getDb();
    const usersCollection = db.collection('users');

    try {
        const { email, password, username, newsletter } = req.body;

        const user = await usersCollection.findOne({ email });
        if (user) {
            return res.status(400).send('User already exists');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            username,
            email,
            password: hashedPassword,
            newsletter,
            isEmailVerified: false,
            isAdmin: false,
            isdeactivated: true,
            isemployee: false,
            isclient: false,
            clients:[]
        };

        await usersCollection.insertOne(newUser);
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/user/:userId/toggleEmployee', async (req, res) => {
    const { userId } = req.params;
    const { isEmployee } = req.body; // Expected to be the new status
    
    try {
        const db = getDb(); // Function to get your DB instance
        const User = db.collection('users');
        
        // Update the user's isemployee status
        await User.updateOne(
            { _id: new ObjectId(userId) }, // Use ObjectId if your ID is in ObjectId format
            { $set: { isemployee: isEmployee } }
        );
        
        res.status(200).send({ message: 'User employee status updated successfully' });
    } catch (error) {
        console.error('Error toggling employee status:', error);
        res.status(500).send({ message: 'Failed to toggle employee status' });
    }
});



router.post('/addClient', async (req, res) => {
    const db = getDb();
    const User = db.collection('users');
    const { username, clientUsername, clientPassword } = req.body;




    if (!username || !clientUsername || !clientPassword) {
        return res.status(400).send({ message: 'Missing required fields' });
    }

    try {
        // Check if clientUsername is already in use by any user or client
        const existingUser = await User.findOne({ 
            $or: [
                { username: clientUsername }, // Check against user usernames
                { 'clients.0': clientUsername } // Check against first element of clients arrays
            ]
        });

        if (existingUser) {
            return res.status(409).send({ message: 'clientUsername is already being used' });
        }

        const user = await User.findOne({ username: username });

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Use the updateOne method to add the client
        await User.updateOne({ username: username }, { $push: { clients: [clientUsername, clientPassword] } });

        res.status(200).send({ message: 'Client added successfully' });
    } catch (error) {
        console.error('Error adding client:', error);
        res.status(500).send({ message: 'Failed to add client' });
    }
});

  // Endpoint to post a new message
  router.post('/messages', async (req, res) => {
    const db = getDb(); // Ensure this function correctly retrieves your database instance
    const messagesCollection = db.collection('messages'); // Access the messages collection

    const { sender, content, type } = req.body;

    try {
        // Prepare the new message document
        const newMessage = {
            sender,
            content,
            type,
            createdAt: new Date() // Adding a timestamp for when the message was created
        };

        // Insert the new message into the collection
        await messagesCollection.insertOne(newMessage);

        // Respond with the newly created message
        // MongoDB's insertOne adds an _id property to newMessage, making it suitable for the response
        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Failed to send message:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

  // Endpoint to get all messages
  app.get('/api/messages', async (req, res) => {
    const db = getDb(); // Ensure this gets the DB instance correctly
    const messagesCollection = db.collection('messages');

    try {
        // First, find the messages, then sort them by 'createdAt' in ascending order (1 for ascending, -1 for descending)
        // .toArray() is then used to convert the cursor into an array
        const messages = await messagesCollection.find({}).sort({ createdAt: 1 }).toArray();
        
        res.json(messages); // Send the array of messages as a response
    } catch (error) {
        console.error('Failed to get messages:', error);
        res.status(500).json({ message: 'Server error', error: error.message }); // Return an error message on failure
    }
});




 

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const db = getDb(); 
    const usersCollection = db.collection('users');
  
    try {
        let user = await usersCollection.findOne({ email });
        if (!user) {
            return res.status(401).json({ msg: 'Invalid Credentials' });
        }
  
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid Credentials' });
        }
  
        if (user.isdeactivated) {
            return res.status(403).json({ msg: 'Account is deactivated. Please contact admin.' });
        }
  
        // Determine the user's role and corresponding redirect path
        let redirectPath = '/ParentPage'; // Default path for 'parent'
        if (user.isAdmin) {
            redirectPath = '/admin';
        } else if (user.isemployee) { // Placeholder check for 'isEmployee' logic
            redirectPath = '/EmployeePage'; // You will need to implement this page
        } // Add more else if conditions as needed for other roles
        loggedinuser=user
        delete loggedinuser.password

        res.status(200).json({ 
            msg: 'Login successful', 
            user: { 
                id: user._id, 
                email: user.email, 
                username: user.username,
                isEmployee: user.isemployee  
            },
            redirectPath
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' }); 
    }
  });
  

app.use('/api', router);


router.post('/newsletter', async (req, res) => {
    const db = getDb();
    const usersCollection = db.collection('users');
   
    try {
        // Fetch all users who have subscribed to the newsletter
        const subscribers = await usersCollection.find({ newsletter: "Yes" }).toArray();
        // Extract emails from the subscribers
        const subscriberEmails = subscribers.map(subscriber => subscriber.email);
   

        console.log(subscriberEmails)
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }
   
        let uploadedFile = req.files.pdf;
        let subject = req.body.subject; // Get the subject from the form data
        let text = req.body.text;
   
        // Assuming you're using express-fileupload or similar middleware that loads the file into memory
        const fileBuffer = uploadedFile.data; // This is the file content as a buffer
        
        let mailOptions = {
            from: 'CheerfulContact2@gmail.com',
            bcc: subscriberEmails, // Use the subscriber emails
            subject: subject, // Use the subject from the form data
            text: text, // Use the text from the form data
            attachments: [
                {
                    filename: uploadedFile.name,
                    content: fileBuffer,
                }
            ],
        };
   
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.status(500).send('Error sending email.');
            } else {
                console.log('Email sent: ' + info.response);
                res.send({ success: true, message: 'Email sent successfully.' });
            }
        });
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        res.status(500).send('Error processing your request.');
    }
 });

 router.post('/hours', async (req, res) => {
    const db = getDb();
    const { username, clockIn, clockOut } = req.body;

    const user = await db.collection('users').findOne({ username });
    if (!user || !user.isemployee) {
        return res.status(403).json({ error: 'Access denied' });
    }
    const hoursWorked = (new Date(clockOut) - new Date(clockIn)) / 3600000;
    const hourRecord = {
        clockIn: new Date(clockIn),
        clockOut: new Date(clockOut),
        hoursWorked
    };

    const updateResult = await db.collection('hours').updateOne(
        { username },
        { $push: { hours: hourRecord } },
        { upsert: true }
    );

    if (updateResult.matchedCount === 0 && updateResult.upsertedCount === 0) {
        res.status(500).json({ error: 'Failed to record hours' });
    } else {
        res.status(201).json({ message: 'Hours recorded successfully.' });
    }
});
router.post('/emoji-login', async (req, res) => {
    const { emojiSequence } = req.body;
    const db = getDb();
    const usersCollection = db.collection('users');
    let redirectPath = '/ClientPage'; // Default path for 'client'
    try {
        const usersWithClients = await usersCollection.find({ clients: { $exists: true } }).toArray();

        for (const user of usersWithClients) {
            for (const client of user.clients) {
                if (client[1] === emojiSequence) {
                    console.log('Login successful', client[0]);
                    console.log(client);
                    loggedinuser = client
                    console.log(loggedinuser+"im loggedin user");
                    
                    loggedinuser[loggedinuser.length] = true
                    return res.status(200).json({
                        msg: 'Login successful',
                        client: {
                            name: client[0],
                            isclient: true
                        },
                        redirectPath
                    });
                }
            }
        }

        console.log('Client not found.'); // Debugging log
        return res.status(404).json({ msg: 'Client not found.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});


app.get('/api/hours/:username', async (req, res) => {
    const db = getDb();
    const hoursCollection = db.collection('hours');
    const { username } = req.params;

    try {
        const records = await hoursCollection.find({ username }).toArray();
        res.status(200).json(records);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error while fetching records' });
    }
});

  router.post('/events', async (req, res) => {
    const db = getDb();
    const eventsCollection = db.collection('events');

    try {
        const { title, start, end } = req.body;

        // Optional: Check if the event or a similar event already exists to avoid duplicates
        // This step depends on your application's requirements

        const newEvent = {
            title,
            start,
            end,
            attendees:[],
            createdAt: new Date(), // Optional: track when the event was created
        };
        await eventsCollection.insertOne(newEvent);

        res.status(201).json({ message: 'Event added successfully.', event: newEvent });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/events', async (req, res) => {
    const db = getDb();
    const eventsCollection = db.collection('events');

    try {
        const events = await eventsCollection.find({}).toArray(); // Fetch all events, adjust query as needed
        res.status(200).json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error while fetching events' });
    }
});


router.put('/events/:id', async (req, res) => {
    const db = getDb();
    const eventsCollection = db.collection('events');
    const { id } = req.params;
    const { title, start, end } = req.body;

    try {
        // Convert id to ObjectId since MongoDB uses ObjectId for _id by default
        const objectId = new ObjectId(id);

        // Update the event
        const result = await eventsCollection.updateOne(
            { _id: objectId },
            { $set: { title, start, end } }
        );

        if (result.matchedCount === 0) {
            // No document matched the query
            res.status(404).send('Event not found');
        } else {
            // Document was updated
            res.send('Event updated');
        }
    } catch (error) {
        res.status(500).send('Error updating event');
    }
});

  
  // Delete an event
  router.delete('/events', async (req, res) => {
    const db = getDb();
    const eventsCollection = db.collection('events');
    
    // Extract title, start, and end from query parameters
    const { title, start, end } = req.body;

    try {
        // Query to match event by title, start, and end
        const deleteResult = await eventsCollection.deleteOne({title: title, start: start.substring(0, 16), end: end.substring(0, 16)});

        if (deleteResult.deletedCount === 0) {
            // No document found matching the criteria
            res.status(404).send('Event not found');
        } else {
            // Document successfully deleted
            console.log("Event deleted");
            res.send('Event deleted');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting event');
    }
});
 

app.get('/api/users', async (req, res) => {
    const db = getDb(); // Assume getDb() gets your db connection
    const usersCollection = db.collection('users');

    try {
        const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray(); // Exclude passwordss
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error retrieving users.');
    }
});


router.put('/users/:id/toggleDeactivation', async (req, res) => {
    const db = getDb();
    const usersCollection = db.collection('users');
    const { id } = req.params;

    try {
        const result = await usersCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { isdeactivated: req.body.isdeactivated } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).send('User not found or no changes made.');
        }

        res.send('User updated successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating user status.');
    }
});

router.post('/upload/:name', async (req, res) => {
    try {
        if (!req.files || !req.files.form) {
            return res.status(400).send('No file uploaded.');
        }

        const originalname = req.params.name;
        const buffer = req.files.form.data;
        const db = getDb();
        const collection = db.collection('forms');

        // Find document with the same name
        const existingDocument = await collection.findOne({ name: originalname });
        console.log(existingDocument)
        if (existingDocument) {
            // Update existing document
            await collection.updateOne({ name: originalname }, { $set: { docxFile: buffer } });
            res.send(`File updated successfully as ${originalname}`);
        } else {
            // Insert new document
            await collection.insertOne({ name: originalname, docxFile: buffer });
            res.send(`File uploaded successfully as ${originalname}`);
        }
    } catch (error) {
        console.error('Error uploading the file:', error);
        res.status(500).send('Error uploading the file');
    }
});


app.get('/api/forms', async (req, res) => {
    const db = getDb();
    const collection = db.collection('forms');

    try {
        const forms = await collection.find({}).toArray();
        
        if (forms.length > 0) {
            // Process each form to handle the binary data correctly
            forms.map(form => {
                form.docxFile=form.docxFile.buffer
            });
            res.json(forms);
        } else {
            res.status(404).send('No forms available');
        }
    } catch (error) {
        console.error('Failed to retrieve forms:', error);
        res.status(500).send('Error retrieving form data');
    }
});


// Assuming Express.js setup and MongoDB connection are already in place

app.get('/api/getClients/:username', async (req, res) => {
    const { username } = req.params;
    const db = getDb(); // Get your db connection
    const User = db.collection('users');

    try {
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        res.status(200).json({ clients: user.clients });
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).send({ message: 'Failed to fetch clients' });
    }
});





// Enable CORS



// POST endpoint to add a review
router.post('/add-review', async (req, res) => {
    try {
      const reviewsCollection = (await db).collection('reviews');
      const review = req.body; // Assuming review is sent in the body of the POST request
      const result = await reviewsCollection.insertOne(review);
      res.status(201).send(result);
    } catch (error) {
      console.error("Failed to add review", error);
      res.status(500).send({ message: "Failed to add review" });
    }
  });


  router.put('/updateEvent/:title', async (req, res) => {
    const db = getDb();
    const { title } = req.params;
    const { attendees } = req.body;
  
    if (!db) {
      return res.status(500).send('Database not initialized');
    }
  
    try {
      const eventsCollection = db.collection('events');
      // Assuming title is unique for simplicity. In a real app, consider using an _id.
      const updateResult = await eventsCollection.updateOne(
        { title },
        { $addToSet: { attendees: { $each: attendees } } } // This adds new attendees without duplicating existing ones
      );
  
      if (updateResult.matchedCount === 0) {
        return res.status(404).send('Event not found');
      }
  
      res.status(200).send('Event updated successfully');
    } catch (error) {
      console.error('Failed to update event:', error);
      res.status(500).send('Error updating event');
    }
  });
  


  router.post('/schedulehours', async (req, res) => {
    const db = getDb();
    const eventsCollection = db.collection('schedulehours');

    try {
        const { title, userID,start, end } = req.body;

        // Optional: Check if the event or a similar event already exists to avoid duplicates
        // This step depends on your application's requirements

        const newEvent = {
            title,
            start,
            end,
            userID,
            createdAt: new Date(), // Optional: track when the event was created
        };
        await eventsCollection.insertOne(newEvent);

        res.status(201).json({ message: 'Event added successfully.', event: newEvent });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});



router.put('/schedulehours/:id', async (req, res) => {
    const db = getDb();
    const eventsCollection = db.collection('schedulehours');
    const { id } = req.params;
    const { title, start, end } = req.body;

    try {
        // Convert id to ObjectId since MongoDB uses ObjectId for _id by default
        const objectId = new ObjectId(id);

        // Update the event
        const result = await eventsCollection.updateOne(
            { _id: objectId },
            { $set: { title, start, end } }
        );

        if (result.matchedCount === 0) {
            // No document matched the query
            res.status(404).send('Event not found');
        } else {
            // Document was updated
            res.send('Event updated');
        }
    } catch (error) {
        res.status(500).send('Error updating event');
    }
});


  router.delete('/schedulehours', async (req, res) => {
    const db = getDb();
    const eventsCollection = db.collection('schedulehours');
    
    // Extract title, start, and end from query parameters
    const { title, start, end } = req.body;

    try {
        // Query to match event by title, start, and end
        const deleteResult = await eventsCollection.deleteOne({title: title, start: start.substring(0, 16), end: end.substring(0, 16)});

        if (deleteResult.deletedCount === 0) {
            // No document found matching the criteria
            res.status(404).send('Event not found');
        } else {
            // Document successfully deleted
            console.log("Event deleted");
            res.send('Event deleted');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting event');
    }
});

app.get('/api/schedulehours', async (req, res) => {
    const db = getDb();
    const eventsCollection = db.collection('schedulehours');

    try {
        const events = await eventsCollection.find({}).toArray(); // Fetch all events, adjust query as needed
        res.status(200).json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error while fetching events' });
    }
});

  

// Assuming db.collection('reviews') correctly references your reviews collection
app.get('/api/reviews', async (req, res) => {
    const db = getDb(); // Ensure this correctly gets your DB instance
    try {
      const reviewsCollection = db.collection('reviews');
      const reviews = await reviewsCollection.find().toArray(); // Convert to array if using MongoDB native driver
      res.json(reviews);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
      res.status(500).send({ message: "Failed to fetch reviews" });
    }
  });
  
// DELETE review by ID
router.delete('/reviews/:id', async (req, res) => {
    const db = getDb();
    const { id } = req.params; // Get the ID from the request parameters

    try {
        const result = await db.collection('reviews').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 1) {
            res.status(204).send(); // Successfully deleted one document
        } else {
            res.status(404).send({ message: "Review not found" }); // No document found with that ID
        }
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).send({ message: "Error deleting review" });
    }
});
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => {
   res.sendFile(path.join(__dirname, '../client/build/index.html'));
 });