<template>
  <div v-bind:style="{width: divWidth+'px'}">
    <div ref="picDiv" v-bind:style="{width: divWidth+'px',height: '177px',border: 'solid',borderColor: borderColor,position:'relative'}">
      <img  src="../assets/img.png" v-bind:style="{width: divWidth+'px',height: '177px'}"/>
      <security-code v-bind:styleObj="style1Objs[index]"
                     ref='txt_div'
                     v-for="(item,index) in items"
                     v-bind:key="item.id">
        <template v-slot:p><p v-on:mousedown="mouseDown">{{item.value}}</p></template>
      </security-code>
      <div ref="cloneDiv" class="icon" style="display: none"></div>
    </div>
    <div v-bind:style="{width: divWidth+'px',height: '40px',border: 'solid'}">
      <div v-bind:style="{display:'inline',float: 'left',margin: '0px 15px 0px 15px'}"><p v-bind:style="{fontSize:  '15px'}">请依次点击:</p></div>
      <security-code v-bind:styleObj="style2Objs[index]" ref='txt_div' v-for="(item,index) in items" v-bind:key="item.id">
        <template v-slot:p><p>{{item.value}}</p></template>
      </security-code>
    </div>
  </div>

</template>

<script>
import SecurityCode  from 'components/common/SecurityCode'

export default {
  name: "Verification",
  components: {
    'security-code': SecurityCode
  },
  props: {
    divWidth : {
      type:String,
      default: "280"
    },
  },

  methods: {
    mouseDown(e){
      const p = e.target;
      if(this.preVerifyCode !== p){
        this.preVerifyCode = p;
        this.counter++;
        const div = p.parentElement;
        const picDiv = this.$refs['picDiv'];
        const cloneDiv = this.$refs['cloneDiv'].cloneNode(true);
        cloneDiv.style.position = 'absolute';
        cloneDiv.style.display = 'block';
        cloneDiv.setAttribute('class','icon icon-number'+this.counter);
        cloneDiv.style.top = div.style.top;
        cloneDiv.style.left = div.style.left;
        picDiv.appendChild(cloneDiv);
        this.verifyCodes.push(cloneDiv);

        this.verifyTexts[this.counter] = p.innerText;
        if(this.counter / 4 == 1){
          let validFlag = true;
          this.verifyTexts.forEach((value,index)=> {
            if(value !== this.items[index-1].value){
              validFlag = false;
              this.counter = 0;
              let length = this.verifyCodes.length;
              for(let i=0; i<length;i++){
                picDiv.removeChild(this.verifyCodes.pop());
              }
              this.preVerifyCode = null;
              this.verifyTexts.length = 0;
              this.$emit('verify',false);
              this.borderColor = 'red';
              return;
            }
          })
          if(validFlag){
            this.verifyFlag = true;
            this.$emit('verify',true);
            this.borderColor = 'green';
          }

        }

      }
    }
  },
  //元素挂载之后
  mounted() {
    const colors = ['red','blue','green','#000092','#3D3D3D','black'];
    this.capacity = Number(this.divWidth) / 280;
    const $random = (min,max) => {
      return  Math.floor(Math.random() * (max-min)) + min;
    }

    for(let i=0; i<this.items.length;i++){
      let deg = $random(30,150) + 'deg';
      let fontSize = $random(10,20) + 'px';
      let idx = $random(0,colors.length);

      this.style2Objs.push({
        color: colors[idx],
        fontSize: fontSize,
        deg: deg,
        margin: '0px 10px 0px 10px',
        display: 'inline'
      });
    }

    const p_left1 = [][2] = [
      [15,40],
      [55,90],
      [105,150],
      [165,205]
    ];

    const p_top1 = [][2] = [
      [10,40],
      [50,80],
      [90,120],
      [130,150]
    ]

    const randomPosition = (min,max) => {
      return $random(min,max)+'px';
    }

    for(let i=0; i<this.items.length;i++){
      let deg = $random(30,150)  + 'deg';
      let fontSize = $random(10,20) + 'px';
      let idx = $random(0,colors.length);
      this.style1Objs.push({
        color: colors[idx],
        fontSize: fontSize,
        deg: deg,
        position: 'absolute',
        left: randomPosition(p_left1[i][0],p_left1[i][1]),
        top: randomPosition(p_top1[i][0],p_top1[i][1])
      });
    }
  },

  data(){

    return {
      preVerifyCode: null,
      verifyTexts: [],
      verifyCodes: [],
      verifyFlag: false,
      borderColor: '',
      counter: 0,
      capacity: 1,
      style1Objs: [],
      style2Objs: [],
      items: [
        {
          id: 1,
          value: '我'
        },
        {
          id: 2,
          value: '是'
        },
        {
          id: 3,
          value: '你'
        },
        {
          id: 4,
          value: '啊'
        }]
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

/*.specialDiv {
  --rotate: 7deg;
  --font-size:  25px;
  --color: #000092;
  transform:rotate(var(--rotate));
  -ms-transform:rotate(var(--rotate)); 	!* IE 9 *!
  -moz-transform:rotate(var(--rotate)); 	!* Firefox *!
  -webkit-transform:rotate(var(--rotate)); !* Safari 和 Chrome *!
  -o-transform:rotate(var(--rotate)); 	!* Opera *!
  font-size: var(--font-size);
  color: var(--color);
  float: left;
  margin: 10px;
}*/

.icon {
  width:40px;
  height:41px;
  background: url("../assets/img_1.png") no-repeat;
  display: inline-block;
  background-size: 140px 200px;
  margin: 0;
  padding: 0;
}

.icon-number1 {
  background-position: -10px -3px;
}

.icon-number2 {
  background-position: -50px -3px;
}

.icon-number3 {
  background-position: -89px -3px;
}

.icon-number4 {
  background-position: -11px -42px;
}
</style>
