const connectDB = require('../lib/connectDB');

describe('App', () => {
    describe('Mongoose', function () {
        it('shoud connect without crashing', function (done) {
            this.timeout(5000);

            connectDB().then(() => {
                done();
            });
        });
    })
})