/**
 * Created by Administrator on 2017/7/19.
 */
var mongooes = require('mongoose');
var userSchema = new mongooes.Schema({
  "userId":String,
  "userName":String,
  "userPwd":String,
  "orderList":Array,
  "cartList":[{
      "productId":String,
      "productName":String,
      "salePrice":String,
      "productImage":String,
      "checked":String,
      "productNum":String
      }
  ],
  "addressList":[
    {
      "addressId" : String,
      "userName" : String,
      "streetName" : String,
      "postCode" : Number,
      "tel" : Number,
      "isDefault" : Boolean
    }
  ]

});
module.exports = mongooes.model("User",userSchema);
