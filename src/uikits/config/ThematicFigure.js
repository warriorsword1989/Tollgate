FM.uikit.Config = FM.uikit.Config || {};

/**
 * 单例，只读 专题图图例颜色配置
 * @method FM.uikit.Config.ThematicFigure
 * @author LiuZhe
 * @date   2017-09-11
 * @return {object} 单例对象
 */
FM.uikit.Config.ThematicFigure = (function () {
    var instance;

    var Singleton = function () {
        var config = {
            /*  fc作业、收免费信息、速度等级跳跃，这3个专题图要做成场景，先不增加对应的图例；
             也没找到颜色对应的文字含义
             TMRDLINKFCWORK: {
             figure: [
             { label: 'noResult-0', color: '#000000' },
             { label: 'noResult-1', color: '#FF0000' },
             { label: 'noResult-2', color: '#00A000' },
             { label: 'noResult-3', color: '#FFC000' },
             { label: 'noResult-4', color: '#0000FF' },
             { label: 'noResult-5', color: '#909090' }
             ]
             },
             TMRDLINKRECEIVEFREE: {
             figure: [
             { label: 'noResult-0', color: '#909090' },
             { label: 'noResult-1', color: '#FF0000' },
             { label: 'noResult-2', color: '#909090' },
             { label: 'noResult-3', color: '#3075FF' }
             ]
             },
             TMRDLINKSPEEDRANK: {
             figure: [
             { label: 'noResult-0', color: '#C0C0C0' },
             { label: 'noResult-1', color: '#808000' },
             { label: 'noResult-2', color: '#FF0000' },
             { label: 'noResult-3', color: '#00A000' },
             { label: 'noResult-4', color: '#FFC000' },
             { label: 'noResult-5', color: '#0000FF' },
             { label: 'noResult-6', color: '#FF50A8' },
             { label: 'noResult-7', color: '#3291F5' },
             { label: 'noResult-8', color: '#000000' },
             { label: 'noResult-99', color: 'red' }
             ]
             },*/
            TMRDLINKAPPINFO: {
                figure: [
                    { label: '调查中', color: '#909090' },
                    { label: '可以通行', color: '#000000' },
                    { label: '不可通行', color: '#FF0000' },
                    { label: '未供用', color: '#FF8000' },
                    { label: '计划', color: '#FF00FF' }
                ]
            },
            TMRDLINKDEVELOPSTATE: {
                figure: [
                    { label: '非详细', color: '#000000' },
                    { label: '详细', color: '#00FF00' },
                    { label: '未验证', color: '#FF0000' }
                ]
            },
            TMRDLINKISVIADUCT: {
                figure: [
                    { label: '未调查', color: '#C0C0C0' },
                    { label: '是', color: '#FF0000' },
                    { label: '否', color: '#777777' }
                ]
            },
            TMRDLINKFUNCTIONCLASS: {
                figure: [
                    { label: '等级 1', color: '#FF0000' },
                    { label: '等级 2', color: '#00A000' },
                    { label: '等级 3', color: '#FFC000' },
                    { label: '等级 4', color: '#0000FF' },
                    { label: '等级 5', color: '#909090' }
                ]
            },
            TMRDLINKLANECLASS: {
                figure: [
                    { label: '未赋值', color: '#C0C0C0' },
                    { label: '一条车道', color: '#0000FF' },
                    { label: '2或3条', color: '#FF0000' },
                    { label: '4条及以上', color: '#00FF00' }
                ]
            },
            TMRDLINKLANENUM: {
                figure: [
                    { label: '等于 1', color: '#993399' },
                    { label: '等于 2', color: '#C0C0C0' },
                    { label: '等于 3', color: '#FFC000' },
                    { label: '等于 4', color: '#64DC14' },
                    { label: '等于 5', color: '#0000FF' },
                    { label: '等于 6', color: '#FF6464' },
                    { label: '等于 7', color: '#00FFFF' },
                    { label: '大于 7', color: '#818001' },
                    { label: '等于0且左右车道数不为0', color: '#7364C9' },
                    { label: '等于0且左右车道数为0', color: '#C93146' }
                ]
            },
            TMRDLINKLIMIT: {
                figure: [
                    { label: '等于 0', color: '#C0C0C0' },
                    { label: '等于 1', color: 'transparent' },
                    { label: '道路维修中', color: '#808000', indentation: true },
                    { label: '单行限制', color: '#0adf22', indentation: true },
                    { label: '车辆限制', color: '#FFC000', indentation: true },
                    { label: '穿行限制', color: '#0000FF', indentation: true },
                    { label: '施工中不开放', color: '#FF50A8', indentation: true },
                    { label: '季节性关闭道路', color: '#3291F5', indentation: true },
                    { label: 'Usage Fee Required', color: '#8c05f7', indentation: true },
                    { label: '超车限制', color: '#FF8000', indentation: true },
                    { label: '外地车限行', color: '#b686dc', indentation: true },
                    { label: '尾号限行', color: '#abe9b2', indentation: true },
                    { label: '在建', color: '#800505', indentation: true },
                    { label: '禁停', color: '#000000', indentation: true },
                    { label: '等于 2', color: '#00FDEF' },
                    { label: '等于 3', color: '#006E52' },
                    { label: '等于 4', color: '#C0DA3D' },
                    { label: '大于 4', color: '#FF0000' }
                ]
            },
            TMRDLINKSPEEDLIMITSPEEDCLASS: {
                figure: [
                    { label: '未赋值', color: '#C0C0C0' },
                    { label: '＞130', color: '#808000' },
                    { label: '100.1～130', color: '#FF0000' },
                    { label: '90.1～100', color: '#00A000' },
                    { label: '70.1～90', color: '#FFC000' },
                    { label: '50.1～70', color: '#0000FF' },
                    { label: '30.1～50', color: '#FF50A8' },
                    { label: '11～30', color: '#3291F5' },
                    { label: '＜11', color: '#000000' }
                ]
            },
            TMRDLINKSPEEDLIMITSPEEDCLASSWORK: {
                figure: [
                    { label: '手工赋值', color: '#FF0000' },
                    { label: '程序赋值', color: '#0000FF' }
                ]
            },
            TMRDLINKSPEEDLIMITSPEEDLIMITSRC: {
                figure: [   //  by  LiuZhe, 和王涵确认，bug6845,第5条
                    { label: '无', color: '#C0C0C0' },
                    { label: '现场标牌', color: '#FF0000' },
                    // { label: '城区标识', color: '#00FF00' },
                    // { label: '高速标识', color: '#FFFF00' },
                    // { label: '车道限速', color: '#0000FF' },
                    // { label: '方向限速', color: '#FF9BFD' },
                    // { label: '机动车限速', color: '#5176FD' },
                    { label: '匝道未调查', color: '#8201B2' },
                    // { label: '缓速行驶', color: '#9ACF00' },
                    { label: '未调查', color: '#FF00FF' }
                    // { label: '混合', color: '#000000' },
                    // { label: '无普通限速', color: 'red' }
                ]
            },
            TMRDLINKMULTIDIGITIZED: {
                figure: [
                    { label: '否', color: '#C0C0C0' },
                    { label: '是', color: '#FF0000' }
                ]
            },
            TMRDLINKNAMECONTENT: {
                figure: [
                    { label: '作业中', color: '#646464' },
                    { label: '高速道路', color: '#FFAAFF' },
                    { label: '城市高速', color: '#E5C8FF' },
                    { label: '国道', color: '#FF6364' },
                    { label: '省道', color: '#FFC000' },
                    { label: '预留', color: '#0E7892' },
                    { label: '县道', color: '#63DC13' },
                    { label: '乡镇村道路', color: '#C89665' },
                    { label: '其它道路', color: '#C8C864' },
                    { label: '非引导道路', color: '#000000' },
                    { label: '步行道路', color: '#00C0FF' },
                    { label: '人渡', color: '#DCBEBE' },
                    { label: '轮渡', color: '#7364C8' },
                    { label: '10 级路(障碍物)', color: '#DCBEBE' }
                ]
            },
            TMRDLINKNAMEGROUPID: {
                figure: [
                    { label: '官方名', color: '#000000' },
                    { label: '别名', color: '#FF0000' },
                    { label: '曾用名', color: '#0000FF' },
                    { label: '等于 0', color: '#C0C0C0' },
                    { label: '等于 1', color: '#FF0000' },
                    { label: '等于 2', color: '#00FF00' },
                    { label: '等于 3', color: '#FFFF00' },
                    { label: '等于 4', color: '#0000FF' },
                    { label: '大于 4', color: '#FF9BFD' }
                ]
            },
            TMRDLINKNAMETYPE: {
                figure: [
                    { label: '普通', color: '#008500' },
                    { label: '立交桥名(连接路)', color: '#FF0000' },
                    { label: '立交桥名(主路)', color: '#FF0000' },
                    { label: '风景路线', color: '#A500EC' },
                    { label: '桥', color: '#0000FF' },
                    { label: '隧道', color: '#FA04C9' },
                    { label: '虚拟名称', color: '#2FFFE3' },
                    { label: '出口编号', color: '#0000FF' },
                    { label: '编号名称', color: '#BEDE14' },
                    { label: '虚拟连接名称', color: '#FF00FF' },
                    { label: '点门牌', color: '#2FFFE3' },
                    { label: '线门牌', color: '#000000' },
                    { label: '无名称', color: '#999999' }
                ]
            },
            TMRDLINKPAVESTATUS: {
                figure: [
                    { label: '铺设', color: '#909090' },
                    { label: '未铺设', color: '#FF0000' }
                ]
            },
            TMRDLINKFORM50: {
                figure: [
                    { label: '等于 0', color: '#909090' },
                    { label: '等于 1', color: '#FF0000' }
                ]
            },
            TMRDLINKFORMOFWAY10: {
                figure: [
                    { label: '等于 0', color: '#C0C0C0' },
                    { label: '等于 1', color: '#FF9BFD' }
                ]
            },
            TMRDLINKFORMOFWAY11: {
                figure: [
                    { label: '等于 0', color: '#FF00FF' },
                    { label: '等于 1', color: '#FF0000' }
                ]
            },
            TMRDLINKFORMOFWAY12: {
                figure: [
                    { label: '等于 0', color: '#00FF00' },
                    { label: '等于 1', color: '#FF9BFD' }
                ]
            },
            TMRDLINKFORMOFWAY13: {
                figure: [
                    { label: '等于 0', color: '#FF0000' },
                    { label: '等于 1', color: '#C0C0C0' }
                ]
            },
            TMRDLINKFORMOFWAY14: {
                figure: [
                    { label: '等于 0', color: '#00FF00' },
                    { label: '等于 1', color: '#FF0000' }
                ]
            },
            TMRDLINKFORMOFWAY15: {
                figure: [
                    { label: '等于 0', color: '#0000FF' },
                    { label: '等于 1', color: '#8201B2' }
                ]
            },
            TMRDLINKFORMOFWAY16: {
                figure: [
                    { label: '等于 0', color: '#5176FD' },
                    { label: '等于 1', color: '#9ACF00' }
                ]
            },
            TMRDLINKFORMOFWAY17: {
                figure: [
                    { label: '等于 0', color: '#467723' },
                    { label: '等于 1', color: '#999999' }
                ]
            },
            TMRDLINKFORMOFWAY20: {
                figure: [
                    { label: '等于 0', color: '#0000FF' },
                    { label: '等于 1', color: '#C0C0C0' }
                ]
            },
            TMRDLINKFORMOFWAY31: {
                figure: [
                    { label: '等于 0', color: '#A500EC' },
                    { label: '等于 1', color: '#2FFFE3' }
                ]
            },
            TMRDLINKFORMOFWAY33: {
                figure: [
                    { label: '等于 0', color: '#8201B2' },
                    { label: '等于 1', color: '#C0C0C0' }
                ]
            },
            TMRDLINKFORMOFWAY34: {
                figure: [
                    { label: '等于 0', color: '#FF0000' },
                    { label: '等于 1', color: '#777777' }
                ]
            },
            TMRDLINKFORMOFWAY35: {
                figure: [
                    { label: '等于 0', color: '#3291F5' },
                    { label: '等于 1', color: '#FFC000' }
                ]
            },
            TMRDLINKFORMOFWAY36: {
                figure: [
                    { label: '等于 0', color: '#FF0000' },
                    { label: '等于 1', color: '#0000FF' }
                ]
            },
            TMRDLINKFORMOFWAY37: {
                figure: [
                    { label: '等于 0', color: '#C0C0C0' },
                    { label: '等于 1', color: '#FF0000' }
                ]
            },
            TMRDLINKFORMOFWAY38: {
                figure: [
                    { label: '等于 0', color: '#00FF00' },
                    { label: '等于 1', color: '#C0C0C0' }
                ]
            },
            TMRDLINKFORMOFWAY39: {
                figure: [
                    { label: '等于 0', color: '#FF9BFD' },
                    { label: '等于 1', color: '#0000FF' }
                ]
            },
            TMRDLINKINTRTICRANK: {
                figure: [
                    // { label: '无', color: '#417505' },
                    { label: '高速', color: '#9B9B9B' },
                    { label: '城市高速', color: '#D8D8D8' },
                    { label: '干线道路', color: '#D0011B' },
                    { label: '其它道路', color: '#4990E2' },
                    { label: '多个等级', color: '#4A4A4A' },
                    { label: '无intRtic信息', color: '#B8E986' }
                ]
            },
            TMRDLINKLIMITTYPE3: {
                figure: [
                    { label: '无', color: '#9c8c89' },
                    { label: '有禁止穿行', color: '#ff0000' }
                ]
            },
            TMRDLINKLIMITTYPE0: {
                figure: [
                    { label: '无', color: '#9c8c89' },
                    { label: '维修中', color: '#ff0000' }
                ]
            },
            TMRDLINKLIMITTYPE1: {
                figure: [
                    { label: '双方向', color: '#7364C9' },
                    { label: '单方向', color: '#00FFFF' },
                    { label: '其他', color: '#C0C0C0' },
                    { label: '无单行限制', color: '#818001' }
                ]
            },
            TMRDLINKLIMITTYPE2: {
                figure: [
                    { label: '等于 0', color: '#FF0000' },
                    { label: '等于 1', color: '#2FFFE3' }
                ]
            },
            TMRDLINKLIMITTYPE5: {
                figure: [
                    { label: '双方向', color: '#C0C0C0' },
                    { label: '单方向', color: '#993399' },
                    { label: '其他', color: '#818001' },
                    { label: '无季节性关闭道路限制', color: '#FF6464' }
                ]
            },
            TMRDLINKLIMITTYPE6: {
                figure: [
                    { label: '双方向', color: '#C0C0C0' },
                    { label: '单方向', color: '#FF6464' },
                    { label: '其他', color: '#818001' },
                    { label: '无Usage fee required限制', color: '#FFC000' }
                ]
            },
            TMRDLINKLIMITTYPE7: {
                figure: [
                    { label: '双方向', color: '#993399' },
                    { label: '单方向', color: '#64DC14' },
                    { label: '其他', color: '#FF0000' },
                    { label: '无超车限制', color: '#C93146' }
                ]
            },
            TMRDLINKLIMITTYPE8: {
                figure: [
                    { label: '无', color: '#9c8c89' },
                    { label: '外地车限行', color: '#ff0000' }
                ]
            },
            TMRDLINKLIMITTYPE9: {
                figure: [
                    { label: '无', color: '#9c8c89' },
                    { label: '尾号限行', color: '#ff0000' }
                ]
            },
            TMRDLINKLIMITTYPE10: {
                figure: [
                    { label: '等于 0', color: '#777777' },
                    { label: '等于 1', color: '#FF0000' }
                ]
            },
            TMRDLINKRTICRANK: {
                figure: [
                    { label: '无', color: '#00A500' },
                    { label: '高速', color: '#777777' },
                    { label: '城市高速', color: '#C0C0C0' },
                    { label: '干线道路', color: '#FF0000' },
                    { label: '其他道路', color: '#2FFFE3' },
                    { label: '多个等级', color: '#000000' },
                    { label: '无rtic信息', color: '#64DC14' }
                ]
            },
            TMRDLINKZONECOUNT: {
                figure: [
                    { label: '等于 0', color: '#0000FF' },
                    { label: '等于 1', color: '#FF0000' },
                    { label: '大于 1', color: '#C0C0C0' }
                ]
            },
            TMRDLINKZONESIDE: {
                figure: [
                    { label: '左右相同', color: '#993399' },
                    { label: '左右不同', color: '#64DC14' },
                    { label: '无zone信息', color: '#FF6464' },
                    { label: '只有一条zone信息', color: '#818001' }
                ]
            },
            TMRDLINKZONETPYE: {
                figure: [
                    { label: '未分类', color: '#00A500' },
                    { label: 'AOIZone', color: '#777777' },
                    { label: 'KDZone', color: '#C0C0C0' },
                    { label: 'GCZone', color: '#FF0000' },
                    { label: '多种类型', color: '#2FFFE3' },
                    { label: '无ZONE信息', color: '#0000FF' }
                ]
            },
            TMRDLINKSPECIALTRAFFIC: {
                figure: [
                    { label: '否', color: '#909090' },
                    { label: '是', color: '#FF0000' }
                ]
            },
            TMRDLINKSPEEDLIMITCONDITIONCOUNT: {
                figure: [
                    { label: '等于 0', color: '#909090' },
                    { label: '等于 1', color: '#FA04C9' },
                    { label: '等于 2', color: '#FF0000' },
                    { label: '等于 3', color: '#A500EC' },
                    { label: '等于 4', color: '#FF9326' },
                    { label: '大于 4', color: '#0000FF' }
                ]
            },
            TMRDLINKTOLLINFO: {
                figure: [
                    { label: '未调查', color: '#000000' },
                    { label: '收费', color: '#FF0000' },
                    { label: '免费', color: '#909090' },
                    { label: '收费道路的免费区间', color: '#3075FF' }
                ]
            },
            TMRDLINKLIMITTRUCK: {
                figure: [
                    { label: '等于 0', color: 'grey' },
                    { label: '等于 1', color: 'red' }
                ]
            },
            TMRDLINKIMI: {
                figure: [
                    { label: '其他道路', color: '#c6c0bc' },
                    { label: '交叉点内部道路', color: '#1dffff' },
                    { label: '转弯道', color: '#5298fd' },
                    { label: '无法描述的', color: '#ff0000' }
                ]
            },
            TMRDLINKWALKSTAIR: {
                figure: [
                    { label: '未采集', color: '#c1c1c1' },
                    { label: '无(外业验证)', color: '#ff0000' },
                    { label: '有(外业验证)', color: '#0000ff' }
                ]
            },
            TMRDLINKSIDEWALK: {
                figure: [
                    { label: '未采集', color: '#c1c1c1' },
                    { label: '无(外业验证)', color: '#ff0000' },
                    { label: '有(外业验证)', color: '#0000ff' }
                ]
            },
            TMRDLINKWALK: {
                figure: [
                    { label: '未调查', color: '#c1c1c1' },
                    { label: '允许', color: '#ff0000' },
                    { label: '禁止', color: '#0000ff' }
                ]
            },
            TMRDLINKURBAN: {
                figure: [
                    { label: '是', color: '#ff0000' },
                    { label: '否', color: '#c1c1c1' }
                ]
            },
            TMRDLINKFORMNUM: {
                figure: [
                    { label: '无形态', color: '#c1c1c1' },
                    { label: '= 1', color: '#00A500' },
                    { label: '= 2', color: '#802ba1' },
                    { label: '= 3', color: '#0000FF' },
                    { label: '= 4', color: '#FF0000' },
                    { label: '> 4', color: '#b6755f' }
                ]
            },
            TMRDLINKFORMOFWAY: {
                figure: [
                    { label: '未调查', color: '#646464' },
                    { label: '无属性', color: '#646464' },
                    { label: '其他', color: '#E0CEF2' },
                    { label: 'IC', color: '#FF6CF7' },
                    { label: 'JCT', color: '#FF0007' },
                    { label: 'SA', color: '#00FC57' },
                    { label: 'PA', color: '#FFFA42' },
                    { label: '全封闭道路', color: '#646464' },
                    { label: '匝道', color: '#70D7B2' },
                    { label: '跨线天桥(Overpass)', color: '#B0BAB4' },
                    { label: '跨线地道(Underpass)', color: '#2C2C2C' },
                    { label: '私道', color: '#00C2D8' },
                    { label: '步行街', color: '#4280AA' },
                    { label: '过街天桥', color: '#646464' },
                    { label: '公交专用道', color: '#FF9326' },
                    { label: '自行车道', color: '#646464' },
                    { label: '跨线立交桥', color: '#00197D' },
                    { label: '桥', color: '#7C3B4F' },
                    { label: '隧道', color: '#C47B62' },
                    { label: '立交桥', color: '#006E52' },
                    { label: '环岛', color: '#FFA86D' },
                    { label: '辅路', color: '#FB5D21' },
                    { label: '掉头口(U-Turn)', color: '#C5AD98' },
                    { label: 'POI连接路', color: '#FFD0E7' },
                    { label: '提右', color: '#C03FF8' },
                    { label: '提左', color: '#E0C535' },
                    { label: '主辅路出入口', color: '#5CFC66' },
                    { label: '窄道路', color: '#5CFC66' },
                    { label: '主路', color: '#00D83B' },
                    { label: '侧道', color: '#E281D4' },
                    { label: '交叉点内道路', color: '#00FFFF' },
                    { label: '未定义交通区域(UTA)', color: '#6D6BC4' },
                    { label: '区域内道路', color: '#DFBDBE' },
                    { label: '停车场出入口连接路(POI Access Road)', color: '#002ABB' },
                    { label: '停车场出入口虚拟连接路', color: '#00197D' },
                    { label: 'Highway对象外JCT', color: '#00FDEF' },
                    { label: '风景路线', color: '#C0DA3D' },
                    { label: '停车位引导道路(Parking Lane)', color: '#FF89C9' },
                    { label: '多种形态', color: '#80921c' }
                ]
            },
            TMRDLINKSIDES: {
                figure: [
                    { label: '左右号码均不为0且相同', color: '#ff0000' },
                    { label: '左右号码均不为0且不同', color: '#002ABB' },
                    { label: '行政区划号码都为0', color: '#00A500' },
                    { label: '左右行政区划号码有一个为0', color: '#646464' }
                ]
            },
            TMRDLINKFORMPLUS: {
                figure: [
                    { label: '全封闭道路+匝道', color: '#ff0000' },
                    { label: '全封闭道路+JCT', color: '#002ABB' },
                    { label: '匝道+JCT', color: '#FF9326' },
                    { label: '全封闭道路+JCT+匝道', color: '#802ba1' },
                    { label: 'POI连接路+区域内道路', color: '#b6755f' },
                    { label: '全封闭道路+IC', color: '#80921c' },
                    { label: '匝道+IC', color: '#7C3B4F' },
                    { label: 'SA+POI连接路', color: '#FF89C9' },
                    { label: 'PA+POI连接路', color: '#00197D' },
                    { label: 'SA+IC+匝道', color: '#00FDEF' },
                    { label: 'PA+IC+匝道', color: '#00D83B' },
                    { label: '全封闭道路+JCT+匝道+Highway对象外JCT', color: '#4280AA' },
                    { label: '有冲突(加粗)', color: '#000000' },
                    { label: '未包含', color: '#c1c1c1' }
                ]
            },
            TMRDLINKFORMBRIDGE: {
                figure: [
                    { label: '有', color: '#ff0000' },
                    { label: '无', color: '#c1c1c1' }
                ]
            },
            TMRDLINKFORMREGIONROAD: {
                figure: [
                    { label: '有', color: '#ff0000' },
                    { label: '无', color: '#c1c1c1' }
                ]
            },
            TMRDLINKFORMUNDERBUILDING: {
                figure: [
                    { label: '有', color: '#ff0000' },
                    { label: '无', color: '#c1c1c1' }
                ]
            },
            TMRDNODEFORM: {
                figure: [
                    { label: '未调查或多个形态值', color: '#c0c0c0' },
                    { label: '无属性(空心圆圈)', color: '#c0c0c0' },
                    { label: '图廓点', img: 'nodeForm2.png' },
                    { label: 'CRF Info点', img: 'nodeForm3.png' },
                    { label: '收费站', img: 'nodeForm4.png' },
                    { label: 'highway起点', img: 'nodeForm5.png' },
                    { label: 'highway终点', img: 'nodeForm6.png' },
                    { label: 'IC', img: 'nodeForm10.png' },
                    { label: 'JCT', img: 'nodeForm11.png' },
                    { label: '桥', img: 'nodeForm12.png' },
                    { label: '隧道', img: 'nodeForm13.png' },
                    { label: '车站', img: 'nodeForm14.png' },
                    { label: '障碍物', img: 'nodeForm15.png' },
                    { label: '门牌号码点', img: 'nodeForm16.png' },
                    { label: '幅宽变化点', img: 'nodeForm20.png' },
                    { label: '种别变化点', img: 'nodeForm21.png' },
                    { label: '车道变化点', img: 'nodeForm22.png' },
                    { label: '分隔带变化点', color: '#b6755f' },
                    { label: '铁路道口', img: 'nodeForm30.png' },
                    { label: '有人看守铁路道口', img: 'nodeForm31.png' },
                    { label: '无人看守铁路道口', img: 'nodeForm32.png' },
                    { label: 'KDZone与道路交点', color: '#802ba1' }
                ]
            }
        };

        /**
         * 根据要素类型获取对应的config
         * @method getConfig
         * @author LiuZhe
         * @date   2017-09-11
         * @param  {string} key 要素类型
         * @return {object} Config对象
         */
        this.getConfig = function (key) {
            var conf = config[key];
            if (!conf) {
                return null;
            }
            return conf;
        };

        /**
         * 根据要素类型获取对应的config
         * @method getFigure
         * @author LiuZhe
         * @date   2017-09-11
         * @param  {string} key 要素类型
         * @return {object} Config对象
         */
        this.getFigure = function (key) {
            var conf = this.getConfig(key);
            if (!conf) {
                return null;
            }
            if (!conf.figure) {
                return null;
            }
            return conf.figure;
        };
    };

    return function () {
        if (!instance) {
            instance = new Singleton();
        }
        return instance;
    };
}());
