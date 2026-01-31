const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Users = require ("./models/user.js");
const Products = require ("./models/product.js");  
const Order = require("./models/order.js");
const getDashboardStats = require("./models/dashboardStat.js");
const ejsMate = require("ejs-mate");


const path = require("path");
const methodOverride = require("method-override");

const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const bcrypt = require("bcrypt");


const MONGO_URL = "mongodb://127.0.0.1:27017/jdmart"; 


app.engine("ejs", ejsMate); 
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

app.use(session({
  secret: "supersecretkey",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MONGO_URL
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

app.use(async (req, res, next) => {
  res.locals.user = null; // ALWAYS defined

  if (req.session.userId) {
    req.user = await Users.findById(req.session.userId);
    res.locals.user = req.user;
  }

  next();
});




main()
    .then(()=>{
        console.log("connected to db");
    })
    .catch((err)=>{
        console.log(err);
    })

async function main(){
    await mongoose.connect(MONGO_URL);
}


function isLoggedIn(req, res, next) {
  if (!req.user) {
    return res.redirect("/login");
  }
  next();
}

// Login form
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

// Login User
app.post("/login", async (req, res) => {
  try {
    const { login, password } = req.body;

    const user = await Users.findOne({
      $or: [{ email: login }, { phone: login }]
    });

    if (!user) {
      console.log("No user found");
      return res.redirect("/login");
    }

    const isMatch = await user.comparePassword(password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      return res.redirect("/login");
    }

    req.session.userId = user._id;

    req.session.save(() => {
      res.redirect("/products");
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.redirect("/login");
  }
});

// OTP Login Page (phone input)
app.get("/otp-login", (req, res) => {
  res.render("otp", { step: false }); // step=false means show phone input
});

// Send OTP (after submitting phone)
app.post("/send-otp", async (req, res) => {
  const { phone } = req.body;

  const user = await Users.findOne({ phone });
  if (!user) {
    console.log("User not found for OTP login");
    return res.redirect("/otp-login");
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  req.session.otp = otp;
  req.session.otpPhone = phone;

  console.log("=================================");
  console.log("OTP FOR LOGIN:", otp);
  console.log("=================================");

  // Pass step=true to show OTP verification
  res.render("otp", { step: true, phone });
});

// Verify OTP
app.post("/verify-otp", async (req, res) => {
  const { otp } = req.body;

  if (parseInt(otp) !== req.session.otp) {
    console.log("OTP INVALID");
    return res.redirect("/otp-login");
  }

  const user = await Users.findOne({ phone: req.session.otpPhone });

  req.session.userId = user._id;

  // Clear OTP session data
  req.session.otp = null;
  req.session.otpPhone = null;

  req.session.save(() => {
    res.redirect("/products");
  });
});


// Register Form
app.get("/register", (req, res) => {
  res.render("register.ejs");
});

// Register User
app.post("/register", async (req, res) => {
  try {
    const { fullName, phone, email, business, businessType, password, confirm,defaultAddress } = req.body;

    if (password !== confirm) {
      return res.redirect("/register");
    }

    const userExists = await Users.findOne({
      $or: [{ email }, { phone }]
    });

    if (userExists) {
      return res.redirect("/register");
    }

    const newUser = new Users({
      fullName,
      phone,
      email,
      business,
      businessType,
      password,
      defaultAddress
    });

    await newUser.save();

    req.session.userId = newUser._id;

    req.session.save(() => {
      res.redirect("/products");
    });

  } catch (err) {
    console.log(err);
    res.redirect("/register");
  }
});

// Forget password
app.get("/forgot-password", (req, res) => {
  res.render("forgot-password.ejs");
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// Products Route
app.get("/products", isLoggedIn, async (req, res) => {
  try {
    const allProducts = await Products.find({}).sort({ time: -1 });
    const dashboardStats = await getDashboardStats(); // fetch stats

    res.render("index.ejs", { allProducts, dashboardStats });
  } catch (err) {
    console.log("Error fetching products or stats:", err);
    res.send("Something went wrong");
  }
});


// Orders Route
app.get("/orders", isLoggedIn, async (req, res) => {

  const orders = await Order.find({ user: req.user._id })
    .populate("items.product")
    .sort({ createdAt: -1 });

  const stats = {
    total: orders.length,
    transit: orders.filter(o => o.status === "In Transit").length,
    delivered: orders.filter(o => o.status === "Delivered").length,
    pending: orders.filter(o => o.status === "Pending").length
  };

  res.render("orders", {
    orders,
    user: req.user,
    stats
  });
});

// CREATE ORDER 
app.post("/orders/buy-now/:id", isLoggedIn, async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    const qty = parseInt(req.body.quantity);

    if (!product || qty < 1 || qty > product.available) {
      return res.redirect("/products");
    }

    const total = qty * product.pricePerQuintal;

    const order = new Order({
      user: req.user._id,
      items: [
        {
          product: product._id,
          quantity: qty,
          priceAtOrder: product.pricePerQuintal
        }
      ],
      totalAmount: total,
      status: "Pending",
      deliveryAddress: "123 Market Street, Mumbai, Maharashtra 400001",
      expectedDelivery: new Date(
        Date.now() + product.deliveryTime.maxDays * 86400000
      ),
      timeline: [
        { status: "Placed" },
        { status: "Confirmed" }
      ]
    });

    // Reduce stock
    product.available -= qty;

    await order.save();
    await product.save();

    res.redirect("/orders");
  } catch (err) {
    console.error("BUY NOW ERROR:", err);
    res.redirect("/products");
  }
});


//Profile Route
app.get("/profile", isLoggedIn, async (req, res) => {
  const user = await Users.findById(req.session.userId);
  res.render("profile", { user });
});

// Show route
app.get("/products/:id",async(req,res)=>{
    let {id} = req.params;
    const product = await Products.findById(id);
    res.render("show.ejs",{product});
})

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})

