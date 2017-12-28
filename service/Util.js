/**
 * @description node服务的工具类
 * @file api.js
 * @author    zhaohang
 * @date      2017/12/27
 *
 * @copyright @Navinfo, all rights reserved.
 */
export const changeResult = function (result) { // 将数据库查询返回的数据转为返回界面的数据格式
  const resultArr = [];
  if (result.rows.length === 0) {
    return resultArr;
  }
  for (let i = 0; i < result.rows.length; i++) {
    const resultObj = {};
    for (let j = 0; j < result.metaData.length; j++) {
      resultObj[result.metaData[j].name.toLowerCase()] = result.rows[i][j];
    }
    resultArr.push(resultObj);
  }
  return resultArr;
};
