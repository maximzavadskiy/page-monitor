Monitors urls for specified text.
Specifications for monitoring are given in settings.json

The system consist of 2 services:
1) Monitor sever (page-monitor) - node.js application that queries the urls specified in settings.json and writes report to file on local FS + MongoDB
To run in page-monitor folder run:

```
npm install
node main.js
```

2) Monitor UI (monitor-interface) - Meteor.js application that dispays information about last check, and automatically refreshes as new data arrives

To run, in monitor-interface folder run:

```
curl https://install.meteor.com/ | sh
MONGO_URL=mongodb://page-monitor:test@apollo.modulusmongo.net:27017/Suh4ehyr meteor --port <port you want>
```

Running UI demo is at http://pagemonitor-58893.onmodulus.net/ (still needs page-monitor to be run separately)


The current design splits the monitoring logic from user interface logic and provides better reliability as it would be a single process - data is stored securely on MongoDB, and in case either of subsystems fails, the other one can still function

Another option would be to make another service that watches MongoDB and writes local log file but it would not be as relyable  (what if MongoDB server fails). Writing to MongoDB from a log file is neither an option (what if format of log file will change).

#### Design questions #####

The current design is capable of doing distributed monitoring across location with minor modifications
page-monitor just need to be launched in several nodes, at neeeded locations. 
All nodes would write to a single DB (MongoDB should do fine).
When writing to DB, location information should be provided in addition to report information. This could be just a single field, such as location_id. All locations active can be put in a separate collection in the database for ease of tracking or map-reduced from the log collection.

Security consideration - MongoDB API is encrypted with SSL

