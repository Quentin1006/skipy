const { adminKey } = require("../../config")

const { testRouteStatus } = require("./test.helper");
const domain = "http://localhost:3001";

const get_urls = [
    `${domain}/discussions/0`, // existing route with existing disc
    `${domain}/discussions/10`, // non existing disc
    `${domain}/login`, // existing route to verify user
    `${domain}/users/0`, // existing user
    `${domain}/users/b0`, // non existing user
    `${domain}/users/0/friends`, // get user friends
    `${domain}/users/b0/friends`, // non existing user
    `${domain}/users/0/activeDiscussions`,
    `${domain}/users/b0/activeDiscussions`, // non existing user
]

const port_urls = [];


test.skip("skiping", () => {
    get_urls.forEach(url => {
        testRouteStatus({
            url,
            headers: {
                adminKey
            }
        })
        
    })

})
