// miniprogram/pages/client/order/index.js
var app = getApp();
var canteenGuid = app.CanteenGuid;
var baseUrl = app.baseUrl;
var userid;
var carteenInfo={};
var address='多维10楼';
var userTel='18826831246';
var orderTime=new Date().toLocaleDateString();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    items:[],
    amount:0,
    count:0,
    showMark:false
  },

  showOrder:function(){
    if(this.data.count>0){
      this.setData({ showMark: true });
    }
  },

  closeMask:function(){
    console.log('close');
    this.setData({ showMark:false});
  },

  myOrderDel:function(event){
    
    let guid = event.detail.guid;
    let item=this.data.items.find(e=>{
      return e.guid===guid;
    });
    item.Qty--;
    this.setData({ items: this.data.items }, this.refreshAmount);
  },

  myOrderAdd: function (event) {

    let guid = event.detail.guid;
    let item = this.data.items.find(e => {
      return e.guid === guid;
    });
    item.Qty++;
    this.setData({ items: this.data.items }, this.refreshAmount);
  },


  //打印订单
  printOrder:function(orderid){
    console.log(carteenInfo);
    var orderInfo,amount=0;
    orderInfo = `<CB>${carteenInfo.Name}</CB><BR>`;//标题字体如需居中放大,就需要用标签套上
    orderInfo+=`<C>联系电话：${carteenInfo.Tel}</C><BR>`;
    orderInfo += "名称\t单价\t数量\t金额<BR>";
    orderInfo += "--------------------------------<BR>";
    this.data.items.filter(item=>item.Qty>0).forEach(item=>{
      orderInfo+=`${item.Name}\t${item.Price}\t${item.Qty}\t${item.Qty*item.Price}<BR>`;
      amount += item.Qty * item.Price;
    });
    orderInfo += "--------------------------------<BR>";
    orderInfo += `合计：${amount}元<BR>`;
    orderInfo += `送货地点：${address}<BR>`;
    orderInfo += `联系电话：${userTel}<BR>`;
    orderInfo += `订餐时间：${orderTime}<BR><BR>`;
    orderInfo +=`<QR>${orderid}</QR>`;

    return app.printOrder(orderInfo);
  },

  submit:function(){
    wx.request({
      url: baseUrl + '/order',
      method: 'post',
      data: {
        CanteenGuid: canteenGuid,
        UserId: userid,
        Address: '508床',
        Items: this.data.items.filter(item => item.Qty > 0).map(item => {
          return {
            ItemGuid: item.guid,
            ItemName: item.Name,
            Qty: item.Qty,
            Price: item.Price
          };
        })
      },
      success: res => {
        var orderid=res.data.Result;
        this.printOrder()
        .then(()=>{
          //打印订单成功，跳转到我的订单页
          wx.navigateTo({
            url: '../my-order/index',
          })
        })
        .catch(()=>{
          wx.showModal({
            title: '提交订单失败',
            content: '原因：打印不成功！',
          })
        });
      },
      fail: reason => {
        console.log('fail');
        console.log(reason);
      }
    })
  },

  //提交订单
  submitOrder:function(){
    wx.showModal({
      title: '提示',
      content: `选中${this.data.count}件菜品，共${this.data.amount}元,是否提交订单?`,
      
      success:(res)=>{
        if(res.confirm){
          this.submit();
        }
      }
    });
    
  },

  reduce:function(event){
    var item = Array.from(this.data.items).find(e => {
      return e.guid === event.currentTarget.dataset.guid;
    });
    item.Qty--;
    this.setData({ items: this.data.items }, this.refreshAmount);
  },

  showImage:function(event){
    wx.navigateTo({
      url: '../../tools/showimage?url=' + event.currentTarget.dataset.url,
    });
  },

  refreshAmount(){
    var sum=0,count=0;
    Array.from(this.data.items).forEach(item=>{
      sum+=item.Qty*item.Price;
      count+=item.Qty;
    });
    this.setData({amount:sum,count});
    if(this.data.count<=0){
      this.setData({showMark:false});
    }
  },

  onLoad:function(params){
    this.refresh();
    userid = app.userInfo.userid;
    carteenInfo=app.canteenInfo;
  },

  //添加
  add:function(event){
    var item=Array.from(this.data.items).find(e=>{
      return e.guid===event.currentTarget.dataset.guid;
    });
    item.Qty++;
    this.setData({ items: this.data.items }, this.refreshAmount);
  },  

  refresh:function(){
    wx.request({
      url: baseUrl + '/menu?CanteenGuid=' + canteenGuid,
      method: 'get',

      success: res => {
        if (res.data.Success) {
          this.setData({
            items: res.data.Result.map(item=>{
              item['Qty']=0;
              return item;
            })
          });
        } else {
          console.log(res.data);
        }
      }
    });
  }
})