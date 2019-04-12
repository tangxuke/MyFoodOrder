var app=getApp();
var canteenGuid=app.CanteenGuid;
var baseUrl=app.baseUrl;

Page({
  onShow:function(){
    wx.request({
      url: baseUrl + '/menu?CanteenGuid=' + canteenGuid,
      method: 'get',

      success: res => {
        console.log(res);
        if (res.data.Success) {
          this.setData({
            items: res.data.Result
          });
        } else {
          console.log(res.data);
        }
      }
    });
  },
  onLoad:function(){
    
  },
  /**
   * 页面的初始数据
   */
  data: {
    items:[]
  },

  //编辑项目
  editMenu:function(event){
    var guid = event.currentTarget.dataset.guid;
    wx.navigateTo({
      url: './new?guid='+guid,
    });
  }
})