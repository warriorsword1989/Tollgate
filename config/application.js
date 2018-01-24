const oracleService = {
  connectUrl: '192.168.4.131:1521/orcl', // 收费站系统表地址
  userName: 'FM_TOLLGATE',
  password: 'FM_TOLLGATE',

  connectRenderObjUrl: '192.168.3.227:1521/orcl', //要素渲染地址
  RenderObjUserName: 'fm_gdb_trunk',
  RenderObjPassword: 'fm_gdb_trunk',

  connectMetaObjUrl: '192.168.3.227:1521/orcl', //元数据库地址
  MetaObjUserName: 'fm_meta_trunk',
  MetaObjPassword: 'fm_meta_trunk',

  secret: 'Tollage'
};

export default oracleService;
