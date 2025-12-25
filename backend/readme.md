# INSTILEAKS
## Backend Structure
The codebase is structured into folders as following :-
-> middlewares (containing middleware for api operations)
-> routes (containing api endpoints)
-> services (this should handle intensive cron jobs)
-> sockets (this will handle all stuffs related to websockets)
-> static (will contain static files for serving)
-> utils (will contain utility functions for general use)
## some middleware explained
-> scanIP : will keep a record of no. of req if past lets say t duration if exceeds the limit it will put that ip to blocklist for some duration, data will be stored in redis
-> validateField, checkExistingUsers, verifyJWT : just as the name suggest

