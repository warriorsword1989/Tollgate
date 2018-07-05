export const cityList = [
  {
    adminCode: '110000',
    cityName: '北京市',
    systemId: 1
  },
  {
    adminCode: '310000',
    cityName: '上海市',
    systemId: 2
  },
  {
    adminCode: '610000',
    cityName: '陕西省',
    systemId: 30
  },
  {
    adminCode: '520000',
    cityName: '贵州市',
    systemId: 14
  },
  {
    adminCode: '210000',
    cityName: '辽宁省',
    systemId: 27
  },
  {
    adminCode: '220000',
    cityName: '吉林省',
    systemId: 7
  },
  {
    adminCode: '640000',
    cityName: '宁夏回族自治区',
    systemId: 8
  },
  {
    adminCode: '350000',
    cityName: '福建省',
    systemId: 31
  },
  {
    adminCode: '340000',
    cityName: '安徽省',
    systemId: 13
  },
  {
    adminCode: '320000',
    cityName: '江苏省',
    systemId: 26
  },
  {
    adminCode: '530000',
    cityName: '云南省',
    systemId: 18
  },
  {
    adminCode: '150000',
    cityName: '内蒙古自治区',
    systemId: 12
  },
  {
    adminCode: '420000',
    cityName: '湖北省',
    systemId: 23
  },
  {
    adminCode: '450000',
    cityName: '广西壮族自治区',
    systemId: 17
  },
  {
    adminCode: '430000',
    cityName: '湖南省',
    systemId: 16
  },
  {
    adminCode: '370000',
    cityName: '山东省',
    systemId: 22
  },
  {
    adminCode: '630000',
    cityName: '青海省',
    systemId: 25
  },
  {
    adminCode: '460000',
    cityName: '海南省',
    systemId: 4
  },
  {
    adminCode: '130000',
    cityName: '河北省',
    systemId: 21
  },
  {
    adminCode: '120000',
    cityName: '天津市',
    systemId: 10
  },
  {
    adminCode: '540000',
    cityName: '西藏自治区',
    systemId: 5
  },
  {
    adminCode: '330000',
    cityName: '浙江省',
    systemId: 20
  },
  {
    adminCode: '650000',
    cityName: '新疆维吾尔自治区',
    systemId: 6
  },
  {
    adminCode: '510000',
    cityName: '四川省',
    systemId: 24
  },
  {
    adminCode: '140000',
    cityName: '山西省',
    systemId: 11
  },
  {
    adminCode: '620000',
    cityName: '甘肃省',
    systemId: 9
  },
  {
    adminCode: '440000',
    cityName: '广东省',
    systemId: 28
  },
  {
    adminCode: '230000',
    cityName: '黑龙江省',
    systemId: 19
  },
  {
    adminCode: '500000',
    cityName: '重庆市',
    systemId: 32
  },
  {
    adminCode: '360000',
    cityName: '江西省',
    systemId: 15
  },
  {
    adminCode: '410000',
    cityName: '河南省',
    systemId: 29
  }
];

/**
 * 根据行政区划code查找行政区划名称
 * @param {*} code
 * @return {String}
 */
export const getCityNameByCode = (code) => cityList.filter(item => item.adminCode == code)[0];

