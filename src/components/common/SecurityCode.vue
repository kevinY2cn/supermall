<template>
<!--  v-bind:style="{color: 'red',fontSize: '25px', transform: 'rotate(deg)'}">-->
  <div class="specialDiv"
      v-bind:style="styleObj">
      <slot name="p"></slot>
  </div>
</template>

<script>
export default {

  data() {
    return {
      mouse_down_counter: 0,
    }
  },

  props: {
   styleObj: {
     type: Object,
     default: () => {
       return {
         color: '#000092',
         fontSize: '25px',
         transform: 'rotate(7deg)',
         margin: '5px',
         display: 'block'
       }
     }
   },
  }

}
</script>

<style scoped>
.specialDiv {
  --rotate: 7deg;
  --font-size:  25px;
  --color: #000092;
  transform:rotate(var(--rotate));
  -ms-transform:rotate(var(--rotate)); 	/* IE 9 */
  -moz-transform:rotate(var(--rotate)); 	/* Firefox */
  -webkit-transform:rotate(var(--rotate)); /* Safari 和 Chrome */
  -o-transform:rotate(var(--rotate)); 	/* Opera */
  font-size: var(--font-size);
  color: var(--color);
  float: left;
}
</style>
