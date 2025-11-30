NFR3120 – Assignment 3

GitHub Repository: https://github.com/Yinka-onab/Assignment-3.git 

Render Deployment: https://assignment-3-b79b.onrender.com 

http://localhost:3000

Technologies Used
Node.js + Express – Web application framework
MongoDB Atlas – Cloud database
Mongoose – Schema & data modeling
EJS – View templating
Bootstrap 5 – Responsive styling
Custom CSS – Grey theme / card layout
Font Awesome – Icons (optional)
dotenv – Secure environment variables
Render – Cloud deployment

Features
Home Page – Simple splash page
Events Page – Displays all events from MongoDB
Add Event – Create a new event
Edit Event – Update existing events
Delete Event – Includes confirmation prompt
Shared Header & Footer – EJS partials
Grey Background Theme – Custom styling
Secured Credentials – .env + .gitignore

Folder Structure
eventhub/
├── public/
│   └── stylesheets/
│       └── style.css
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── home.ejs
│   ├── events.ejs
│   ├── add.ejs
│   ├── edit.ejs
│   └── error.ejs
├── routes/
│   └── events.js
├── models/
│   └── Event.js
├── config/
│   └── db.js
├── app.js
├── package.json
├── .env (NOT COMMITTED)
└── .gitignore

Server:
npm run dev 


