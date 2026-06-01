const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/User');
const Post = require('./models/Post');
const auth = require('./middleware/auth');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'taskplanet_secret_key_12345_secure_key';

let useMockDb = false;

// --- MOCK DATABASE STORAGE (In-memory fallback if Mongoose cannot connect) ---
let mockUsers = [];
let mockPosts = [];

function seedMockDb() {
  console.log('⚠️ Entering In-Memory Mock Database Mode (VC++ redistributables or MongoDB missing).');
  
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync('password123', salt);

  const u1 = {
    _id: 'mock_u1',
    username: 'nitin3w👑',
    email: 'nitin@taskplanet.app',
    password: hashedPassword,
    points: 150,
    balance: 10.00,
    avatar: '',
    createdAt: new Date()
  };

  const u2 = {
    _id: 'mock_u2',
    username: 'aryan_dev',
    email: 'aryan@social.com',
    password: hashedPassword,
    points: 80,
    balance: 5.50,
    avatar: '',
    createdAt: new Date()
  };

  const u3 = {
    _id: 'mock_u3',
    username: 'sarah_m',
    email: 'sarah@earner.com',
    password: hashedPassword,
    points: 50,
    balance: 0.00,
    avatar: '',
    createdAt: new Date()
  };

  mockUsers = [u1, u2, u3];

  mockPosts = [
    {
      _id: 'mock_p1',
      user: 'mock_u1',
      username: 'Nitin Pandey',
      email: u1.email,
      text: `Create Post and Earn Points
💰 Reward: 100 Points for each valid link.
🚀 Daily Earning Potential: Up to 1000 Points.
🚀 Weekly Earning Potential: Up to 10,000.
🚀 Monthly Earning Potential: Up to 50,000 Points.`,
      image: '',
      likes: [
        { user: 'mock_u2', username: 'aryan_dev' },
        { user: 'mock_u3', username: 'sarah_m' }
      ],
      comments: [
        { _id: 'mc1', user: 'mock_u2', username: 'aryan_dev', text: 'This reward structure looks fantastic! Ready to start posting link submissions.', createdAt: new Date(Date.now() - 3600000) },
        { _id: 'mc2', user: 'mock_u3', username: 'sarah_m', text: 'Is there a limit on daily post promotions?', createdAt: new Date(Date.now() - 1800000) }
      ],
      createdAt: new Date(Date.now() - 7200000)
    },
    {
      _id: 'mock_p2',
      user: 'mock_u2',
      username: 'Aryan Gupta',
      email: u2.email,
      text: `Building the new TaskPlanet interface! The bottom navigation feels incredibly smooth. Check out the Social tab! 🚀✨ #mern #materialui`,
      image: '',
      likes: [
        { user: 'mock_u1', username: 'nitin3w👑' }
      ],
      comments: [
        { _id: 'mc3', user: 'mock_u1', username: 'nitin3w👑', text: 'Stunning design, Aryan! Visual details match perfectly.', createdAt: new Date(Date.now() - 600000) }
      ],
      createdAt: new Date(Date.now() - 1800000)
    }
  ];
  
  console.log('✅ Seeded 3 users and 2 community posts in-memory!');
}

// Connect to Database
async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (MONGODB_URI) {
    try {
      await mongoose.connect(MONGODB_URI);
      console.log('Connected to MongoDB Atlas...');
      return;
    } catch (err) {
      console.warn('Failed to connect to MONGODB_URI. Falling back...', err.message);
    }
  }

  // Try standard local MongoDB
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/mini-social', {
      serverSelectionTimeoutMS: 2000
    });
    console.log('Connected to local MongoDB...');
    return;
  } catch (err) {
    console.log('Local MongoDB not running. Trying mongodb-memory-server...');
  }

  // Fallback to in-memory MongoDB
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log('Connected to in-memory MongoDB server!');
  } catch (err) {
    console.warn('mongodb-memory-server failed (likely missing vc_redist). Falling back to Custom In-Memory Mock Mode...');
    useMockDb = true;
    seedMockDb();
  }
}

