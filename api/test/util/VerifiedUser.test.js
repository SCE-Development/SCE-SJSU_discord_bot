/* global describe it before after */
// During the test the env variable is set to test
process.env.NODE_ENV = 'test';
const VerifiedUser = require('../../models/VerifiedUser');
// Require the dev-dependencies
const chai = require('chai');
const chaiHttp = require('chai-http');
const {
    OK,
    BAD_REQUEST,
    UNAUTHORIZED,
    FORBIDDEN,
    NOT_FOUND
} = require('../../util/constants').STATUS_CODES;
const SceApiTester = require('./tools/SceApiTester');

let app = null;
let test = null;
const expect = chai.expect;
// tools for testing
const tools = require('./tools/tools.js');

chai.should();
chai.use(chaiHttp);

// Our parent block
describe('VerifiedUser', () => {
    before(done => {
        app = tools.initializeServer(
            __dirname + '../routes/VerifiedUser');
        test = new SceApiTester(app);
        tools.emptySchema(VerifiedUser);
        done();
    });

    after(done => {
        tools.terminateServer(done);
    });

    beforeEach(() => {
    });

    afterEach(() => {
    });

    describe('/getAllUsers', () => {
        it('Should return statusCode 200 when all ' +
            'required fields are filled in', async (done) => {
                const form = {};
                const result = await test.sendGetRequest(
                    'VerifiedUser/');
                console.log(result)

                expect(result).to.have.status(OK);
            });
    });
});
