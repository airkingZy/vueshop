<template>
  <div>
    <carousel indicator-position="outside">
      <carousel-item v-for="item in 4" :key="item">
        <h3>{{ item }}</h3>
        <img src="http://www.placehold.it/1230X300" alt="" class="item-img">
      </carousel-item>
    </carousel>
  </div>
</template>
<style>
  .carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }
  h3{
    text-align: center;
  }
  .item-img{
    height: inherit;
    width: inherit;
  }

  .carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
<script>
  import {Carousel,CarouselItem} from 'element-ui'
  import '../../node_modules/element-ui/lib/theme-default/index.css'
    export default{
        data(){
            return {
                msg: 'hello vue'
            }
        },
      components:{
        Carousel,
        CarouselItem
      }
    }
</script>
