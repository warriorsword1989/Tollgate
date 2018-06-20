// 数据库中说有的表信息；
const tableInfos = [
  { label: '客车车型划分及费率', tableName: 'SC_TOLL_CAR', isShow: true },
  { label: '货车车型划分及空载费率', tableName: 'SC_TOLL_TRUCK', isShow: true },
  { label: '货车计重装载费率(不超限)', tableName: 'SC_TOLL_LOAD', isShow: true },
  { label: '货车计重装载费率(超限)', tableName: 'SC_TOLL_OVERLOAD', isShow: true },
  { label: '收费站加费信息表', tableName: 'SC_TOLL_TOLLGATEFEE', isShow: true },
  { label: '收费站区间表', tableName: 'SC_TOLL_GROUP_DETAIL', isShow: true },
  { label: '限制载重信息表', tableName: 'SC_TOLL_LIMIT', isShow: true },
  { label: '桥隧道收费附加表', tableName: 'SC_TOLL_RDLINK_BT', isShow: true },
  { label: '节假日收费浮动信息', tableName: 'SC_TOLL_HOLIDAY', isShow: false },
  { label: '特殊收费浮动信息', tableName: 'SC_TOLL_SPEFLOAT', isShow: false }
];

// 收费站类型列表；
const tollType = {
  0: '未调查',
  1: '领卡',
  2: '交卡付费',
  3: '固定收费(次费)',
  4: '交卡付费后再领卡',
  5: '交卡付费并代收固定费用',
  6: '验票(无票收费)值先保留',
  7: '领卡并代收固定费用',
  8: '持卡打标识不收费',
  9: '验票领卡',
  10: '交卡不收费'
};
// 作业类型
const workType = {
  static: '[静态作业]',
  dynamic: '[动态作业]'
};
// 情报作业来源；
const infoSource = ['情报道路对象', '情报点对象', '情报省份对象'];

const bussinessConfig = {
  tableInfos,
  tollType,
  workType,
  infoSource,
};

export default bussinessConfig;