// Function to auto-seed initial beautiful posts (for Mongoose mode)
async function seedInitialData() {
  if (useMockDb) return;
  try {
    const userCount = await User.countDocuments();
    const postCount = await Post.countDocuments();

    if (userCount === 0 && postCount === 0) {
      console.log('Seeding initial high-fidelity community posts for MongoDB...');

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);

      const user1 = new User({
        username: 'nitin3w👑',
        email: 'nitin@taskplanet.app',
        password: hashedPassword,
        points: 150,
        balance: 10.00
      });

      const user2 = new User({
        username: 'aryan_dev',
        email: 'aryan@social.com',
        password: hashedPassword,
        points: 80,
        balance: 5.50
      });

      const user3 = new User({
        username: 'sarah_m',
        email: 'sarah@earner.com',
        password: hashedPassword,
        points: 50,
        balance: 0.00
      });

      await user1.save();
      await user2.save();
      await user3.save();

      const post1 = new Post({
        user: user1._id,
        username: 'Nitin Pandey',
        email: user1.email,
        text: `Create Post and Earn Points
💰 Reward: 100 Points for each valid link.
🚀 Daily Earning Potential: Up to 1000 Points.
🚀 Weekly Earning Potential: Up to 10,000.
🚀 Monthly Earning Potential: Up to 50,000 Points.`,
        likes: [
          { user: user2._id, username: 'aryan_dev' },
          { user: user3._id, username: 'sarah_m' }
        ],
        comments: [
          { user: user2._id, username: 'aryan_dev', text: 'This reward structure looks fantastic! Ready to start posting link submissions.', createdAt: new Date(Date.now() - 3600000) },
          { user: user3._id, username: 'sarah_m', text: 'Is there a limit on daily post promotions?', createdAt: new Date(Date.now() - 1800000) }
        ],
        createdAt: new Date(Date.now() - 7200000)
      });

      const post2 = new Post({
        user: user2._id,
        username: 'Aryan Gupta',
        email: user2.email,
        text: `Building the new TaskPlanet interface! The bottom navigation feels incredibly smooth. Check out the Social tab! 🚀✨ #mern #materialui`,
        likes: [
          { user: user1._id, username: 'nitin3w👑' }
        ],
        comments: [
          { user: user1._id, username: 'nitin3w👑', text: 'Stunning design, Aryan! Visual details match perfectly.', createdAt: new Date(Date.now() - 600000) }
        ],
        createdAt: new Date(Date.now() - 1800000)
      });

      await post1.save();
      await post2.save();
      console.log('MongoDB seeded successfully!');
    }
  } catch (err) {
    console.error('Error seeding data:', err);
  }
}

// --- AUTHENTICATION ROUTES ---

