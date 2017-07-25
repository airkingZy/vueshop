/**
 * Created by Administrator on 2017/7/18.
 */
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Goods = require('../models/goods');

//通过mongoose链接mongodb数据库
mongoose.connect('mongodb://127.0.0.1/db_demo');
//监听数据库
mongoose.connection.on("connected",function () {
  console.log('MongoDB connected success')
});
mongoose.connection.on("eroor",function () {
  console.log('MongoDB connected fail')
});
mongoose.connection.on("disconnected",function () {
  console.log('MongoDB connected disconnected')
});

//路由功能
//查询商品
router.get("/list",function (req,res,nex) {
  let page = parseInt( req.param("page"));
  let pageSize = parseInt(req.param("pageSize"));
  let priceLevel = req.param("priceLevel");
  let sort = req.param("sort");
  var priceGt = '',priceLte = '';
  let skip = (page-1)*pageSize;
  let params = {};
  if(priceLevel!=="all"){
    switch (priceLevel){
      case '0':priceGt = 0;priceLte=100;break;
      case '1':priceGt = 100;priceLte=500;break;
      case '2':priceGt = 500;priceLte=1000;break;
      case '3':priceGt = 1000;priceLte=5000;break;
    }
    params = {
      salePrice:{
        $gt:priceGt,
        $lte:priceLte
      }
    }
  }


  //排序+查询
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice':sort});
  goodsModel.exec(function (err,doc) {
      if(err){
        res.json({
          status:"1",
          msg:err.message
        });
      }else{
        res.json({
          status:0,
          msg:'',
          resilt:{
              count:doc.length,
              list:doc
          }
        })
      }
  })
});
//加入购物车
router.post("/addCart",function (req,res,next) {
    let userId = req.cookies.userId,productId = req.body.productId;
    let User = require('../models/user');
    User.findOne({userId:userId},function (err,userDoc) {
        if(err){
          res.json({
            status:"1",
            msg:err.message
          })
        }else{
          if(userDoc){
            //判断购物车是否有重复商品，有就++
            let goodsItem = '';
            userDoc.cartList.forEach(function (item) {
                if(item.productId == productId){
                  goodsItem = item;
                  item.productNum++;
                }
            });
            if(goodsItem){
              userDoc.save(function (err2,doc2) {
                if(err2){
                  res.json({
                    status:"1",
                    msg:err2.message
                  })
                }else{
                  res.json({
                    status:"0",
                    msg:"",
                    result:'success'
                  })
                }
              })
            }else{
              Goods.findOne({productId:productId},function (err1,doc) {
                if(err1){
                  res.json({
                    status:"1",
                    msg:err1.message
                  })
                }else{
                  if(doc){
                    doc.productNum = 1;
                    doc.checked = 1;
                    userDoc.cartList.push(doc);
                    userDoc.save(function (err2,doc2) {
                      if(err2){
                        res.json({
                          status:"1",
                          msg:err2.message
                        })
                      }else{
                        res.json({
                          status:"0",
                          msg:"",
                          result:'success'
                        })
                      }
                    })
                  }
                }
              })
            }

          }
        }
    })
})
module.exports = router;
