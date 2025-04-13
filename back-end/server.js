const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const Course = require("./models/course");
const User = require("./models/user");
const Admin = require("./models/admin");

const app = express();
const PORT = 4020;

// Middleware
app.use(express.json());

app.use(cors({ 
  origin: "http://localhost:4200",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: false, 
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    }
  })
);

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/classroomDB")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch(err => console.log(err));

// Session Verification
app.get('/verify-session', (req, res) => {
  res.json({ session: req.session });
});

// Auth Middleware
const isAuthenticated = (req, res, next) => {
  if (req.session.user) return next();
  res.status(401).json({ message: "Unauthorized" });
};

const isAdmin = (req, res, next) => {
  if (req.session.user?.role === 'admin') return next();
  res.status(403).json({ message: "Admin access required" });
};

app.post("/register", async (req, res) => {
  try {
    console.log('Registration attempt:', req.body); 
    
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = new User({ name, email, password });
    await newUser.save();
    
    req.session.user = { 
      id: newUser._id, 
      email: newUser.email, 
      name: newUser.name,
      role: 'user'
    };
    
    console.log('User registered:', newUser); 
    res.status(201).json({ 
      message: "User registered successfully",
      user: { name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    console.error('Registration error:', error); 
    res.status(500).json({ 
      message: "Error registering user", 
      error: error.message 
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    req.session.user = { 
      id: user._id, 
      email: user.email, 
      name: user.name,
      role: 'user' 
    };
    
    res.json({ 
      message: "Login successful", 
      user: { 
        id: user._id,
        name: user.name, 
        email: user.email 
      } 
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out successfully" });
});

// Admin Routes
app.post("/adminlogin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (admin && admin.password === password) {
      req.session.user = {
        id: admin._id,
        email: admin.email,
        role: 'admin'
      };
      res.json({ message: "Admin logged in" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: "Login error", error: err });
  }
});

// Course Routes
app.get('/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/courses', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { title, description, dprice, price, instructor, duration, videoLink } = req.body;
    
    if (!title || !description || !dprice || !price || !instructor || !duration || !videoLink) {
      return res.status(400).json({ error: "All fields including videoLink are required" });
    }

    const course = new Course({
      title,
      description,
      dprice: Number(dprice),
      price: Number(price),
      instructor,
      duration,
      videoLink
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ 
      error: "Failed to create course",
      details: error.message 
    });
  }
});
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));



// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const session = require("express-session");
// const Course = require("./models/course");
// const User = require("./models/user");
// const Admin = require("./models/admin");

// const app = express();
// const PORT = 4020;

// // Middleware
// app.use(express.json());
// app.use(cors({ 
//   origin: "http://localhost:4200", 
//   credentials: true 
// }));

// app.use(
//   session({
//     secret: "your_secret_key",
//     resave: false,
//     saveUninitialized: false,
//     cookie: { 
//       secure: false, 
//       httpOnly: true,
//       maxAge: 24 * 60 * 60 * 1000,
//       sameSite: 'lax'
//     }
//   })
// );

// // Connect to MongoDB
// mongoose.connect("mongodb://127.0.0.1:27017/classroomDB")
//   .then(() => console.log("MongoDB connected"))
//   .catch(err => console.log(err));

// // Session Verification
// app.get('/verify-session', (req, res) => {
//   res.json({ session: req.session });
// });

// // Auth Middleware
// const isAuthenticated = (req, res, next) => {
//   if (req.session.user) return next();
//   res.status(401).json({ message: "Unauthorized" });
// };

// const isAdmin = (req, res, next) => {
//   if (req.session.user?.role === 'admin') return next();
//   res.status(403).json({ message: "Admin access required" });
// };

// // User Routes
// app.post("/register", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: "Email already exists" });

//     const newUser = new User({ name, email, password });
//     await newUser.save();
    
//     req.session.user = { 
//       id: newUser._id, 
//       email: newUser.email, 
//       name: newUser.name,
//       role: 'user'
//     };
    
//     res.status(201).json({ 
//       message: "User registered successfully",
//       user: { name: newUser.name, email: newUser.email }
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error registering user", error });
//   }
// });

// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email }).select('+password');
    
//     if (!user || !(await user.comparePassword(password))) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     req.session.user = { 
//       id: user._id, 
//       email: user.email, 
//       name: user.name,
//       role: 'user' 
//     };
    
//     res.json({ 
//       message: "Login successful", 
//       user: { 
//         id: user._id,
//         name: user.name, 
//         email: user.email 
//       } 
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error logging in", error });
//   }
// });

// app.get("/logout", (req, res) => {
//   req.session.destroy();
//   res.json({ message: "Logged out successfully" });
// });

// // Admin Routes
// app.post("/adminlogin", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const admin = await Admin.findOne({ email });
//     if (admin && admin.password === password) {
//       req.session.user = {
//         id: admin._id,
//         email: admin.email,
//         role: 'admin'
//       };
//       res.json({ message: "Admin logged in" });
//     } else {
//       res.status(401).json({ message: "Invalid credentials" });
//     }
//   } catch (err) {
//     res.status(500).json({ message: "Login error", error: err });
//   }
// });

// // Course Routes (Admin only)
// app.post('/courses', isAuthenticated, isAdmin, async (req, res) => {
//   try {
//     const course = new Course(req.body);
//     await course.save();
//     res.status(201).json(course);
//   } catch (error) {
//     res.status(400).json({ 
//       error: "Failed to create course",
//       details: error.message 
//     });
//   }
// });

// app.get('/courses', async (req, res) => {
//   try {
//     const courses = await Course.find();
//     res.json(courses);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Start Server
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const session = require("express-session");
// const Course = require("./models/course");
// const User = require("./models/user");
// const Admin = require("./models/admin");

// const app = express();
// const PORT = 4020;

// // Middleware
// app.use(express.json());
// app.use(cors({ origin: "http://localhost:4200", credentials: true }));
// // app.use(
// //   session({
// //     secret: "your_secret_key",
// //     resave: false,
// //     saveUninitialized: false,
// //     cookie: { secure: false },
// //   })
// // );
// app.use(
//   session({
//     secret: "your_secret_key",
//     resave: false,
//     saveUninitialized: false,
//     cookie: { 
//       secure: false, 
//       httpOnly: true,
//       maxAge: 24 * 60 * 60 * 1000, 
//       sameSite: 'lax'
//     }
//   })
// );

// app.get('/verify-session', (req, res) => {
//   console.log('Session verification:', req.session);
//   res.json({ session: req.session });
// });

// // Connect to MongoDB
// mongoose.connect("mongodb://127.0.0.1:27017/classroomDB")
//   .then(() => {
//     console.log("MongoDB connected");
//     initializeDatabase(); // Add sample data
//   })
//   .catch(err => console.log(err));

// // Auth Middleware
// const isAuthenticated = (req, res, next) => {
//   if (req.session.user) return next();
//   res.status(401).json({ message: "Unauthorized" });
// };

// // app.post("/adminlogin", async(req, res)=>{
// //   const {email, password} = req.body;
// //   const admin = await Admin.findOne({email: email});
// //   if(admin && admin.password === password){
// //     req.session.user = admin;
// //     res.json({message: "Admin logged in"});
// //   }else{
// //     res.status(401).json({message: "Invalid credentials"});
// //   }
// // });
// app.post("/adminlogin", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const admin = await Admin.findOne({ email });
//     if (admin && admin.password === password) {
//       // Store complete admin info in session
//       req.session.user = {
//         id: admin._id,
//         email: admin.email,
//         role: 'admin',
//         authenticated: true
//       };
//       console.log('Session after login:', req.session); // Debug log
//       res.json({ message: "Admin logged in" });
//     } else {
//       res.status(401).json({ message: "Invalid credentials" });
//     }
//   } catch (err) {
//     res.status(500).json({ message: "Login error", error: err });
//   }
// });


// app.post("/adminlogout", (req,res)=>{
//   req.session.destroy();
//   res.json({message: "Admin logged out"});
// })

// // Routes
// app.post("/register", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: "Email already exists" });

//     const newUser = new User({ name, email, password });
//     await newUser.save();
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error registering user", error });
//   }
// });

// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email }).select('+password');
    
//     if (!user || !(await user.comparePassword(password))) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     req.session.user = { id: user._id, email: user.email, name: user.name };
//     res.json({ message: "Login successful", user: { name: user.name, email: user.email } });
//   } catch (error) {
//     res.status(500).json({ message: "Error logging in", error });
//   }
// });

// app.get("/logout", (req, res) => {
//   req.session.destroy();
//   res.json({ message: "Logged out successfully" });
// });

// // Course Routes
// app.get('/courses', async (req, res) => {
//   try {
//     const courses = await Course.find();
//     res.json(courses);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // app.post('/courses', isAuthenticated, async (req, res) => {
// //   try {
// //     const course = new Course(req.body);
// //     await course.save();
// //     res.status(201).json(course);
// //   } catch (error) {
// //     res.status(400).json({ error: error.message });
// //   }
// // });

// app.post('/courses', isAuthenticated, async (req, res) => {
//   try {
//     // Validate request body
//     const { title, description, dprice, price, instructor, duration } = req.body;
    
//     if (!title || !description || dprice === undefined || 
//         price === undefined || !instructor || !duration) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     const course = new Course({
//       title,
//       description,
//       dprice: Number(dprice),
//       price: Number(price),
//       instructor,
//       duration
//     });

//     await course.save();
//     res.status(201).json(course);
//   } catch (error) {
//     console.error("Course creation error:", error);
//     res.status(400).json({ 
//       error: error.message || "Failed to create course" 
//     });
//   }
// });
// async function initializeDatabase() {
//   const count = await Course.countDocuments();
//   if (count === 0) {
//     await Course.insertMany([
//       {
//         title: "Angular Fundamentals",
//         description: "Learn Angular from scratch with this comprehensive course",
//         dprice: 99.99,
//         price: 79.99,
//         instructor: "John Doe",
//         duration: "6 weeks"
//       },
//       {
//         title: "Node.js Masterclass",
//         description: "Build scalable backend applications with Node.js",
//         dprice: 129.99,
//         price: 99.99,
//         instructor: "Jane Smith",
//         duration: "8 weeks"
//       },
//       {
//         title: "MongoDB for Developers",
//         description: "Master NoSQL database concepts with MongoDB",
//         dprice: 89.99,
//         price: 69.99,
//         instructor: "Mike Johnson",
//         duration: "4 weeks"
//       }
//     ]);
//     console.log("Sample courses added to database");
//   }
// }

// const cartRoute =  require('./routes/cartRoutes');
// app.use('/cart', cartRoute);

// const courseRoute  = require('./routes/courseRoutes');
// app.use('/course',courseRoute);

// const adminRoute = require('./routes/adminRoutes');
// app.use('/admin', adminRoute);

// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));  