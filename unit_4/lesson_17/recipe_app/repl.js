const mongoose = require("mongoose");
const Subscriber = require("./models/subscriber");
const Course = require("./models/course");

let testCourse, testSubscriber;

mongoose.connect(
  "mongodb://localhost:27017/recipe_db",
  { useNewUrlParser: true }
);
mongoose.Promise = global.Promise;

Subscriber.remove({})
  .then(items => console.log(`Removed ${items.n} records!`))
  .then(() => Course.remove({}))
  .then(items => console.log(`Removed ${items.n} records!`))
  .then(() => Subscriber.create({
    name: "Jon",
    email: "jon@jonwexler.com",
    zipCode: "12345"
  }))
  .then(subscriber => {
    console.log(`Created Subscriber: ${subscriber.getInfo()}`);
  })
  .then(() => Subscriber.findOne({
    name: "Jon"
  }))
  .then(subscriber => {
    testSubscriber = subscriber;
    console.log(`Found one subscriber: ${subscriber.getInfo()}`);
  })
  .then(() => Course.create({
    title: "Tomato Land",
    description: "Locally farmed tomatoes only",
    zipCode: 12345,
    items: ["cherry", "heirloom"]
  }))
  .then(course => {
    testCourse = course;
    console.log(`Created course: ${course.title}`);
  })
  .then(() => {
    testSubscriber.courses.push(testCourse);
    testSubscriber.save();
  })
  .then(() => Subscriber.populate(testSubscriber, "courses"))
  .then(subscriber => console.log(subscriber))
  .then(() => Subscriber.find({
    courses: mongoose.Types.ObjectId(testCourse._id)
  }))
  .then(subscriber => console.log(subscriber));
