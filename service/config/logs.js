var log4js = require('log4js');
log4js.configure({
    appenders: {
        everything: {
            type: 'dateFile',
            filename: 'tollGate.log',
            pattern: '.yyyy-MM-dd-hh',
            compress: true
        }
    },
    categories: {
        default:
            {
                appenders: [ 'everything' ],
                level: 'debug'
            }
    }
});

const logger = log4js.getLogger();

export default logger;