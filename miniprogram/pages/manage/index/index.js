// miniprogram/pages/manage/index/index.js
Page({
  //新增菜品
  gotoNewMenu:function(){
    wx.navigateTo({
      url: '../menu/new',
    })
  },

  //菜单列表
  gotoMenuList:function(){
    wx.navigateTo({
      url: '../menu/list',
    })
  },

  //系统设置
  gotoSetting:function(){
    wx.navigateTo({
      url: '../setting/index',
    })
  }
})