const { generate } = require("randomstring");
const assert = require("assert");
const maxAvailableSessions = 100;
const { use, registerWithFake } = require("../registerWithFake")({maxAvailableSessions});
const { getUserById } = require("../../../../db");

const Session = function(){
    this.id = generate(8);
};

class FakeStore {
    constructor(){
        this.sessions = [];
    }

    get(idx){
        return this.sessions[idx];
    }
    
    create(){
        const newSession = new Session();
        this.sessions.push(newSession);
        return newSession;
    }

    all(){
        return new Promise(resolve => {
            setTimeout(() => {resolve(this.sessions)}, 500);
        })
    }

}

const fakeStore = new FakeStore();


const populateFakeStore = (store, size, ratioFakeProvider=0.5) => {
    for(let id=0; id<size; id++){
        const sess = store.create();
        const provider = Math.random() > ratioFakeProvider ? "other" : "fake";
        sess.user = {id, provider}
    }
}

const getSessions = () => {
    return fakeStore.all()
}

const testRegisterWithFake = async () => {
    use("getUserById", getUserById);
    use("getSessions", getSessions);

    const res = await registerWithFake();
    if(res.err){
        return assert(
            res.err === "All fake sessions are in use", 
            "Only error acceptable is that all sessions are in use"
        )
    }
    assert(res.isFake, "User should be fake");
    assert(res.user.provider === "fake", "User exist and is from fake provider")
}




describe("Testing registering with Fake provider", () => {
    test("User should exists and provider should be fake", async() => {
        use("getUserById", getUserById);
        use("getSessions", getSessions);

        try {
            populateFakeStore(fakeStore, 500);
            const res = await registerWithFake();
            expect(res.user).toHaveProperty("provider", "fake")
            expect(res).toHaveProperty("isFake", true);
        }
        catch(e) {
            console.log(e);
        }
    })
})
   
