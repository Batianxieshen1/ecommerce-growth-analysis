// 内联数据 - 从 JSON 文件生成
// 避免 fetch 请求，确保数据始终可用

export const kpiData = {
  totalGMV: "R$ 20,047,778",
  totalOrders: "98,207",
  avgOrderValue: "R$ 204.14",
  conversionRate: "2.9%",
  dau: "4,644",
  retention30d: "10.9%"
};

export const monthlyGMV = [
  { month: "2016-09", gmv: 248, orders: 1 },
  { month: "2016-10", gmv: 63760, orders: 306 },
  { month: "2016-11", gmv: 0, orders: 0 },
  { month: "2016-12", gmv: 38, orders: 1 },
  { month: "2017-01", gmv: 112264, orders: 776 },
  { month: "2017-02", gmv: 260746, orders: 1725 },
  { month: "2017-03", gmv: 415092, orders: 2660 },
  { month: "2017-04", gmv: 383033, orders: 2391 },
  { month: "2017-05", gmv: 429961, orders: 2701 },
  { month: "2017-06", gmv: 403474, orders: 2547 },
  { month: "2017-07", gmv: 465958, orders: 2873 },
  { month: "2017-08", gmv: 535589, orders: 3331 },
  { month: "2017-09", gmv: 520416, orders: 3286 },
  { month: "2017-10", gmv: 649944, orders: 4026 },
  { month: "2017-11", gmv: 1129476, orders: 7041 },
  { month: "2017-12", gmv: 802688, orders: 5167 },
  { month: "2018-01", gmv: 851526, orders: 5345 },
  { month: "2018-02", gmv: 833098, orders: 5277 },
  { month: "2018-03", gmv: 946632, orders: 5981 },
  { month: "2018-04", gmv: 903409, orders: 5787 },
  { month: "2018-05", gmv: 968295, orders: 6157 },
  { month: "2018-06", gmv: 885191, orders: 5637 },
  { month: "2018-07", gmv: 925959, orders: 5705 },
  { month: "2018-08", gmv: 814398, orders: 4880 }
];

export const monthlyDAU = [
  { month: "2016-09", avgDau: 3, peakDau: 3 },
  { month: "2016-10", avgDau: 621, peakDau: 1023 },
  { month: "2016-11", avgDau: 3, peakDau: 3 },
  { month: "2016-12", avgDau: 2, peakDau: 2 },
  { month: "2017-01", avgDau: 1555, peakDau: 2642 },
  { month: "2017-02", avgDau: 2386, peakDau: 3871 },
  { month: "2017-03", avgDau: 3209, peakDau: 5029 },
  { month: "2017-04", avgDau: 3156, peakDau: 4863 },
  { month: "2017-05", avgDau: 3314, peakDau: 5114 },
  { month: "2017-06", avgDau: 3254, peakDau: 5026 },
  { month: "2017-07", avgDau: 3429, peakDau: 5243 },
  { month: "2017-08", avgDau: 3728, peakDau: 5665 },
  { month: "2017-09", avgDau: 3691, peakDau: 5533 },
  { month: "2017-10", avgDau: 4025, peakDau: 6128 },
  { month: "2017-11", avgDau: 4682, peakDau: 7424 },
  { month: "2017-12", avgDau: 4196, peakDau: 6339 },
  { month: "2018-01", avgDau: 4237, peakDau: 6460 },
  { month: "2018-02", avgDau: 4218, peakDau: 6413 },
  { month: "2018-03", avgDau: 4470, peakDau: 6801 },
  { month: "2018-04", avgDau: 4374, peakDau: 6624 },
  { month: "2018-05", avgDau: 4487, peakDau: 6817 },
  { month: "2018-06", avgDau: 4389, peakDau: 6616 },
  { month: "2018-07", avgDau: 4432, peakDau: 6652 },
  { month: "2018-08", avgDau: 4025, peakDau: 5856 }
];

export const categoryGMV = [
  { category: "床品/浴室/桌布", gmv: 1816364, orders: 11942 },
  { category: "健康/美容", gmv: 1560559, orders: 9749 },
  { category: "运动/休闲", gmv: 1392195, orders: 8639 },
  { category: "家具/装饰", gmv: 1301358, orders: 8366 },
  { category: "电脑/配件", gmv: 1204492, orders: 6628 },
  { category: "家居用品", gmv: 1046811, orders: 6876 },
  { category: "手表/礼品", gmv: 967864, orders: 5673 },
  { category: "通讯设备", gmv: 861190, orders: 4518 },
  { category: "园艺/工具", gmv: 750395, orders: 4554 },
  { category: "汽配用品", gmv: 696753, orders: 4120 }
];

export const regionGMV = [
  { state: "SP", gmv: 7405558, orders: 46048, customers: 43492 },
  { state: "RJ", gmv: 2961609, orders: 15235, customers: 14975 },
  { state: "MG", gmv: 2453210, orders: 12530, customers: 12357 },
  { state: "RS", gmv: 1150990, orders: 5786, customers: 5718 },
  { state: "PR", gmv: 1019267, orders: 5466, customers: 5401 },
  { state: "SC", gmv: 825977, orders: 4279, customers: 4232 },
  { state: "BA", gmv: 766472, orders: 3652, customers: 3602 },
  { state: "GO", gmv: 564044, orders: 2809, customers: 2770 },
  { state: "DF", gmv: 465212, orders: 2186, customers: 2165 },
  { state: "ES", gmv: 446421, orders: 2433, customers: 2402 }
];

