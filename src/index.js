const express = require("express");
const morgan = require("morgan");
const { engine } = require("express-handlebars");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const { database } = require("./keys");
const passport = require("passport");

const app = express();
const PORT = process.env.PORT || 3000;
require("./lib/passport")
// settings
app.set("port", PORT);
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  engine({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: require("./lib/handlebars"),
  })
);
app.set("view engine", ".hbs");
// middlewares
app.use(
  session({
    secret: "ryptqsSave",
    resave: false,
    saveUninitialized: false,
    Storage: new MySQLStore(database)
  })
);
app.use(flash());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize())
app.use(passport.session())
// global variables
app.use((req, res, next) => {
  app.locals.success = req.flash("success");
  app.locals.message = req.flash("message");
  app.locals.user = req.user
  next();
});

// routes
app.use(require("./routes/"));
app.use(require("./routes/authentication"));
app.use("/links", require("./routes/links"));

// public
app.use(express.static(path.join(__dirname, "public")));

// app init
app.listen(app.get("port"), () => {
  console.log(`iniciado en http://localhost:${PORT}`);
});
