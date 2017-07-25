var express = require('express');
var router = express.Router();
var User = require('./../models/user');
require('./../public/javascripts/util')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/test',function (req,res,next) {
  res.send('test');
});
router.post('/login',function (req,res,next) {
  let param = {
      userName:req.body.userName,
      userPwd:req.body.userPwd
  }

  User.findOne(param,function (err,doc) {
    if(err){
      res.json({
          status:"1",
          msg:err.message
      });
    }else{
      if(doc){
        res.cookie('userId',doc.userId,{
            path:'/',
            maxAge:1000*60*60
        });
        res.cookie('userName',doc.userName,{
          path:'/',
          maxAge:1000*60*60
        });
        // req.session.user = doc;
        res.json({
          status:"0",
          msg:"",
          result:{
              userName:doc.userName,

          }
        })
      }
    }
  })
});
router.post("/logout", function (req,res,next) {
  res.cookie("userId","",{
    path:"/",
    maxAge:-1
  });
  res.json({
    status:"0",
    msg:'',
    result:''
  })
});
router.get("/checkLogin", function (req,res,next) {
  if(req.cookies.userId){
    res.json({
      status:'0',
      msg:'',
      result:req.cookies.userName || ''
    });
  }else{
    res.json({
      status:'1',
      msg:'未登录',
      result:''
    });
  }
});
router.post('/register',function (req,res,next) {
  let param = {
    userId:req.body.userId,
    userName:req.body.userName,
    userPwd:req.body.userPwd
  };
  console.log(param)
  let _user = new User(param);
  _user.save(param,function (err,user) {
    if(err){
      res.json({
        status:"1",
        msg:"注册失败",
        result:''
      })
    }else {
      res.json({
        status:"0",
        msg:"注册成功",
        result:user.userName
      })
    }
  })
});

