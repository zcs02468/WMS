<template>
    <canvas id="can" 
    :width="canvasW" 
    :height="canvasH" 
    @mousedown.stop="mouseDownAction($event)" 
    @mouseup.stop="mouseUpAction($event)"
    @mousemove.stop="mouseMoveAction($event)"></canvas>
</template>

<style>
canvas {
    border-radius: 0 0 1rem;
    user-select: none;
}
</style>

<script>
  export default {
      props:{
          value:{}
      },
    data () {
      return {
        bot:null,//画布div
        X:null,
        Y:null,
        X1:null,
        Y1:null,//坐标
        flag:0,
        time:null,//定时器ID
        color:0,//记住所选颜色
        lineW:2,//画笔粗细
        canvas:null,//创建画布
        context:null,//获取上下文
        isMouseDown:false,//记录鼠标是否按下
        isClearCanvas:false
      }
    },
    created () {

    },
    mounted () {
        this.isClearCanvas = this.value;
        this.canvas=document.getElementById("can");
        //获取上下文
        this.context=this.canvas.getContext("2d");
    },
    destroyed () {

    },
    computed: {
        canvasW() {
            return this.$store.state.fontSize * 27.1;
        },
        canvasH() {
            return this.$store.state.fontSize * 12.2;
        }
    },
    methods: {
        
        /**
         *鼠标按下
         */
        mouseDownAction(e){
            this.isMouseDown=true;
            //记录下鼠标点击的时候的位置
            this.X= e.offsetX;
            this.Y= e.offsetY;
            let _this = this;
            document.onmouseup = () => {
                this.mouseUpAction()
            }
        },

        /**
         *鼠标移动
         */
        mouseMoveAction(e){
            if(this.isMouseDown){
                this.X1= e.offsetX;
                this.Y1= e.offsetY;
                this.drowline(this.X,this.Y,this.X1,this.Y1);
                this.flag++;
            }
        },

        /**
         *鼠标弹起来
         */
        mouseUpAction(e){
            this.isMouseDown=false;
            this.flag=0;
            document.onmouseup = null;
            this.save_pic();
        },
        /**
         * 绘制
         */
        drowline(num1,num2,num3,num4){
            //开启新的路径
            if(this.flag)
            this.context.beginPath();
            //移动画笔的初始位置
            this.context.moveTo(num1,num2);
            this.context.lineWidth=2;
            // this.context.strokeStyle="red";
            
            //移动画笔的结束位置
            this.context.lineTo(num3,num4);
            //开始绘制
            this.context.stroke();

            if(this.flag!=0){
                this.X=this.X1;
                this.Y=this.Y1;
            }
        },
        save_pic(){//保存画图
            let str= this.canvas.toDataURL("image/png",0.92);
            this.$emit('updateImgUrl',str)
            console.log('更新路径')
        }
    },
    watch: {
        value(newVal, oldVal) {
            this.isClearCanvas = newVal;
        },
        isClearCanvas(val) {
            if( val ) {
                console.log( val)
                this.context.beginPath();  
                this.context.clearRect(0,0,this.canvas.width,this.canvas.height);  
                this.context.closePath();  
                this.isClearCanvas = false;
                this.$emit('updateImgUrl',null)
            }
            this.$emit("input", val);
        }
    }
  }
</script>