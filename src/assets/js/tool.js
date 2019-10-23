// 得到网址上面的参数名及参数值
function getUrlParams () {
    let index = decodeURI(window.location.href).indexOf('?');
    let url = decodeURI(window.location.href).substr(index+1);
    let arr = url.split('&');
    let obj = {};
    for(var i=0; i< arr.length; i++) {
        obj[arr[i].split("=")[0]]=unescape(arr[i].split("=")[1]);
    };
    return obj
}
// 把getUrlParams封装好的给导入出去
export {getUrlParams}



/**
 * 把时间转化成2017-05-28类似这样的时间格式
 */
function changeday(num) {
    let date = new Date(num);
    let z = date.getFullYear() + '-',
        b = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1)  : date.getMonth() + 1) + '-',
        n = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) ;
    return z+b+n;
}
export {changeday}


/**
 * 把时间转化成2017-05-28 00:00:00 类似这样的时间格式
 */
function changeTime(time){
    let date = new Date(time);
    let z = date.getFullYear() + '-',
    b = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-',
    n = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + " " ,
    h = (date.getHours() < 10 ? '0'+ (date.getHours()) : date.getHours()) + ":",
    m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ":",
    s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
    return z+b+n+h+m+s;
}
export {changeTime}



/**
 * 数组求和函数
 */
function getNumBox(arr) {
    var a = 0;
    for(var i = 0;i < arr.length; i++){
        a += arr[i];
    }
    return a;
}
export {getNumBox}



/**
 * 根据一个数组数据，过滤另一个数组数据
 * @param {Array}  arr 被过滤的数组
 * @param {Array}  filterArr 过滤的数组
 * @param {String} id 对象的属性名（根据哪个字段）
 * 
 */
function arrFilter(arr, filterArr, id) {
    let filterIds = filterArr.map(item => item[id]);
    return arr.filter(item => !filterIds.includes(item[id]));
}
export {arrFilter}



/**
 *  由对象组成的数组按字母进行排序
 *  @param {Array} arr 对象数组的数组
 *  @param {String} eachName 数组里对象里的属性 按照这个属性的字母顺序进行排序
 */
function sortName(arr,eachName) {
    arr.forEach(function(item) {
        let temp = item[eachName];
        item.sortName = temp;
    })
    let resultArray = arr.sort(
        function compareFunction(param1, param2) {
            return param1.sortName.localeCompare(param2.sortName,"zh")
        }
    )
    return resultArray
}
export {sortName}




/**
 * 获取 当前日期 年  月  日
 */
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}
export{getNowFormatDate}

/**
 * 
 * 获取一个数的占总数的百分比
 */
function GetPercent(num, total) {
    /// <summary>
    /// 求百分比
    /// </summary>
    /// <param name="num">当前数</param>
    /// <param name="total">总数</param>
    num = parseFloat(num);
    total = parseFloat(total);
    if (isNaN(num) || isNaN(total)) {
        return "-";
    }
    return total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00)+"%";
}
export {GetPercent}


/**
 *  两个时间相差天数 兼容firefox chrome
 */

function datedifference(sDate1, sDate2) {    //sDate1和sDate2是2006-12-18格式  
    var dateSpan,
        tempDate,
        iDays;
    sDate1 = Date.parse(sDate1);
    sDate2 = Date.parse(sDate2);
    dateSpan = sDate2 - sDate1;
    dateSpan = Math.abs(dateSpan);
    iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
    return iDays
};

export {datedifference}

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "H+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)){
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o){
         if (new RegExp("(" + k + ")").test(fmt)){
             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));    
         }
    }
    return fmt;
}



/**
 * token传参  obj为一个对象
 */
function getToken(obj) {
    let token = '',
        objValue = Object.values(obj);
    objValue.forEach(ele => {
        if(ele.length === 0 || ele === '') {
            token = ''
        } else {
            token += this.$md5(ele)
        }
    })
    return token
}
export {getToken}