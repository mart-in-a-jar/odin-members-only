# Members only
[Project](https://www.theodinproject.com/lessons/nodejs-members-only) to practice authentication and database actions. No focus on design. No email verification.

Hosted on railway: https://odin-members-only-production-aba3.up.railway.app/

### Features
- View messages
- Sign up
- Sign in
- Join club with secret code
- Logged in users can post messages
- Members can see the author of other messages
- Admins can delete messages

Password to become member: 8ug67a

### Tools
- Express
- Passport
- bcrypt
- express-validator
- ejs
- sass




### Dev

```sh
npm run sass
```

```sh
npm run dev
```

#### Env variables
PORT = 3000  
MONGO_URL = "mongodb://localhost:27017"  
MONGO_DB = "members-only"  
COOKIE_SECRET =  