<!-- InputNumber -->
<template>
    <div class="input-number" :class="['input-number-'+ type, isCenter ? 'input-height-center' : '']">
        <span class="arrow top-arrow iconfont icon-tArrow" v-show="!isBtn" :class="[ currentInputValue >= max ? 'ban-pointer' : '']" @click="addNum"></span>
        <span class="arrow bottom-arrow iconfont icon-bArrow" v-show="!isBtn" :class="[ currentInputValue<= min ? 'ban-pointer' : '']" @click="subNum"></span>
        <input type="text" :max="max" :min="min" v-model="currentInputValue" :disabled="isBtn"  @input="handleInput" @blur="inputBlur">
    </div>
</template>

<script>
export default {
    name: "inputNumber",
    props: {
        type: {
            type: String,
            default: "default"
        },
        number: {
            type: [String, Number],
            default: 1
        },
        min: {
            type: Number,
            default: -Infinity
        },
        max: {
            type: Number,
            default: Infinity
        },
        index:{
            type:[String,Number],
            default:'',
        },
        isCenter:Boolean,
        value: {},
        isBtn:Boolean
    },
    data() {
        return {
            currentValue: 0
        };
    },

    methods: {
        addNum() {
            if (this.currentValue++ >= this.max) this.currentValue = this.max;
        },
        subNum() {
            if (this.currentValue-- <= this.min) this.currentValue = this.min;
        },
        handleInput(e) {
            this.currentValue = e.target.value.replace(/[^\d]/g, "");
        },
        inputBlur() {
            let newVal = this.currentValue === undefined ? this.currentValue : Number(this.currentValue);
            if (newVal >= this.max) newVal = this.max;
            if (newVal <= this.min) newVal = this.min;
            this.currentValue = newVal;
        }
    },

    computed: {
        currentInputValue: {
            get: function() {
                return this.currentValue;
            },
            set: function(newValue) {
                this.currentValue = newValue;
            }
        }
    },

    watch: {
        value: {
            immediate: true,
            handler(value) {
                let newVal = value === undefined ? value : Number(value);
                if (newVal !== undefined) {
                    if (isNaN(newVal)) {
                        return;
                    }
                }
                if (newVal >= this.max) newVal = this.max;
                if (newVal <= this.min) newVal = this.min;
                this.currentValue = newVal;
                this.$emit("input", newVal);
            }
        },
        currentInputValue(val) {
            this.$store.commit('editStockoutNum',{key:'stockoutnNum',index:this.index,value:val})
        }
    }
};
</script>
<style lang="less" scoped>
.input-number-default {
    // width: 102px;
    // height: 36px;
    width: 90px;
    height: 30px;
    background: #e8e8e8;
    border-radius: 5px;
    position: relative;
    .arrow {
        width: 22px;
        height: 15px;
        position: absolute;
        z-index: 1;
        right: 0;
        text-align: center;
        background: transparent;
        cursor: pointer;
        line-height: 18px;
        color: #7d7a7a;
        -moz-user-select: none; /*火狐*/
        -webkit-user-select: none; /*webkit浏览器*/
        -ms-user-select: none; /*IE10*/
        -khtml-user-select: none; /*早期浏览器*/
        user-select: none;
        &:hover {
            color: #000;
        }
    }
    .ban-pointer {
        cursor: not-allowed;
    }
    .top-arrow {
        top: 0;
    }
    .bottom-arrow {
        top: 15px;
    }
    input {
        width: 100%;
        height: 100%;
        background: transparent;
        text-indent: 20px;
        position: absolute;
    }
}
.input-height-center {
    top: 50%;
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
}
</style>