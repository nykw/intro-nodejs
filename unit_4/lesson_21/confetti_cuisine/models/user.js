const mongoose = require('mongoose');
const { Schema } = mongoose;
const Subscriber = require('./subscriber');

const userSchema = new Schema({
  name: {
    first: {
      type: String,
      trim: true
    },
    last: {
      type: String,
      trim: true
    }
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  zipCode: {
    type: Number,
    min: [10000, 'Zip code too short'],
    max: 99999
  },
  password: {
    type: String,
    required: true
  },
  courses: [{
    type: Schema.Types.ObjectId,
    ref: 'Course'
  }],
  subscribedAccount: {
    type: Schema.Types.ObjectId,
    ref: 'Subscriber'
  }
}, {
  timestamps: true
});

userSchema.virtual('fullname').get(function () {
  return `${this.name.first} ${this.name.last}`;
});

userSchema.pre('save', async function (next) {
  const user = this;

  if (user.subscribedAccount === undefined) {
    try {
      const subscriber = await Subscriber.findOne({
        email: user.email
      });
      user.subscribedAccount = subscriber;
      next();
    } catch (err) {
      console.log(`Error in connecting subscriber:${err.message}`);
      next(err);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model('User', userSchema);