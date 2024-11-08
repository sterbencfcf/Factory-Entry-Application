const CryptoJS = require("crypto-js");
const Base64 = require("js-base64");
const funcList={
  lmappLogin:"10001",//登录
  lmapplogout:"10002",//登出
  lmappRegister:"10003",//内部人员注册
  lmappRegisterExternal:"10004",//外部人员注册
  lmappUpdatePassword:"10005",//修改密码
  lmappQueryOrg:"10006",//获取一级部门名称
  lmappQuerySessionStatus:"10007",//获取当前SESSION状态
  lmappGetAppId:"10008",//获取微信APPID和SECRET
  getAesCode:"20001",//获取AES转码
  getRandomID:"20002",//获取一个随机UUID
  addLmappExternalPerson:"20003",//新增一条外来人员信息
  queryLmappExternalPersonsWithPage:"20004",//查询外来人员信息-带分页
  queryLmappExternalPersonsWithoutPage:"20005",//查询外来人员信息-不带分页
  deleteLmappExternalPersons:"20006",//删除外来人员信息
  addLmappVisit:"20007",//发起外来人员入厂审批流程
  getReceptionist:"20008",//选择主接责任人
  getReceptionistLeader:"20009",//选择主接人领导
  queryLmappVisitsWithPage:"20010",//获取用户发起的入厂审批流程
  queryLmappAllVisitWithPage:"20011",//获取全部发起的入厂审批流程
  getLmappVisitDetail:"20012",//获取入厂流程表单和审批详情
  addLmappVisitDelay:"20013",//发起外来人员延时出厂流程
  queryLmappVisitEnds:"20014",//选择已经审批结束的入厂流程信息
  queryLmappVisitDelaysWithPage:"20015",//获取用户发起的延时出厂流程
  queryLmappAllVisitDelayWithPage:"20016",//获取全部发起的延时出厂流程
  getLmappVisitDelayDetail:"20017",//获取延时流程表单和页面详情
  queryLmappToDo:"30001",//获取用户的待办信息
  queryLmappHaveDone:"30002",//获取用户的已办信息
  wfLmappVisitAudit:"30003",//流程审批-通用
  wfLmappVisitAuditChooseLeader:"30004",//流程审批-主接责任人审批
  getUserInfo:"20018",//获取用户信息
}

var myFunction = {
  getPageChange() {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      this.getTabBar().setData({
        // 当前页面的 tabBar 索引
        active: tabNum,
      });
    }
  },
};
// 登录
function loginFunc(url, data, cb) {
  wx.showLoading({});
  let newUrl="https://slae.aecc.cn:8033/default/org.gocom.components.coframe.auth.LoginManager.appUnifiy.biz.ext"
  data.func=funcList.lmappLogin
  let obj1 ={str:data}
  console.log(obj1)
  // console.log(newUrl)
  wx.request({
    url: newUrl,
    // data: data,
    data: obj1,
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "cache-control": "no-cache",
    },
    method: "GET",
    responseType: "text",
    success: function (res1) {
      console.log(res1,'111')
      let res={data:JSON.parse(Base64.decode(res1.data.out))}
      console.log(res.data.userObject.sessionId,'111')
      console.log(res,'111')
      wx.clearStorage();
      wx.setStorageSync(
        "sessionid",
        // res.data.userObject.sessionId
        res1.header["Set-Cookie"].replaceAll("path=/,", "")
      );
      wx.hideLoading();
      return typeof cb == "function" && cb(res);
    },
    fail: function (res) {
      wx.hideLoading();
      wx.showModal({
        title: "网络错误",
        content: "网络出错，请刷新重试",
        showCancel: false,
      });
      return typeof cb == "function" && cb(false);
    },
  });
}
// // 登录
// function loginFunc(url, data, cb) {
//   wx.showLoading({});
//   // console.log(newUrl)
//   wx.request({
//     url: url,
//     // data: data,
//     data: data,
//     header: {
//       "Content-Type": "application/x-www-form-urlencoded",
//       "cache-control": "no-cache",
//     },
//     method: "GET",
//     responseType: "text",
//     success: function (res) {
//       console.log(res,'111')
//       wx.clearStorage();
//       wx.setStorageSync(
//         "sessionid",
//         // res.data.userObject.sessionId
//         res.header["Set-Cookie"].replaceAll("path=/,", "")
//       );
//       wx.hideLoading();
//       return typeof cb == "function" && cb(res);
//     },
//     fail: function (res) {
//       wx.hideLoading();
//       wx.showModal({
//         title: "网络错误",
//         content: "网络出错，请刷新重试",
//         showCancel: false,
//       });
//       return typeof cb == "function" && cb(false);
//     },
//   });
// }
// 获取当前SESSION状态
// function SessionStatus() {
//   wx.showLoading({});
//   wx.request({
//     url: 'https://slae.aecc.cn:8033/default/org.gocom.components.coframe.auth.LoginManager.lmappQuerySessionStatus.biz.ext',
//     header: {
//       "Content-Type": "application/x-www-form-urlencoded",
//       "cache-control": "no-cache",
//     },
//     method: "GET",
//     responseType: "text",
//     success: function (res) {
//       wx.hideLoading();
//       if (!res.data.status) {
//         wx.navigateTo({
//           url: '/pages/login/login',
//           success() {
//             wx.showModal({
//               title: '登录过期，请重新登录',
//               confirmText: "确认",
//               showCancel: false,
//             })
//           }
//         })
//       }
//     },
//     fail: function (res) {
//       wx.hideLoading();
//       wx.showModal({
//         title: '过期检查异常',
//         confirmText: "确认",
//         showCancel: false,
//       })
//     },
//   });
// }

