<template>
    <div class="">
        <Form ref="from" :model="from"  :label-width="80" class="top" style="width: 500px;margin-top:20px;">
            <FormItem label="姓名" prop="name">
                <Input v-model="from.name"  clearable></Input>
            </FormItem>
            <FormItem label="电话" prop="phone" >
                <Input v-model="from.phone" clearable></Input>
            </FormItem>
            <FormItem label="地址" prop="address">
                <Input v-model="from.address" clearable></Input>
            </FormItem>
            <FormItem >
                <Button type="primary" @click="handleSubmit('from')">添加</Button>
            </FormItem>
        </Form>
        <!-- 列表 -->
        <div class="table">
            <Table border  :columns="columns" :data="tableData"></Table>
        </div>
    </div>
</template>
<script> 
    export default{
        data(){
            return {
                // 表单数据
                from: {
                    name: '',
                    phone: '',
                    address: '',
                },
                // 表头
                columns:[
                    {
                        title: 'id',
                        key: 'id'
                    },
                    {
                        title: '姓名',
                        key: 'name'
                    },
                    {
                        title: '电话',
                        key: 'phone'
                    },
                    {
                        title: '地址',
                        key: 'address'
                    },
                ],
                // 表格数据
                tableData:[]
            }
        },
        created(){
            this.index();
        },
        methods: {
            index(){
                // 创建indexedDB对象，兼容各种浏览器
                var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
                if (!indexedDB) {
                    console.log("你的浏览器不支持IndexedDB");
                }
                //创建请求打开indexDB
                var request = indexedDB.open('user');
                // 触发失败时间
                request.onerror = function(e) {
                    console.log(e.currentTarget.error.message);
                };
                // 触发成功时间
                request.onsuccess = function(e) {
                    console.log(e.target.result);
                    console.log('成功打开DB');
                };
                
                //在第一次打开页面初始化数据库时会被调用，或在当有版本号变化时。所以，你应该在onupgradeneeded函数里创建你的存储数据。如果没有版本号变化，而且页面之前被打开过，你会获得一个onsuccess事件。
                request.onupgradeneeded = function(e) {
                    var db = e.target.result;
                    if (!db.objectStoreNames.contains('person')) {
                        console.log("我需要创建一个新的存储对象");
                        //如果表格不存在，创建一个新的表格（keyPath，主键 ； autoIncrement,是否自增），会返回一个对象（objectStore）
                        var objectStore = db.createObjectStore('person', {
                            keyPath: "id",
                            autoIncrement: true
                        });
                        //指定可以被索引的字段，unique字段是否唯一
                        objectStore.createIndex("name", "name", {
                            unique: false
                        });
                        objectStore.createIndex("phone", "phone", {
                            unique: false
                        });

                    }
                };
                // 添加数据
                var transaction = db.transaction(storeName, 'readwrite');
            }
        }
    }
</script>