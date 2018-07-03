
if (process.env.DATABASE_URL) {
    module.exports = require('./prod');

} else {
    module.exports = require('./local');

}