// @route   POST /api/auth/signup
app.post('/api/auth/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  if (username.length < 3) {
    return res.status(400).json({ msg: 'Username must be at least 3 characters long' });
  }

  const emailLower = email.toLowerCase();

  if (useMockDb) {
    // Check if exists
    if (mockUsers.some(u => u.email === emailLower)) {
      return res.status(400).json({ msg: 'Email is already registered' });
    }
    if (mockUsers.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return res.status(400).json({ msg: 'Username is already taken' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = {
      _id: 'user_' + Math.random().toString(36).substring(2, 9),
      username,
      email: emailLower,
      password: hashedPassword,
      points: 50,
      balance: 0.00,
      createdAt: new Date()
    };

    mockUsers.push(newUser);

    const payload = { user: { id: newUser._id, username: newUser.username } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        points: newUser.points,
        balance: newUser.balance,
        avatar: ''
      }
    });
  }

  try {
    let userByEmail = await User.findOne({ email: emailLower });
    if (userByEmail) {
      return res.status(400).json({ msg: 'Email is already registered' });
    }

    let userByUsername = await User.findOne({ username });
    if (userByUsername) {
      return res.status(400).json({ msg: 'Username is already taken' });
    }

    const newUser = new User({
      username,
      email,
      password
    });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();

    const payload = { user: { id: newUser.id, username: newUser.username } };

    jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          points: newUser.points,
          balance: newUser.balance,
          avatar: newUser.avatar
        }
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  const emailLower = email.toLowerCase();

  if (useMockDb) {
    const user = mockUsers.find(u => u.email === emailLower);
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = { user: { id: user._id, username: user.username } };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        points: user.points,
        balance: user.balance,
        avatar: ''
      }
    });
  }

  try {
    const user = await User.findOne({ email: emailLower });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id, username: user.username } };

    jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
      if (err) throw err;
      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          points: user.points,
          balance: user.balance,
          avatar: user.avatar
        }
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/auth/me
app.get('/api/auth/me', auth, async (req, res) => {
  if (useMockDb) {
    const user = mockUsers.find(u => u._id === req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    const { password, ...safeUser } = user;
    return res.json(safeUser);
  }

  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// --- POST ROUTES ---

// @route   GET /api/posts
app.get('/api/posts', async (req, res) => {
  const { sort } = req.query;

  if (useMockDb) {
    let sortedPosts = [...mockPosts];

    if (sort === 'likes') {
      sortedPosts.sort((a, b) => b.likes.length - a.likes.length || b.createdAt - a.createdAt);
    } else if (sort === 'comments') {
      sortedPosts.sort((a, b) => b.comments.length - a.comments.length || b.createdAt - a.createdAt);
    } else {
      sortedPosts.sort((a, b) => b.createdAt - a.createdAt);
    }

    return res.json(sortedPosts);
  }

  try {
    let postsQuery = Post.find();

    if (sort === 'likes') {
      postsQuery = Post.aggregate([
        { $addFields: { likesCount: { $size: '$likes' } } },
        { $sort: { likesCount: -1, createdAt: -1 } }
      ]);
    } else if (sort === 'comments') {
      postsQuery = Post.aggregate([
        { $addFields: { commentsCount: { $size: '$comments' } } },
        { $sort: { commentsCount: -1, createdAt: -1 } }
      ]);
    } else {
      postsQuery = Post.find().sort({ createdAt: -1 });
    }

    const posts = await postsQuery;
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/posts
app.post('/api/posts', auth, async (req, res) => {
  const { text, image } = req.body;

  if (!text && !image) {
    return res.status(400).json({ msg: 'Please provide either text or an image' });
  }

  if (useMockDb) {
    const userProfile = mockUsers.find(u => u._id === req.user.id);
    if (!userProfile) return res.status(404).json({ msg: 'User profile not found' });

    const newPost = {
      _id: 'post_' + Math.random().toString(36).substring(2, 9),
      user: req.user.id,
      username: userProfile.username,
      text: text || '',
      image: image || '',
      likes: [],
      comments: [],
      createdAt: new Date()
    };

    mockPosts.push(newPost);
    userProfile.points += 5; // Signup points increase!

    return res.status(201).json(newPost);
  }

  try {
    const userProfile = await User.findById(req.user.id);
    
    const newPost = new Post({
      user: req.user.id,
      username: userProfile.username,
      text: text || '',
      image: image || '',
      likes: [],
      comments: []
    });

    const post = await newPost.save();
    
    userProfile.points += 5;
    await userProfile.save();

    res.status(201).json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/posts/:id/like
app.post('/api/posts/:id/like', auth, async (req, res) => {
  if (useMockDb) {
    const post = mockPosts.find(p => p._id === req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    const userProfile = mockUsers.find(u => u._id === req.user.id);
    if (!userProfile) return res.status(404).json({ msg: 'User not found' });

    const likeIndex = post.likes.findIndex(like => like.user === req.user.id);

    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push({
        user: req.user.id,
        username: userProfile.username
      });
    }

    return res.json(post);
  }

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const userProfile = await User.findById(req.user.id);

    const likeIndex = post.likes.findIndex(like => like.user.toString() === req.user.id);

    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push({
        user: req.user.id,
        username: userProfile.username
      });
    }

    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   POST /api/posts/:id/comment
app.post('/api/posts/:id/comment', auth, async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ msg: 'Comment text is required' });
  }

  if (useMockDb) {
    const post = mockPosts.find(p => p._id === req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    const userProfile = mockUsers.find(u => u._id === req.user.id);
    if (!userProfile) return res.status(404).json({ msg: 'User not found' });

    const newComment = {
      _id: 'comment_' + Math.random().toString(36).substring(2, 9),
      user: req.user.id,
      username: userProfile.username,
      text,
      createdAt: new Date()
    };

    post.comments.push(newComment);
    return res.json(post);
  }

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const userProfile = await User.findById(req.user.id);

    const newComment = {
      user: req.user.id,
      username: userProfile.username,
      text,
      createdAt: new Date()
    };

    post.comments.push(newComment);

    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server error');
  }
});

// Start the server
async function startServer() {
  await connectDB();
  await seedInitialData();
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}...`);
    if (useMockDb) {
      console.log('🚀 Server is running flawlessly using In-Memory Custom DB Fallback!');
    }
  });
}

startServer();