export const conversionTrend = [
  { month: "2016-09", visitToView: 60.0, viewToCart: 3.0, cartToOrder: 100.0, orderToPay: 100.0 },
  { month: "2016-10", visitToView: 60.0, viewToCart: 3.0, cartToOrder: 100.0, orderToPay: 96.4 },
  { month: "2016-11", visitToView: 60.0, viewToCart: 3.0, cartToOrder: 100.0, orderToPay: 0.0 },
  { month: "2016-12", visitToView: 60.0, viewToCart: 3.0, cartToOrder: 100.0, orderToPay: 100.0 },
  { month: "2017-01", visitToView: 60.0, viewToCart: 3.0, cartToOrder: 100.0, orderToPay: 96.5 },
  { month: "2017-02", visitToView: 60.0, viewToCart: 3.0, cartToOrder: 100.0, orderToPay: 96.8 },
  { month: "2017-03", visitToView: 60.0, viewToCart: 3.0, cartToOrder: 100.0, orderToPay: 96.7 },
  { month: "2017-04", visitToView: 60.0, viewToCart: 3.0, cartToOrder: 100.0, orderToPay: 96.8 },
  { month: "2017-05", visitToView: 60.0, viewToCart: 3.0, cartToOrder: 100.0, orderToPay: 97.1 },
  { month: "2017-06", visitToView: 60.0, viewToCart: 3.0, cartToOrder: 100.0, orderToPay: 97.1 },
  { month: "2017-07", visitToView: 60.0, viewToCart: 3.0, cartToOrder: 100.0, orderToPay: 97.2 },
  { month: "2017-08", visitToView: 60.0, viewToCart: 3.0, cartToOrder: 100.0, orderToPay: 97.0 },
  { month: "2017-09", visitToView: 60.0, viewToCart: 3.0, cartToOrder: 100.0, orderToPay: 97.1 },
  { month: "2017-10", visitToView: 60.0, viewToCart: 3.0, cartToOrder: 100.0, orderToPay: 97.3 },
  { month: "2017-11", visitToView: 60.0, viewToCart: 3.0, cartToOrder: 100.0, orderToPay: 97.4 },
  { month: "2017-12", visitToView: 60.0, viewToCart: 3.0, cartToOrder: 100.0, orderToPay: 97.1 },
  { month: "2018-01", visitToView: 60.0, viewToCart: 3.0, cartToOrder: 100.0, orderToPay: 97.1 },
  { month: "2018-02", visitToView: 60.0, viewToCart: 3.0, cartToOrder: 100.0, orderToPay: 97.2 },
  { month: "2018-03", visitToView: 60.0, viewToCart: 3.0, cartToOrder: 100.0, orderToPay: 97.1 },
  { month: "2018-04", visitToView: 60.0, viewToCart: 3.0, cartToOrder: 100.0, orderToPay: 97.3 },
  { month: "2018-05", visitToView: 60.0, viewToCart: 3.0, cartToOrder: 100.0, orderToPay: 97.2 },
  { month: "2018-06", visitToView: 60.0, viewToCart: 3.0, cartToOrder: 100.0, orderToPay: 97.1 },
  { month: "2018-07", visitToView: 60.0, viewToCart: 3.0, cartToOrder: 100.0, orderToPay: 97.0 },
  { month: "2018-08", visitToView: 60.0, viewToCart: 3.0, cartToOrder: 100.0, orderToPay: 97.1 }
];

export const funnelData = [
  { step: "访问", users: 3215780, rate: "100.0%" },
  { step: "浏览商品", users: 1928683, rate: "60.0%" },
  { step: "加入购物车", users: 97331, rate: "3.0%" },
  { step: "提交订单", users: 97277, rate: "3.0%" },
  { step: "完成支付", users: 92528, rate: "2.9%" }
];

export const retentionCohort = [
  { cohort: "2016-09", month0: 100.0, month1: 15.2, month2: 15.6, month3: 15.2, month4: 16.2, month5: 13.9 },
  { cohort: "2016-10", month0: 100.0, month1: 10.5, month2: 10.0, month3: 11.3, month4: 11.6, month5: 10.5 },
  { cohort: "2016-11", month0: 100.0, month1: 13.8, month2: 15.1, month3: 14.0, month4: 12.5, month5: 17.7 },
  { cohort: "2016-12", month0: 100.0, month1: 17.9, month2: 12.9, month3: 16.2, month4: 14.4, month5: 12.9 },
  { cohort: "2017-01", month0: 100.0, month1: 5.3, month2: 5.8, month3: 6.6, month4: 6.2, month5: 5.6 },
  { cohort: "2017-02", month0: 100.0, month1: 2.9, month2: 2.7, month3: 2.9, month4: 2.9, month5: 2.7 }
];

export const rfmSegments = [
  { segment: "一般用户", count: 21319, pct: 22.4, avgRecency: 225, avgFrequency: 1.0, avgMonetary: 282.9 },
  { segment: "沉睡用户", count: 10793, pct: 11.4, avgRecency: 225, avgFrequency: 1.0, avgMonetary: 50.1 },
  { segment: "流失风险", count: 31330, pct: 33.0, avgRecency: 424, avgFrequency: 1.0, avgMonetary: 210.9 },
  { segment: "潜力用户", count: 20952, pct: 22.1, avgRecency: 79, avgFrequency: 1.0, avgMonetary: 84.2 },
  { segment: "高价值用户", count: 10596, pct: 11.2, avgRecency: 81, avgFrequency: 1.1, avgMonetary: 481.9 }
];
