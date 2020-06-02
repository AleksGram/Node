const { Schema, model } = require("mongoose");
const { hashSync, compareSync } = require("bcryptjs");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
      unique: true,
    },
    password: { type: String, trim: true, required: true },
    nik: {type: String, trim: true, required: true },
    role: { type: String, default: "user", enum: ["user", "admin"] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
  },
  {
    collection: "users",
    // timestamps: true,
  }
);

userSchema.methods = {
  getPassword: function () {
    return this.password;
  },
};

userSchema.statics = {
  localStrategyAuth: async function (req, email, password, cb) {
    const user = await this.findOne({ email }).select("password").lean().exec();

    if (!user) {
      return cb({ status: 404, error: "user not exists" });
    }

    if (!compareSync(password, user.password)) {
      return cb({ status: 403,  error: "user not exists" });
    }

    cb(null, user._id);
  },
  serializeUser: (user_id, cb) => {
    cb(null, user_id);
  },
  deserializeUser: async function (user_id, cb) {
    const user = await this.findOne({ _id: user_id })
      .select("email role")
      .lean()
      .exec();
    cb(null, user);
  },
};


userSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("password")) {
    this.password = hashSync(this.password, 8);
  }
  this.updatedAt = new Date();
  next();
});

module.exports = model("UsersModel", userSchema);