//购物车数据加载
//1.查询当前用户的购物车数据
router.get("/cartList",function (req,res,next) {
  var userId = req.cookies.userId;
  User.findOne({userId:userId},function (err,doc) {
    if (err){
      res.json({
        status:"1",
        msg:err.message,
        result:''
      })
    }else{
      if(doc){
        doc.cartList;
        res.json({
          status:"0",
          msg:'',
          result:doc.cartList
        })
      }
    }
  })
});
//2.购物车删除
router.post("/cartDel",function (req,res,next) {
  let userId = req.cookies.userId,productId = req.body.productId;
  console.log("1ok")
  User.update({userId:userId},{$pull:{'cartList':{'productId':productId}}},function (err,doc) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else {
      res.json({
        status:'0',
        msg:'',
        result:'success'
      })
    }
  });
});
//修改商品数量
router.post("/cartEdit",function (req,res,next) {
  let userId = req.cookies.userId,
    productId = req.body.productId,
    productNum = req.body.productNum,
    checked=req.body.checked;
  User.update({userId:userId,"cartList.productId":productId},{
    "cartList.$.productNum":productNum,
    "cartList.$.checked":checked

  },function (err,doc) {
    if(err){
      res.json({
    status:'1',
    msg:err.message,
    result:''
  })
}else {
  res.json({
    status:'0',
    msg:'',
    result:'success'
  })
}
});
});
//全选
router.post("/editCheckAll",function (req,res,next) {
  let userId = req.cookies.userId;
  let checkAll = req.body.checkAll?'1':'0';
  User.findOne({userId:userId},function (err,user) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else {
      if (user){
        user.cartList.forEach((item)=>{
          item.checked = checkAll;
        });
        user.save(function (err1,doc) {
          if (err1){
            res.json({
              status:'1',
              msg:err.message,
              result:''
            })
          }else {
            res.json({
              status:'0',
              msg:'',
              result:'success'
            })
          }
        })
      }
    }
  });
});
//用户地址查询
router.get("/addressList",function (req,res,next) {
  let userId = req.cookies.userId;
  User.findOne({userId:userId},function (err,doc) {
    if (err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:doc.addressList
      })
    }
  })
});
//设置默认地址
router.post('/setDefault',function (req,res,next) {
  let userId = req.cookies.userId,
  addressId = req.body.addressId;
  if (!addressId){
    res.json({
      status:'1003',
      msg:'addressId is Null',
      result:''
    })
  }else{
    User.findOne({userId:userId},function (err,doc) {
      if (err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        })
      }else{
        let addressList = doc.addressList;
        addressList.forEach((item)=>{
            if( item.addressId==addressId){
              item.isDefault =true;
            }else{
              item.isDefault = false;
            }
        });
        doc.save(function (err1,doc1) {
          if (err1){
            res.json({
              status:'1',
              msg:err.message,
              result:''
            })
          }else{
            res.json({
              status:'0',
              msg:'',
              result:''
            })
          }
        })
      }
    })
  }
});
//删除地址
router.post("/delAddress",function (req,res,next) {
  let userId = req.cookies.userId,addressId = req.body.addressId;
  User.update({userId:userId},
    {
      $pull:
        {
          'addressList':
            {
              'addressId':addressId
            }
        }
    },function (err,doc) {
      if (err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        })
      }else{
        res.json({
          status:'0',
          msg:'',
          result:''
        })
      }
    })
});
//添加新的地址
router.post('/addNewAddress',function (req,res,next) {
  let userId = req.cookies.userId,addressId = req.body.addressId,
    userName=req.body.userName,
    streetName = req.body.streetName,
    postCode = req.body.postCode,
    tel = req.body.tel,
    isDefalut = false
  ;
  console.log(1);
  User.update({userId:userId},
    {
      $push:{
        'addressList':{
          'addressId':addressId,
          'userName':userName,
          'streetName':streetName,
          'postCode':postCode,
          'tel':tel,
          'isDefault':isDefalut,

        }
      }
    },function (err,doc) {
      if (err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        })
      }else{
        res.json({
          status:'0',
          msg:'',
          result:'success'
        })
      }
    }
  )
});
//订单页面的生成
router.post("/payment",function (req,res,next){
  let userId = req.cookies.userId,
    orderTotal = req.body.orderTotal,
    addressId = req.body.addressId
  ;
  User.findOne({userId:userId},function (err,doc) {
    if (err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      var address = '',goodsList=[];
      //获取当前用户的地址信息
      doc.addressList.forEach((item)=>{
        if(addressId==addressId){
           address = item;
        }
      });
      //获取用户购物车的购买商品
      doc.cartList.filter((item)=>{
        if (item.checked=='1'){
          goodsList.push(item);
          User.update({userId:userId},{
            $pull:{
              'cartList':{
                'productId':item.productId
              }
            }
          },function (err4,doc4) {
            if (err4){
              console.log('err')
            }else{
              console.log('success')
            }
          })
        }
      });

      //创建订单
      var platform = '120';
      var  rannum1 = Math.floor(Math.random()*10);
      var  rannum2 = Math.floor(Math.random()*10);
      var sysDate = new Date().Format('yyyyMMddhhmmss');
      var creatDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
      var orderId =platform+rannum1+sysDate+rannum2;

      var order = {
        orderId:orderId,
        orderTotal:orderTotal,
        addressInfo:address,
        goodsList:goodsList,
        orderStatus:'1',
        createDate:creatDate
      };
      doc.orderList.push(order);
      doc.save(function (err1,doc1) {
        if (err1){
          res.json({
            status:'1',
            msg:err.message,
            result:''
          })
        }else{
          res.json({
            status:'0',
            msg:'',
            result:{
              orderId:order.orderId,
              orderTotal:order.orderTotal
            }
          })
        }
      });
    }
  })
});
//ID查询订单信息
router.get("/orderdetail",function (req,res,next) {
  let userId = req.cookies.userId,orderId = req.param("orderId");
  User.findOne({userId:userId},function (err,userInfo) {
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      let orderList = userInfo.orderList;
      if(orderList.length>0){
        let orderTotal = 0;
        orderList.forEach((item)=>{
          if(item.orderId == orderId){
            orderTotal=item.orderTotal
          }
        });
        if (orderTotal>0){
          res.json({
            status:'0',
            msg:'',
            result:{
              orderId:orderId,
              orderTotal:orderTotal
            }
          })
        }else{
          res.json({
            status:'12001',
            msg:"无此订单",
            result:''
          })
        }
      }else{
        res.json({
          status:'12002',
          msg:"当前用户未创建订单",
          result:''
        })
      }
    }
  })
});
//查询购物车数量
router.get("/getCartCount",function (req,res,next) {
  if (req.cookies && req.cookies.userId){
    let userId = req.cookies.userId;
    User.findOne({userId:userId},function (err,doc) {
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        })
      }else{
        let cartList = doc.cartList;
        let cartCount = 0;
        cartList.map(function (item) {
          cartCount+=parseInt(item.productNum);
        });
        res.json({
          status:'0',
          msg:'',
          result:cartCount
        })
      }
    })
  }
})
module.exports = router;
