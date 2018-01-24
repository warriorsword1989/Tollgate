/**
 * 工具类
 * @class fastmap.uikit.Util
 * @author XuJie
 * @date   2017-09-11
 *
 * @copyright @Navinfo, all rights reserved.
 */
fastmap.uikit.Util = L.Class.extend({
    /**
     * 初始化方法
     * @method initialize
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    initialize: function () {
        // 绑定函数作用域
        FM.Util.bind(this);

        this.featureSelector = fastmap.mapApi.FeatureSelector.getInstance();
        this.geometryAlgorithm = fastmap.mapApi.geometry.GeometryAlgorithm.getInstance();
        this.parallelTool = fastmap.mapApi.Parallel();
        this.geometryFactory = fastmap.mapApi.symbol.GeometryFactory.getInstance();
        this.sceneController = fastmap.mapApi.scene.SceneController.getInstance();
        this.sourceController = fastmap.mapApi.source.SourceController.getInstance();
        this.meshAlgm = fastmap.mapApi.MeshAlgorithm.getInstance();
    },

    /**
     * 根据node查找挂接link
     * @method getTopoLinks
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} node 点对象
     * @return {array} 挂接线
     */
    getTopoLinks: function (node) {
        var topoLinks = [];
        var topoLinkIds = node.properties.links;
        for (var i = 0; i < topoLinkIds.length; ++i) {
            var topoLink = this.featureSelector.selectByFeatureId(topoLinkIds[i], 'RDLINK');
            topoLinks.push(topoLink);
        }
        return topoLinks;
    },

    /**
     * 通过node找挂接的并且可通行的links
     * 顺序:从node开始，查找可通行的link
     * 规则：双方向、顺方向snode相同、逆方向enode相同
     * @method getCanPassLinksByNode
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} node 点对象,需要是feature类型
     * @return {array} 可通行的links
     */
    getCanPassLinksByNode: function (node) {
        var nodeId = node.properties.id;
        var topoLinks = this.getTopoLinks(node);
        for (var i = topoLinks.length - 1; i >= 0; i--) {
            var flag = false;
            var feature = topoLinks[i].properties;
            if (feature.direct === '2') { // 顺方向
                if (feature.snode == nodeId) {
                    flag = true;
                }
            } else if (feature.direct === '3') { // 逆方向
                if (feature.enode == nodeId) {
                    flag = true;
                }
            } else { // 双方向
                flag = true;
            }
            if (!flag) {
                topoLinks.splice(i, 1);
            }
        }
        return topoLinks;
    },

    /**
     * 判断node是否和link直接挂接
     * @method isHooked
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} node 线对象,需要是feature类型
     * @param  {object} link 线对象,需要是feature类型
     * @return {boolean} 挂接返回true，否则false
     */
    isHooked: function (node, link) {
        var sNodePid = parseInt(link.properties.snode, 10);
        var eNodePid = parseInt(link.properties.enode, 10);

        if (sNodePid === node.properties.id || eNodePid === node.properties.id) {
            return true;
        }

        return false;
    },

    /**
     * 判断两条link是否可通行
     * @method canPass
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} link1 线对象,需要是feature类型
     * @param  {object} link2 线对象,需要是feature类型
     * @return {boolean} 可通行返回true，否则false
     */
    canPass: function (link1, link2) {
        var link1Snode = parseInt(link1.properties.snode, 10);
        var link1Enode = parseInt(link1.properties.enode, 10);
        var link2Snode = parseInt(link2.properties.snode, 10);
        var link2Enode = parseInt(link2.properties.enode, 10);
        var link1Direct = link1.properties.direct;
        var link2Direct = link2.properties.direct;

        // 道路方向 0 未调查 1 双方向（默认值） 2 顺方向（相对于Link方向） 3 逆方向（相对于Link方向）
        if (link1Snode == link2Snode) {
            if (link1Direct == 2 || link2Direct == 3) {
                return false;
            }
        } else if (link1Snode == link2Enode) {
            if (link1Direct == 2 || link2Direct == 2) {
                return false;
            }
        } else if (link1Enode == link2Snode) {
            if (link1Direct == 3 || link2Direct == 3) {
                return false;
            }
        } else if (link1Enode == link2Enode) {
            if (link1Direct == 3 || link2Direct == 2) {
                return false;
            }
        } else {
            // 两条线不挂接
            return false;
        }

        return true;
    },

    /**
     * 判断两条link是否挂接
     * @method canHookByLink
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} link1 线对象,需要是feature类型
     * @param  {object} link2 线对象,需要是feature类型
     * @return {boolean} 挂接返回true，否则false
     */
    canHookByLink: function (link1, link2) {
        var link1Snode = parseInt(link1.properties.snode, 10);
        var link1Enode = parseInt(link1.properties.enode, 10);
        var link2Snode = parseInt(link2.properties.snode, 10);
        var link2Enode = parseInt(link2.properties.enode, 10);

        if (link1Snode === link2Snode || link1Snode === link2Enode || link1Enode === link2Snode || link1Enode === link2Enode) {
            return true;
        }

        return false;
    },

    /**
     * 根据两条link和其对应的经过线数组，求出经过线串的起终点，
     * 其中经过线必须连续，否则返回的点错误
     * @method getLinksNodes
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} sLink 线对象,需要是feature类型
     * @param  {object} eLink 线对象,需要是feature类型
     * @param  {array} vLinks 经过线
     * @return {array} 经过线串的起终点
     */
    getLinksNodes: function (sLink, eLink, vLinks) {
        var sLinkSnode = parseInt(sLink.properties.snode, 10);
        var sLinkEnode = parseInt(sLink.properties.enode, 10);
        var eLinkSnode = parseInt(eLink.properties.snode, 10);
        var eLinkEnode = parseInt(eLink.properties.enode, 10);
        var vLinkSnode = 0;
        var vLinkEnode = 0;

        for (var i = 0; i < vLinks.length; i++) {
            if (i === 0) {
                if (vLinks[i].properties.snode == sLinkSnode || vLinks[i].properties.snode == sLinkEnode) {
                    vLinkSnode = vLinks[i].properties.snode;
                    vLinkEnode = vLinks[i].properties.enode;
                } else if (vLinks[i].properties.enode == sLinkSnode || vLinks[i].properties.enode == sLinkEnode) {
                    vLinkSnode = vLinks[i].properties.enode;
                    vLinkEnode = vLinks[i].properties.snode;
                }
            } else {
                vLinkEnode = this.getOtherNode(vLinks[i], vLinkEnode);
            }
        }
        return [vLinkSnode, vLinkEnode];
    },

    /**
     * 将根据一条link和给定距离生成对应的平行线（为地理坐标）
     * @method containerToLatlng
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} geo 几何对象
     * @param  {number} width 宽度
     * @return {array} 生成的平行线
     */
    containerToLatlng: function (geo, width) {
        var offsetSegments = this.parallelTool.offsetPointLine(geo, width);
        var arr = this.parallelTool.joinLineSegments(offsetSegments, width);
        var res = [];
        for (var i = 0; i < arr.length; i++) {
            res.push([]);
            var temp = map.containerPointToLatLng([arr[i].x, arr[i].y]);
            res[i][0] = temp.lng;
            res[i][1] = temp.lat;
        }
        return res;
    },

    /**
     * 传入node数组，找出与其挂接的linkPid
     * @method connectLinksByLinkFeature
     * @author XuJie
     * @date   2017-09-11
     * @param  {array} nodes 点对象数组
     * @param  {array} expectionLinks 不需要的linkpid
     * @return {array} 挂接线
     */
    connectLinksByLinkFeature: function (nodes, expectionLinks) {
        var _self = this;
        var topoLinks = [];
        nodes.forEach(function (data) {
            var nodeObj = _self.featureSelector.selectByFeatureId(parseInt(data, 10), 'RDNODE');
            if (nodeObj) {
                topoLinks = topoLinks.concat(nodeObj.properties.links);
            }
            // 如果从瓦变中取不到就得从服务找;
        });
        if (expectionLinks && expectionLinks instanceof Array) {
            for (var i = 0; i < topoLinks.length; i++) {
                for (var j = 0; j < expectionLinks.length; j++) {
                    if (topoLinks[i] == expectionLinks[j]) {
                        topoLinks.splice(i, 1);
                    }
                }
            }
        }
        return topoLinks;
    },

    /**
     * 根据link和link的一个node查找挂接在此node上的可通行的link
     * @method getRouteLinks
     * @author XuJie
     * @date   2017-09-11
     * @param  {array} inNodePid 起始node
     * @param  {number} expectionLinks 不需要的linkpid
     * @return {array} 可通行的线
     */
    getRouteLinks: function (inNodePid, expectionLinks) {
        var self = this;
        var topoLinks = this.featureSelector.selectByFunction(function (feature) {
            if (FM.Util.isObject(expectionLinks)) {
                if (feature.properties.id === expectionLinks.properties.id) {
                    return false;
                }
            } else if (FM.Util.isArray(expectionLinks)) {
                for (var i = 0; i < expectionLinks.length; i++) {
                    if (feature.properties.id === expectionLinks[i].properties.id) {
                        return false;
                    }
                }
            }
            return self.isRouted(inNodePid, feature);
        }, 'RDLINK');

        return topoLinks;
    },

    /**
     * 根据link和link的一个node查找另一个node
     * @method getLinkOtherNode
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} link 线对象
     * @param  {object} node 点对象
     * @return {object} 点对象
     */
    getLinkOtherNode: function (link, node) {
        var sNodePid = parseInt(link.properties.snode, 10);
        var eNodePid = parseInt(link.properties.enode, 10);

        if (sNodePid === node.properties.id) {
            return this.featureSelector.selectByFeatureId(eNodePid, 'RDNODE');
        }
        return this.featureSelector.selectByFeatureId(sNodePid, 'RDNODE');
    },

    /**
     * 根据link和link的一个端点nodePid，获取另外一个端点的nodePid
     * @method getOtherNode
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} link 线对象
     * @param  {string} nodePid 唯一标识
     * @return {string} nodePid
     */
    getOtherNode: function (link, nodePid) {
        return link.properties.snode === nodePid ? link.properties.enode : link.properties.snode;
    },

    /**
     * 根据link和link的通行方向，获取通行方向的终点nodePid
     * @method getDirectEndNode
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} link 线对象
     * @param  {number} direct 通行方向
     * @return {string} nodePid
     */
    getDirectEndNode: function (link, direct) {
        if (direct === undefined || direct === null) {
            direct = link.properties.direct;
        }

        return direct === 3 ? link.properties.snode : link.properties.enode;
    },

    /**
     * 根据pids和geoLiveType从服务器查询要素,返回canvasFeature格式要素
     * @method getCanvasFeaturesFromServer
     * @author XuJie
     * @date   2017-09-11
     * @param  {array} pids 唯一标识
     * @param  {string} geoLiveType 要素类型
     * @param  {string} bdId 唯一标识
     * @return {object} 要素
     */
    getCanvasFeaturesFromServer: function (pids, geoLiveType, bdId) {
        var self = this;
        return this.dataService
            .getObject(geoLiveType, pids, bdId)
            .then(function (res) {
                // modified by chenx on 2017-8-18
                // 临时解决专题图场景下要素作业报错的问题，使用常规渲染模型对数据进行转换
                // 原因：getObject接口返回的都是是要素的常规形态的数据，在专题图场景下，会使用专题图数据源的模型转换器，
                // 导致模型转换为null，从而导致后续的一系列错误
                // 终极解决方案：专题图渲染接口返回要素的常规场景属性+专题图特有属性，前端的渲染数据模型也要做对应改进，
                // 以便支持在专题图场景下进行任意要素的作业
                // var layers = self.sceneController.getLoadedLayersByFeatureType(geoLiveType);
                // var parsor = self.sourceController.getSource(layers[0].getSourceName()).parsor;
                var parsor = FM.mapApi.render.data.Feature;
                var zoom = self.sceneController._map.getZoom();
                var canvasFeatures = parsor.transform(res, {
                    z: zoom
                }, parsor);
                var tmpObj = {};
                for (var i = 0; i < canvasFeatures.length; ++i) {
                    var canvasFeature = canvasFeatures[i];
                    var id = canvasFeature.properties.id;
                    tmpObj[id] = canvasFeature;
                }
                var sortedCanvasFeatures = [];
                for (i = 0; i < pids.length; ++i) {
                    var pid = pids[i];
                    sortedCanvasFeatures.push(tmpObj[pid]);
                }
                return sortedCanvasFeatures;
            });
    },

    /**
     * 根据inNode和link, 判断是否可以以inNode为起点在link上通行;inNode与link必须直接挂接
     * @method isRouted
     * @author XuJie
     * @date   2017-09-11
     * @param  {string} inNodePid 唯一标识
     * @param  {object} link 线对象
     * @return {boolean} 可以通行返回true,否则false
     */
    isRouted: function (inNodePid, link) {
        var sNodePid = parseInt(link.properties.snode, 10);
        var eNodePid = parseInt(link.properties.enode, 10);
        var direct = parseInt(link.properties.direct, 10);
        if (sNodePid === inNodePid) {
            if (direct == 3) {
                return false;
            }
        } else if (eNodePid === inNodePid) {
            if (direct == 2) {
                return false;
            }
        } else {
            return false;
        }

        return true;
    },

    /**
     * 根据outNode和link, 判断是否 link 可以通行至 outNode ，并且以outNode为终点;outNode 与link必须直接挂接
     * @method isRoutedOut
     * @author XuJie
     * @date   2017-09-11
     * @param  {string} outNodePid 唯一标识
     * @param  {object} link 线对象
     * @return {boolean} 可以通行返回true,否则false
     */
    isRoutedOut: function (outNodePid, link) {
        var sNodePid = parseInt(link.properties.snode, 10);
        var eNodePid = parseInt(link.properties.enode, 10);
        var direct = parseInt(link.properties.direct, 10);
        if (sNodePid === outNodePid) {
            if (direct == 2) {
                return false;
            }
        } else if (eNodePid === outNodePid) {
            if (direct == 3) {
                return false;
            }
        } else {
            return false;
        }

        return true;
    },

    /**
     * 如果两个点离的很近，则认为是同一个点
     * @method isSamePoint
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} pt1 点对象
     * @param  {object} pt2 点对象
     * @return {boolean} 同一个点返回true,否则false
     */
    isSamePoint: function (pt1, pt2) {
        var tol = 0.000005;
        var c1 = pt1.coordinates;
        var c2 = pt2.coordinates;

        return Math.abs(c1[0] - c2[0]) < tol && Math.abs(c1[1] - c2[1]) < tol;
    },

    /**
     * 判断一根link是否是闭合的，可以构成一个面
     * @method isFaceLink
     * @author XuJie
     * @date   2017-09-11
     * @param  {array} coordinates 坐标
     * @return {boolean} 闭合返回true,否则false
     */
    isFaceLink: function (coordinates) {
        if (coordinates.length < 2) {
            return false;
        }
        var startNodeGeo = coordinates[0];
        var endNodeGeo = coordinates[coordinates.length - 1];
        return startNodeGeo[0] === endNodeGeo[0] && startNodeGeo[1] === endNodeGeo[1];
    },

    /**
     * 将link按照相邻的形状点，打断成多个直线段
     * @method splitToSegments
     * @author XuJie
     * @date   2017-09-11
     * @param  {array} geometry 几何对象
     * @return {array} 直线段
     */
    splitToSegments: function (geometry) {
        var segments = [];
        if (geometry.coordinates.length < 2) {
            return segments;
        }
        for (var i = 0; i < geometry.coordinates.length - 1; i++) {
            segments.push(this.createPath(geometry.coordinates.slice(i, i + 2)));
        }
        return segments;
    },

    /**
     * 根据coordinates创建一个 点
     * @method createPoint
     * @author XuJie
     * @date   2017-09-11
     * @param  {array} coordinates 坐标
     * @return {object} 点
     */
    createPoint: function (coordinates) {
        return {
            type: 'Point',
            coordinates: coordinates
        };
    },

    /**
     * 根据coordinates创建一个 线
     * @method createPath
     * @author XuJie
     * @date   2017-09-11
     * @param  {array} coordinates 坐标
     * @return {object} 线
     */
    createPath: function (coordinates) {
        return {
            type: 'LineString',
            coordinates: coordinates
        };
    },

    /**
     * 根据交点，以及交点所在的线段的序号，对折线进行分割
     * 分割原则：以相邻两个交点生成的折线的中点附近的形状点为分割点
     * @method splitLink
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} point 点对象
     * @param  {object} geometry 几何对象
     * @param  {array} seqArr 线段数组
     * @return {array} lines
     */
    splitLink: function (point, geometry, seqArr) {
        if (seqArr.length == 1) {
            return [geometry];
        }

        var lines = [];

        var c = [];
        c.push(point.coordinates);
        for (var i = seqArr[0] + 1; i <= seqArr[1]; i++) {
            c.push(geometry.coordinates[i]);
        }
        c.push(point.coordinates);

        var len = this.geometryAlgorithm.getLength(this.createPath(c));
        var halfLen = len / 2;

        c = [];
        c.push(point.coordinates);
        var stop = seqArr[1];
        for (i = seqArr[0] + 1; i <= stop; i++) {
            c.push(geometry.coordinates[i]);
            if (this.geometryAlgorithm.getLength(this.createPath(c)) > halfLen) {
                stop = i;
                break;
            }
        }

        c = geometry.coordinates.slice(0, stop + 1);
        lines.push(this.createPath(c));

        c = geometry.coordinates.slice(stop);
        seqArr = seqArr.slice(1);
        for (i = 0; i < seqArr.length; i++) {
            seqArr[i] -= stop;
        }
        Array.prototype.push.apply(lines, this.splitLink(point, this.createPath(c), seqArr));

        return lines;
    },

    /**
     * 根据交点，以及交点所在的线段的序号，对折线进行分割
     * 分割原则：分割成以交点为中心的，前后距离约20米的折线，都是以形状点分割
     * @method splitLink2
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} point 点对象
     * @param  {object} geometry 几何对象
     * @param  {array} seqArr 线段数组
     * @return {array} lines
     */
    splitLink2: function (point, geometry, seqArr) {
        var lines = [];
        var tolerence = 5; // 交点两边线段的长度

        var i;
        var start = 0;
        var end;
        if (seqArr.length > 1) {
            end = seqArr[1];
        } else {
            end = geometry.coordinates.length - 1;
        }
        var c = [];
        c.push(point.coordinates);
        for (i = seqArr[0]; i >= start; i--) {
            c.push(geometry.coordinates[i]);
            if (this.geometryAlgorithm.getLength(this.createPath(c)) >= tolerence) {
                start = i;
                break;
            }
        }

        c = [];
        c.push(point.coordinates);
        for (i = seqArr[0] + 1; i <= end; i++) {
            c.push(geometry.coordinates[i]);
            if (this.geometryAlgorithm.getLength(this.createPath(c)) >= tolerence) {
                end = i;
                break;
            }
        }

        c = geometry.coordinates.slice(start, end + 1);
        lines.push(this.createPath(c));

        if (seqArr.length > 1) {
            c = geometry.coordinates.slice(end);
            seqArr = seqArr.slice(1);
            for (i = 0; i < seqArr.length; i++) {
                seqArr[i] -= end;
            }
            Array.prototype.push.apply(lines, this.splitLink2(point, this.createPath(c), seqArr));
        }

        return lines;
    },

    /**
     * 根据交点，以及交点在link中的线段的序号，对link进行分割
     * 注意：该函数会对link数组进行重新排序
     * @method splitLinks
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} point 点对象
     * @param  {array} linkObjs 线数组
     * @return {array} lines
     */
    splitLinks: function (point, linkObjs) {
        linkObjs.sort(function (a, b) {
            if (a.feature.properties.geoLiveType == b.feature.properties.geoLiveType) {
                if (a.feature.properties.id == b.feature.properties.id) {
                    return a.seqNum > b.seqNum ? 1 : -1;
                }
                return a.feature.properties.id > b.feature.properties.id ? 1 : -1;
            }
            return a.feature.properties.geoLiveType > b.feature.properties.geoLiveType ? 1 : -1;
        });
        var list = [];
        var temp = {
            feature: linkObjs[0].feature,
            seqArr: [linkObjs[0].seqNum]
        };
        list.push(temp);
        var obj;
        var i,
            j;
        for (i = 1; i < linkObjs.length; i++) {
            obj = linkObjs[i];
            if (temp.feature.properties.geoLiveType == obj.feature.properties.geoLiveType && temp.feature.properties.id == obj.feature.properties.id) {
                temp.seqArr.push(obj.seqNum);
            } else {
                temp = {
                    feature: obj.feature,
                    seqArr: [obj.seqNum]
                };
                list.push(temp);
            }
        }

        var ll = [];
        for (i = 0; i < list.length; i++) {
            var geometry = {};
            if (list[i].feature.geometry.type === 'GeometryCollection') { // 对选中的对象为测线的处理
                geometry = list[i].feature.geometry.geometries[1];
            } else {
                geometry = list[i].feature.geometry;
            }
            var geoms = this.splitLink2(point, geometry, list[i].seqArr);
            for (j = 0; j < geoms.length; j++) {
                ll.push({
                    feature: list[i].feature,
                    segment: geoms[j],
                    seqNum: list[i].seqArr[j] // 交点所在的线段的序号
                });
            }
        }

        return ll;
    },

    /**
     * 判断两个要素是否为同一个
     * @method isSameFeature
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} feature1 要素
     * @param  {object} feature2 要素
     * @return {boolean} 同一个返回true,否则false
     */
    isSameFeature: function (feature1, feature2) {
        return feature1.properties.geoLiveType == feature2.properties.geoLiveType && feature1.properties.id == feature2.properties.id;
    },

    /**
     * 根据引导坐标、显示坐标、关联link计算显示坐标icon与正北的顺时针夹角(情报矢量化新建tips使用)
     * @method getNorthAngle
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} showPoint 显示点
     * @param  {object} guidePoint 引导点
     * @param  {object} linkGeo 关联link
     * @return {number} 与正北的顺时针夹角
     */
    getNorthAngle: function (showPoint, guidePoint, linkGeo) {
        var data = this.geometryAlgorithm.nearestLocations(showPoint, linkGeo);
        var previousPoint = this.geometryFactory.fromGeojson(data.previousPoint);
        var nextPoint = this.geometryFactory.fromGeojson(data.nextPoint);
        var point = this.geometryFactory.fromGeojson(guidePoint);
        var revealPoint = this.geometryFactory.fromGeojson(showPoint);
        var vector1 = previousPoint.minus(nextPoint);
        var vector2 = nextPoint.minus(previousPoint);
        var oriVector = point.minus(revealPoint);
        var matrix = new fastmap.mapApi.symbol.Matrix();
        matrix = matrix.makeRotate(-90);
        var rotateOriVector = oriVector.crossMatrix(matrix);
        var vY = new fastmap.mapApi.symbol.Vector(0, 1);
        var angle1 = rotateOriVector.angleTo(vector1);
        var angle2 = rotateOriVector.angleTo(vector2);
        var angle3 = 0;
        if (angle1 < angle2) {
            angle3 = vY.angleTo(vector1);
            if (vector1.x < 0) {
                angle3 = 360 - angle3;
            }
        } else {
            angle3 = vY.angleTo(vector2);
            if (vector2.x < 0) {
                angle3 = 360 - angle3;
            }
        }
        return angle3;
    },

    /**
     * 计算图幅
     * @method testInMeshes
     * @author XuJie
     * @date   2017-09-11
     * @param  {object} geom 几何对象
     * @param  {array} meshList 图幅列表
     * @return {boolean} 通过检测返回true,否则false
     */
    testInMeshes: function (geom, meshList) {
        if (geom.type !== 'Point') {
            var bbox = this.geometryAlgorithm.bboxToPolygon(this.geometryAlgorithm.bbox(geom));
            geom = this.geometryAlgorithm.centroid(bbox);
        }
        // 计算图幅时以5位精度进行计算
        var latlng = {
            lat: parseFloat(geom.coordinates[1].toFixed(5), 10),
            lng: parseFloat(geom.coordinates[0].toFixed(5), 10)
        };
        var meshes = this.meshAlgm.GetMeshes25T(latlng).map(function (it) {
            return parseInt(it, 10);
        });

        if (meshList && meshList.length > 0) {
            return FM.Util.intersection(meshes, meshList).length > 0;
        }

        return true;
    },

    /**
     * 销毁实例对象
     * @method destroy
     * @author XuJie
     * @date   2017-09-11
     * @return {undefined}
     */
    destroy: function () {
        fastmap.uikit.Util.instance = null;
    },

    statics: {
        instance: null,

        /**
         * 获取实例对象
         * @method getInstance
         * @author XuJie
         * @date   2017-09-11
         * @return {object} 实例对象
         */
        getInstance: function () {
            if (!fastmap.uikit.Util.instance) {
                fastmap.uikit.Util.instance =
                    new fastmap.uikit.Util();
            }
            return fastmap.uikit.Util.instance;
        }
    }
});