// 注册
function postRequest_Data(url, data, cb) {
  wx.showLoading({});
  let newUrl;
  if(url.includes('lmappRegister')){//用户注册-黎明公司员工
    newUrl='https://slae.aecc.cn:8033/default/org.gocom.components.coframe.auth.LoginManager.appUnifiy.biz.ext'
    data.func=funcList.lmappRegister
  }else if(url.includes('lmappRegisterExternal')){//用户注册-外来人员
    console.log("chufanle")
    newUrl='https://slae.aecc.cn:8033/default/org.gocom.components.coframe.auth.LoginManager.appUnifiy.biz.ext'
    data.func=funcList.lmappRegisterExternal
  }
  console.log(data.func)
  let obj1 ={str:data}
  wx.request({
    url: newUrl,
    data: obj1,
    header: {
      "Content-Type": "application/json;charset=UTF-8",
      "cache-control": "no-cache",
    },
    method: "POST",
    dataType: "json",
    responseType: "text",
    success: function (res1) {
      let res={data:JSON.parse(Base64.decode(res1.data.out))}
      wx.hideLoading();
      return typeof cb == "function" && cb(res);
    },
    fail: function (res) {
      wx.hideLoading();
      wx.showModal({
        title: "网络错误",
        content: "网络出错，请刷新重试",
        showCancel: false,
      });
      return typeof cb == "function" && cb(false);
    },
  });
}
// 删除外来人员信息
function deletePersonInfo(url, data, cb) {
  wx.showLoading({});
  let newUrl;
  if(url.includes('deleteLmappExternalPersons')){//删除外来人员信息
    newUrl='https://slae.aecc.cn:8033/default/weixinApp/com.primeton.weixin.unification.externalPersonInfoUnifiy.biz.ext'
    data.func=funcList.deleteLmappExternalPersons
  }
  console.log(data.func)
  let obj1 ={str:data}
  wx.request({
    url: newUrl,
    data: obj1,
    header: {
      "Content-Type": "application/json;charset=UTF-8",
      "cache-control": "no-cache",
    },
    method: "POST",
    dataType: "其他",
    responseType: "text",
    success: function (res1) {
      let res={data:JSON.parse(Base64.decode(res1.data.out))}
      wx.hideLoading();
      return typeof cb == "function" && cb(res);
    },
    fail: function (res) {
      wx.hideLoading();
      wx.showModal({
        title: "网络错误",
        content: "网络出错，请刷新重试",
        showCancel: false,
      });
      return typeof cb == "function" && cb(false);
    },
  });
}

