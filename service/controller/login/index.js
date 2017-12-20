import connectOracle from '../../oracle/connectOracle';
import logger from '../../config/logs';

class Captchas {
    constructor() {

    }
    async getCaptchas(req, res, next) {
        const sql = "SELECT * FROM SC_TOLL_INFO";
        const result = await  connectOracle.executeSql(sql);
        logger.debug("ceshijiegiup"+ result.rows.toString());
        res.send({
            status: 100000,
            pm: true,
            result: result
        });
    }
}

export default new Captchas()
