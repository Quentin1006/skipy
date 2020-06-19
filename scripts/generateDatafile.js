const URL = require('url').URL;
const fs = require("fs");
const fetch = require("cross-fetch");

const secret = require("../config/secret")
const { gontran, quentin } = secret
const ADMIN_ROLE = 100;
const USER_ROLE = 10;


let id = 0;
const fbAdmins = [
  {
    id: quentin.id,
    firstname: "Quentin",
    username: "Quentin",
    gender: "M",
    email: quentin.email,
    lastname: "Sahal",
    provider: "facebook",
    profilepic: quentin.profilepic,
    landscapePicture: "jTS41cwdpPRuAIB1KZSjF4Uw0j02R4Pt.jpg",
    dob: {
      "date": "1991-10-06T06:34:44Z",
      "age": 27
    },
    registered: {
      "date": "2015-11-04T22:09:36Z",
      "age": 3
    },
    nat: "FR",
    role: ADMIN_ROLE,
  },
  {
    id: gontran.id,
    firstname: "Gontran",
    username: "Gontran",
    gender: "M",
    email: gontran.email,
    lastname: "Main",
    provider: "facebook",
    profilepic: gontran.profilepic,
    lanscapePicture: "laquent_landscape.jpg",
    dob: {
      "date": "1991-10-06T06:34:44Z",
      "age": 27
    },
    registered: {
      "date": "2016-10-21T22:09:36Z",
      "age": 2
    },
    nat: "FR",
    role: ADMIN_ROLE,

  }
];

const nextId = () => id++;
const genRand = (rep = 1, a = true) => {
  rep = rep < 1 ? 1 : rep;
  while (rep--) a = a && Math.random() > 0.5;

  return a;
}

const defland = ["/coco_landscape.jpg", "/ludo_landscape.jpg"]
const randomAPI = new URL("https://randomuser.me/api/");
const p = {
  results: 500,
  nat: "us,dk,fr,gb",
  inc: "gender,name,email,picture,nat,dob,registered"
}


const genUsers = (url, params) => {
  url = new URL(url);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
  return fetch(url)
    .then(res => res.json())
    .catch(console.log)
    .then(res => {
      return res.results.map(f => {
        const r = genRand() ? 0 : 1;
        const { first, last } = f.name;
        delete f.name;
        return {
          ...f,
          id: String(nextId()),
          provider: "fake",
          role: USER_ROLE,
          firstname: first,
          lastname: last,
          profilepic: f.picture.medium,
          landscapePicture: defland[r]

        }
      })
    })
}

const buildFriendship = (user1, user2) => {
  const r = Math.random();
  const user1Id = genRand() ? user1.id : user2.id;
  const user2Id = user1Id === user1.id ? user2.id : user1.id;
  const status = r < 0.2 ? 0 : (r < 0.9 ? 1 : 2);
  const lastRegistered = Math.max(
    new Date(user1.registered.date).getTime(),
    new Date(user1.registered.date).getTime()
  )

  return [`${user1Id}#${user2Id}`, {
    user1Id,
    user2Id,
    status,
    initBy: user1Id,
    since: parseInt(Math.max(Date.now() - r * 10000000, lastRegistered)),
    relType: -1
  }]
}


const genFriendship = (users, toBefriendWith) => {
  return users.reduce((acc, user) => {
    const r1 = genRand(); // determines if we create a friendship with gontran
    const r2 = genRand(); // determines if we create a friendship with quentin

    [r1, r2].forEach((r, i) => {
      if (!r) return;

      const [name, content] = buildFriendship(
        user,
        toBefriendWith[i]
      )
      acc[name] = content;

    })
    return acc
  }, {})
}


const genData = () => {
  return genUsers(randomAPI, p)
    .then(users => {
      const fs = genFriendship(users, fbAdmins);
      const [name, adminFs] = buildFriendship(...fbAdmins);
      return {
        users: [
          ...fbAdmins,
          ...users,
        ],
        friendships: {
          [name]: adminFs,
          ...fs
        },
        discussions: [],
        notifications: {},
        messageState: [
          "not delivered",
          "not seen",
          "seen"
        ],
        provider: {
          0: "facebook",
          1: "google",
          10: "other"
        },
        fsStatus: ["inexistant", "confirmed", "pending", "declined"],
        roles: {
          10: "user",
          100: "admin"
        }

      };
    })
    .catch(err => err);
}

genData()
  .then(data => {
    fs.writeFile('data-test.json', JSON.stringify(data, null, 4), (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
    })
  })
