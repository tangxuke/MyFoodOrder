// miniprogram/pages/manage/menu/new.js
const app=getApp();

Page({
  onLoad:function(options){
    if(options.guid){
      wx.setNavigationBarTitle({
        title: '编辑菜品',
      });
      this.setData({ Guid: options.guid});
      wx.request({
        url: app.baseUrl + '/menu/' + this.data.Guid,
        method: 'get',
        success: res => {
          var data = res.data;
          if (data.Success && data.Result.length > 0) {
            var value = data.Result[0];
            console.log(value);
            this.setData({
              Name: value.Name,
              ImageUrl: value.ImageUrl,
              Price: value.Price,
              SupplyPeriod: (value.Period?value.Period.split(','):[]),
              SupplyCycle: (value.Cycle?value.Cycle.split(','):[])
            });
          }
        }
      })
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    Guid:'',
    Name:'',
    ImageUrl:'',
    Price:0,
    SupplyPeriod: ['早餐', '午餐', '晚餐', '夜宵'],
    SupplyCycle:['周一','周二','周三','周四','周五','周六','周日'],
    showPeriod:false, //是否显示供应时段对话框
    showCycle:false,  //显示供应周期对话框
    listPeriod:['早餐','午餐','晚餐','夜宵'],  //选项列表
    listCycle: ['周一', '周二', '周三', '周四','周五','周六','周日'],  
    resultPeriod:[],
    resultCycle:[]
  },

  //品名改变
  onNameChange:function(event){
    this.setData({Name:event.detail});
  },

  //价格改变
  onPriceChange: function (event) {
    this.setData({ Price: event.detail });
  },

  //删除
  remove:function(){
    wx.showModal({
      title: '系统提示',
      content: '你确定删除此菜品吗？',
      confirmText:'确定',
      cancelText:'取消',
      showCancel:true,
      success:res=>{
        if(res.confirm){
          wx.request({
            url: app.baseUrl + '/menu/' + this.data.Guid,
            method: 'delete',
            success: res => {
              if (res.data.Success) {
                wx.showModal({
                  title: '系统提示',
                  content: '保存菜品成功',
                  success: () => {
                    wx.navigateBack();
                  }
                })

              } else {
                wx.showModal({
                  title: '保存菜品失败',
                  content: res.data.Message,
                });
              }
            },
            fail: reason => {
              console.log(reason);
            }
          });
        }
        
      }
    })
    
  },

  //保存
  save:function(){
    wx.request({
      url: app.baseUrl + '/menu' + (this.Guid ? '/' + this.Guid:''),
      method:(this.Guid?'put':'post'),
      data:{
        CanteenGuid:app.CanteenGuid,
        ...this.data
      },
      success:res=>{
        if(res.data.Success){
          wx.showModal({
            title: '系统提示',
            content: '保存菜品成功',
            success:()=>{
              wx.navigateBack();
            }
          })
          
        }else{
          wx.showModal({
            title: '保存菜品失败',
            content: res.data.Message,
          });
        }
      },
      fail:reason=>{
        console.log(reason);
      }
    });
  },

  //选择图片
  chooseImage:function(){
    var _this=this;
    wx.chooseImage({
      success: function(res) {
        //上传图片
        wx.uploadFile({
          url: 'https://tangxuke.cn/upload',
          filePath: res.tempFiles[0].path,
          name: 'image',
          success:res1=>{
            var data=JSON.parse(res1.data);
            _this.setData({
              ImageUrl: data.Result.url
            });
          },
          fail:reason=>{
            console.log(reason);
          }
        })
      },
    })
  },

  //显示图片
  showImage:function(){
    wx.navigateTo({
      url: '../../tools/showimage?url='+this.data.ImageUrl,
    })
  },

  //输入品名
  inputName:function(e){
    this.setData({
      Name:e.detail.value
    })
  },

  //输入价格
  inputPrice: function (e) {
    this.setData({
      Price: e.detail.value
    })
  },

  //长按删除图片
  imageLongTap:function(){
    this.setData({ImageUrl:''});
  },

  //打开选择时段面板
  selectPeriod:function(){
    this.setData({showPeriod:true,resultPeriod:this.data.SupplyPeriod});
  },
  //打开供应周期面板
  selectCycle: function () {
    this.setData({ showCycle: true, resultCycle: this.data.SupplyCycle });
  },

  //关闭供应时段面板
  closePeriodDialog:function(){
    this.setData({
      showPeriod:false
    });
  },

  closeCycleDialog: function () {
    this.setData({
      showCycle: false
    });
  },

  togglePeriod:function(event){
    var item=event.currentTarget.dataset.name;
    var resultPeriod = this.data.resultPeriod;
    var index = resultPeriod.findIndex(e=>{
      return e===item;
    });

    if(index<0){
      resultPeriod.push(item);
    }else{
      resultPeriod.splice(index,1);
    }
    this.setData({ resultPeriod});
  },

  toggleCycle: function (event) {
    var item = event.currentTarget.dataset.name;
    var resultCycle = this.data.resultCycle;
    var index = resultCycle.findIndex(e => {
      return e === item;
    });

    if (index < 0) {
      resultCycle.push(item);
    } else {
      resultCycle.splice(index, 1);
    }
    this.setData({ resultCycle });
  },

  //确认选择供应时段
  confirmSelectPeriod:function(){
    this.setData({SupplyPeriod:this.data.resultPeriod});
  },
  //确认选择供应周期
  confirmSelectCycle: function () {
    this.setData({ SupplyCycle: this.data.resultCycle });
  }
})