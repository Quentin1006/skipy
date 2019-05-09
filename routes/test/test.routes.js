const { testRouteStatus } = require("./test.helper");
const { PROTOCOL, DOMAIN, PORT, ADMIN_KEY } = process.env
const base_url = `${PROTOCOL}://${DOMAIN}:${PORT}`;

const get_urls = [
    `${base_url}/discussions/0`, // existing route with existing disc
    `${base_url}/discussions/10`, // non existing disc
    `${base_url}/login`, // existing route to verify user
    `${base_url}/users/0`, // existing user
    `${base_url}/users/b0`, // non existing user
    `${base_url}/users/0/friends`, // get user friends
    `${base_url}/users/b0/friends`, // non existing user
    `${base_url}/users/0/activeDiscussions`,
    `${base_url}/users/b0/activeDiscussions`, // non existing user
]

const port_urls = [];


test.skip("skiping", () => {
    get_urls.forEach(url => {
        testRouteStatus({
            url,
            headers: {
                ADMIN_KEY
            }
        })
        
    })

})
