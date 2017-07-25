/**
 * Created by Administrator on 2017/7/18.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//创建实例
var productSchema = new Schema({
  "productId":String,
  "productName":String,
  "salePrice":Number,
  "productImage":String,
  "checked":String,
  "productNum":Number
});
//输出
module.exports = mongoose.model('Good',productSchema);

//model实现层
