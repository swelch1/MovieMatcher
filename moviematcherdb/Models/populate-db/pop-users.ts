import User from "../user"
const bcrypt = require('bcryptjs');

export async function populateUsers() {
  await User.create({
    username: "Test User",
    email: "testuser@gmail.com",
    password: bcrypt.hashSync("password", 10),
    profile_pic: "https://upload.wikimedia.org/wikipedia/commons/f/f4/User_Avatar_2.png",
  })
  await User.create({
    username: "Fake User",
    email: "fakeuser@gmail.com",
    password: bcrypt.hashSync("password", 10),
    profile_pic: "https://upload.wikimedia.org/wikipedia/commons/f/f4/User_Avatar_2.png",
  })
  await User.create({
    username: "Stevie",
    email: "st@gmail.com",
    password: bcrypt.hashSync("password", 10),
    profile_pic: "https://upload.wikimedia.org/wikipedia/commons/f/f4/User_Avatar_2.png",
  })
}