// 1登出 2获取用户信息 3查询外来人员信息-不带分页 4查询外来人员信息-带分页 5获取用户发起的入厂审批流程 6获取用户的待办信息 7获取用户的已办信息 8选择已经审批结束的入厂流程信息 9获取用户发起的延时出厂流程
async function getRequest_data_session(url, data, cb) {
  wx.showLoading({});
  let newUrl;
  console.log('触发1')
  if(url.includes('lmapplogout')){//1登出
    console.log('触发2')
    newUrl='https://slae.aecc.cn:8033/default/org.gocom.components.coframe.auth.LoginManager.appUnifiy.biz.ext'
    data.func=funcList.lmapplogout
  }else if(url.includes('getUserInfo')){//2获取用户信息
    console.log('触发3')
    newUrl='https://slae.aecc.cn:8033/default/weixinApp/com.primeton.weixin.unification.commonUnifiy.biz.ext'
    data.func=funcList.getUserInfo
  }else if(url.includes('queryLmappExternalPersonsWithoutPage')){//3查询外来人员信息-不带分页
    newUrl='https://slae.aecc.cn:8033/default/weixinApp/com.primeton.weixin.unification.externalPersonInfoUnifiy.biz.ext'
    data.func=funcList.queryLmappExternalPersonsWithoutPage
  }else if(url.includes('queryLmappExternalPersonsWithPage')){//4查询外来人员信息-带分页
    newUrl='https://slae.aecc.cn:8033/default/weixinApp/com.primeton.weixin.unification.externalPersonInfoUnifiy.biz.ext'
    data.func=funcList.queryLmappExternalPersonsWithPage
  }else if(url.includes('queryLmappVisitsWithPage')){//5获取用户发起的入厂审批流程
    newUrl='https://slae.aecc.cn:8033/default/weixinApp/com.primeton.weixin.unification.visitFlowUnifiy.biz.ext'
    data.func=funcList.queryLmappVisitsWithPage
  }else if(url.includes('queryLmappToDo')){//6获取用户的待办信息
    newUrl='https://slae.aecc.cn:8033/default/weixinApp/com.primeton.weixin.unification.todoUnifiy.biz.ext'
    data.func=funcList.queryLmappToDo
  }else if(url.includes('queryLmappHaveDone')){//7获取用户的已办信息
    newUrl='https://slae.aecc.cn:8033/default/weixinApp/com.primeton.weixin.unification.todoUnifiy.biz.ext'
    data.func=funcList.queryLmappHaveDone
  }else if(url.includes('queryLmappVisitEnds')){//8选择已经审批结束的入厂流程信息
    newUrl='https://slae.aecc.cn:8033/default/weixinApp/com.primeton.weixin.unification.delayFlowUnifiy.biz.ext'
    data.func=funcList.queryLmappVisitEnds
  }else if(url.includes('queryLmappVisitDelaysWithPage')){//9获取用户发起的延时出厂流程
    newUrl='https://slae.aecc.cn:8033/default/weixinApp/com.primeton.weixin.unification.delayFlowUnifiy.biz.ext'
    data.func=funcList.queryLmappVisitDelaysWithPage
  }
  console.log(data.func)
  let obj1 ={str:data}
  console.log(obj1)
  wx.request({
    url: newUrl,
    data: obj1,
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "cache-control": "no-cache",
      // cookie: wx.getStorageSync("sessionid"),
    },
    method: "GET",
    responseType: "text",
    success: function (res1) {
      console.log(res1)
      let res={data:JSON.parse(Base64.decode(res1.data.out))}
      wx.hideLoading();
      return typeof cb == "function" && cb(res);
    },
    fail: function (res) {
      wx.hideLoading();
      wx.showModal({
        title: "网络错误",
        content: "网络出错，请刷新重试",
        showCancel: false,
      });
      return typeof cb == "function" && cb(false);
    },
  });
}
// 1获取一级部门名称 2获取微信app 3获取一个随机UUID 4改密码 5选择主接责任人 6获取入厂流程表单和审批详情 7获取延时流程表单和页面详情 8获取AES转码 
function getRequest_data(url, data, cb) {
  wx.showLoading({});
  let newUrl;
  if(url.includes('lmappQueryOrg')){//1获取一级部门名称
    newUrl='https://slae.aecc.cn:8033/default/org.gocom.components.coframe.auth.LoginManager.appUnifiy.biz.ext'
    data.func=funcList.lmappQueryOrg
  }else if(url.includes('lmappGetAppId')){//2获取微信app
    newUrl='https://slae.aecc.cn:8033/default/org.gocom.components.coframe.auth.LoginManager.appUnifiy.biz.ext'
    data.func=funcList.lmappGetAppId
  }else if(url.includes('getRandomID')){//3获取一个随机UUID
    newUrl='https://slae.aecc.cn:8033/default/com.primeton.weixin.unification.commonUnifiy.biz.ext'
    data.func=funcList.getRandomID
  }else if(url.includes('lmappUpdatePassword')){//4改密码
    newUrl='https://slae.aecc.cn:8033/default/org.gocom.components.coframe.auth.LoginManager.appUnifiy.biz.ext'
    data.func=funcList.lmappUpdatePassword
  }else if(url.includes('getReceptionist')){//5选择主接责任人
    newUrl='https://slae.aecc.cn:8033/default/com.primeton.weixin.unification.visitFlowUnifiy.biz.ext'
    data.func=funcList.getReceptionist
  }else if(url.includes('getLmappVisitDetail')){//6获取入厂流程表单和审批详情
    newUrl='https://slae.aecc.cn:8033/default/weixinApp/com.primeton.weixin.unification.visitFlowUnifiy.biz.ext'
    data.func=funcList.getLmappVisitDetail
  }else if(url.includes('getRangetLmappVisitDelayDetaildomID')){//7获取延时流程表单和页面详情
    newUrl='https://slae.aecc.cn:8033/default/weixinApp/com.primeton.weixin.unification.delayFlowUnifiy.biz.ext'
    data.func=funcList.getLmappVisitDelayDetail
  }else if(url.includes('getAesCode')){//8获取AES转码 
    newUrl='https://slae.aecc.cn:8033/default/com.primeton.weixin.unification.commonUnifiy.biz.ext'
    data.func=funcList.getAesCode
  }
  console.log(data.func)
  let obj1 ={str:data}
  wx.request({
    url: newUrl,
    data: obj1,
    header: {
      "Content-Type": "application/x-www-form-urlencoded",
      "cache-control": "no-cache",
    },
    method: "GET",
    responseType: "text",
    success: function (res1) {
      let res={data:JSON.parse(Base64.decode(res1.data.out))}
      wx.hideLoading();
      return typeof cb == "function" && cb(res);
    },
    fail: function (res) {
      wx.hideLoading();
      wx.showModal({
        title: "网络错误",
        content: "网络出错，请刷新重试",
        showCancel: false,
      });
      return typeof cb == "function" && cb(false);
    },
  });
}
// 1新增外来人员信息 2发起外来人员入厂审批流程
async function postRequest_Data_session(url, data, cb) {
  wx.showLoading({});
  let newUrl;
  if(url.includes('addLmappExternalPerson')){//1新增外来人员信息
   newUrl='https://slae.aecc.cn:8033/default/weixinApp//weixinAppcom.primeton.weixin.unification.externalPersonInfoUnifiy.biz.ext'
    data.func=funcList.addLmappExternalPerson
  }else if(url.includes('addLmappVisit')){//2发起外来人员入厂审批流程
   newUrl='https://slae.aecc.cn:8033/default/weixinApp/com.primeton.weixin.unification.visitFlowUnifiy.biz.ext'
    data.func=funcList.addLmappVisit
  }
  console.log(data.func)
  let obj1 ={str:data}
  wx.request({
    url: newUrl,
    data: obj1,
    header: {
      "Content-Type": "application/json;charset=UTF-8",
      "cache-control": "no-cache",
      cookie: wx.getStorageSync("sessionid"),
    },
    method: "POST",
    dataType: "json",
    responseType: "text",
    success: function (res1) {
      let res={data:JSON.parse(Base64.decode(res1.data.out))}
      wx.hideLoading();
      return typeof cb == "function" && cb(res);
    },
    fail: function (res) {
      wx.hideLoading();
      wx.showModal({
        title: "网络错误",
        content: "网络出错，请刷新重试",
        showCancel: false,
      });
      return typeof cb == "function" && cb(false);
    },
  });
}

//手机号不严格校验
function isPhone(value) {
  if (!/^1[3456789]\d{9}$/.test(value)) {
    return false;
  } else {
    return true;
  }
}

//身份证号不严格校验
function isCard(value) {
  if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
    return false;
  } else {
    return true;
  }
}
//车牌号校验
function isCarNum(value) {
  let reg =
    /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;
  const careg = reg.test(value);
  return careg;
}
module.exports = {
  myFunction,
  loginFunc,
  postRequest_Data,
  deletePersonInfo,
  getRequest_data_session,
  getRequest_data,
  postRequest_Data_session,
  isPhone,
  isCard,
  isCarNum,
};