import oracledb from 'oracledb';
import logger from '../config/logs';

class ConnectOracle {
  constructor() {
    this.connectionAttrs = {
      user: 'fm_meta_trunk',
      password: 'fm_meta_trunk',
      connectString: '192.168.3.227:1521/ORCL'
    };
    this.releaseConnections = this.releaseConnections.bind(this);
  }
  executeSql (sql){
    return new Promise((resolve, reject) => {
      oracledb
        .getConnection(this.connectionAttrs)
        .then(connection => {
          return connection
            .execute(sql)
            .then(results => {
              resolve(results);
              this.releaseConnections(connection);
            })
            .catch(err => {
              reject(err)
              this.releaseConnections(connection)
            })
        })
        .catch(err => {
          reject(err)
        })
    })}
  releaseConnections(resultSet, connection){
    process.nextTick(() => {
      if (resultSet) {
        resultSet
          .close()
          .then(() => {
            connection
              .release()
              .catch(err => {
                throw err
              })
          })
          .catch(err => {
            throw err
          })
      } else {
        connection
          .release()
          .catch(err => {
            throw err
          })
      }
    })
  }
}

export default new ConnectOracle()
