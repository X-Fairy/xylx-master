<template>
    <div class="growppop">
        <!-- 权限编辑弹窗 -->
        <div class="inner">
            <div class="inner_top">
                <div class="left">
                    <p>姓名：<span>{{depname}}</span></p>
                    <p>{{grow_title}}: <span>{{grow_content}}</span></p>
                </div>
                <Icon type="ios-close" @click="$emit('close')" title="关闭弹窗"></Icon>
            </div>
            <!-- <Form class="grow-form" ref="grow" :model="growForm" :label-width="90">
                <FormItem v-for="(value,index) in growForm"  :label="value.title" :key="index">
                    <div class="check_button">
                        <Checkbox :indeterminate="value.indeterminate" :value="value.checkGrowForm.length === value.child.length" @click.prevent.native="handleCheckAll($event, value, index)"><span style="color:red;">全选</span></Checkbox>
                    </div>
                    <CheckboxGroup v-model="value.checkGrowForm" @on-change="(data) => {checkAllGroupChange(data, value)}">
                        <Checkbox v-for="item in value.child" :label="item.id" :key="item.id">{{item.title}}</Checkbox>
                    </CheckboxGroup>
                </FormItem>
            </Form> -->
            <Form class="grow-form" ref="grow" :model="growForm" :label-width="90">
                <FormItem v-for="(item,key) in growForm"  :key="key" >
                    <div v-for="(value,index) in (item.data)" :key="index" >
                        <p style="color: #1596ad;font-size: 16px; font-weight: 700;border-bottom: 1px solid #ddd;margin-bottom: 5px;" :id='(value.title).charAt(0)'>{{value.title}}</p>
                        <div class="check_button">
                            <Checkbox :indeterminate="value.indeterminate" :value="value.checkGrowForm.length === value.child.length" @click.prevent.native="handleCheckAll($event, value, index)"><span style="color:red;">全选</span></Checkbox>
                        </div>
                        <CheckboxGroup v-model="value.checkGrowForm" @on-change="(data) => {checkAllGroupChange(data, value)}">
                            <Checkbox v-for="item in value.child" :label="item.id" :key="item.id">{{item.title}}</Checkbox>
                        </CheckboxGroup>
                    </div>
                    
                </FormItem>
            </Form>
            <div class="sort">
                <ul>
                    <li v-for="(item, index) in growForm" :key="index" @click="jumpTag(item)" :class="{current:currentSort == item.title? true : false}" >
                        {{item.title}}
                    </li>
                </ul>
            </div>
            <div class="bottom">
                <div>
                    <Checkbox :indeterminate="indeterminate" :checked="checkAll"  @on-change="checkAllGroup" style="margin-top: 5px;margin-left: -40px;"><span style="font-weight: 700;color: #1596ad;">全选</span></Checkbox>
                </div>
                <div>
                    <Button class="cancel" @click="$emit('close')">取消</Button>
                    <Button type="error" @click="growquery" style="background: #1596ad;border-color:#1596ad">保存</Button>
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        checkData: {
            type: Array,
            default: () =>　([])
        },

        depname: {
            type: String,
            default: ''
        },

        grow_title: {
            type: String,
            default: ''
        },

        grow_content: {
            type: String,
            default: ''
        },
    },

    created() {
        this.growForm = JSON.parse(JSON.stringify(this.checkData));
        this.pySort(this.growForm);
    },

    data() {
        return {
            //排序后的数据
            growForm: [],
            currentSort: '', // 当前排序的标签
            singerTopTag: '', // 列表头部的标签名字
            //全选
            indeterminate: true,
            checkAll: false,
        }
    },
    
    methods: {
        checkAllGroup(){
            this.indeterminate = false;
            if (this.indeterminate) {
                this.checkAll = false;
            } else {
                this.checkAll = !this.checkAll;
            }
            if (this.checkAll) {
                this.growForm.forEach(ele=>{
                    for(let i in ele.data){
                        ele.data[i].indeterminate=false;
                        ele.data[i].child.forEach(ele => {
                            ele.checked = 1;
                        })
                        ele.data[i].checkGrowForm = ele.data[i].child.map(item => item.id);
                       
                    }
                })
                
            } else {
                this.growForm.forEach(ele=>{
                    for(let i in ele.data){
                        ele.data[i].indeterminate=false;
                        ele.data[i].child.forEach(ele => {
                            ele.checked = 0;
                        })
                        ele.data[i].checkGrowForm = [];
                    }
                })
                
            }
            
        },
        /* 排序 */
        pySort(arr,empty){
            var $this = this;
            if(!String.prototype.localeCompare)
                return null;
            var titles = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');
            var arrList = [];
            for(var m =0;m<arr.length;m++){
                arrList.push(arr[m]);
            }
            var result = [];
            var curr;
            for(var i=0;i<titles.length;i++){
                curr = {title: titles[i],data:[]};
                if(i!=26){
                    for(var j =0;j<arrList.length;j++){
                        var initial = arrList[j].title.charAt(0);//截取第一个字符
                        if(initial==titles[i]||initial==titles[i].toLowerCase()){ 
                            curr.data.push(arrList[j]);
                        }
                    }
                }else{
                    for(var k =0;k<arrList.length;k++){
                        var ini = arrList[k].title.charAt(0);
                        if(!$this.isChar(ini)){
                            curr.data.push(arrList[k]);
                        }
                    }
                }
                if(empty || curr.data.length) {
                    result.push(curr);
                }
            }
            this.growForm=result;
        },
        isChar(char){
            var reg = /[A-Za-z]/;
            if (!reg.test(char)){return false ;}
            return true ;
        },
        // 跳转标签
        jumpTag(i){
            i=i.title;
            this.singerTopTag = i;
            this.currentSort = i;
            document.querySelector(`#${i}`).scrollIntoView();
        },
        handleCheckAll ($event, value, index) {
            value.indeterminate = false;
            if (value.checkGrowForm.length === value.child.length) {
                this.indeterminate = true;
                value.child.forEach(ele => {
                    ele.checked = 0;
                })
                value.checkGrowForm = [];
            } else {
                value.child.forEach(ele => {
                    ele.checked = 1;
                });
                this.indeterminate = false;
                value.checkGrowForm = value.child.map(item => item.id);
            }
        },
        checkAllGroupChange (data, value) {
           if (data.length && data.length !== value.child.length) {
               value.indeterminate = true;
               this.indeterminate = true;
           } else {
               value.indeterminate = false;
               this.indeterminate = false;
           }
        },
        growquery() {
            let c = [];
            let a=[];
            let b=[];
            console.log(this.growForm);
            this.growForm.forEach(item => {
                    a.push(item.data);
                
            })
            for(let i in a){
                b=b.concat(a[i])
            }
            b.forEach(ele=>{
                c = c.concat(ele.checkGrowForm);
            })
            
            if (this.grow_title == '部门') {
                // 说明是对部门进行权限编辑请求
                this.$resetAjax({
                    type: 'POST',
                    url: '/NewA/Users/save_gnid_de',
                    data: {
                        // 部门参数
                        dept_name: this.grow_content,
                        gnid: c
                    },
                    success: (res) => {
                        // 关闭权限编辑框
                        this.$emit('close');
                        // 打开提醒框
                        this.$root.tip.isShow = true;
                        this.$root.tip.content = '部门权限修改成功';
                        setTimeout(() => {
                            this.$root.tip.isShow = false;
                            this.$emit('growquery', this.growForm);
                        }, 2000);
                    }
                })
            } else {
                //  说明是对职位进行权限编辑请求
                this.$resetAjax({
                    type: 'POST',
                    url: '/NewA/Users/save_gnid',
                    data: {
                        position: this.grow_content,
                        gnid: c
                    },
                    success: (res) => {
                        // 关闭权限编辑框
                        this.$emit('close');
                        // 打开提醒框
                        this.$root.tip.isShow = true;
                        this.$root.tip.content = '职位权限修改成功';
                        setTimeout(() => {
                            this.$root.tip.isShow = false;
                            this.$emit('growquery', this.growForm);
                        }, 2000);
                    }
                })
            }
        }
        
    }
}
</script>



