<template>
    <div class="body">
        <img src="../assets/images/xm.jpg" alt="">
        <div class="footer">
            <h2>电话咨询：400-863-5888</h2>
            <a href="http://www8.53kf.com/m.php?cid=72055204"><button class="btn">在线咨询</button></a>
            <p>投资有风险  加盟需谨慎</p>
            <p>数据来源于熙美诚品品牌运营中心</p>
        </div>
        
    </div>
</template>
<script>
    export default{
        data(){}
    }
</script>
<style lang="less">
    .body{
        max-width: 750px;
        margin: 0 auto;
        background:#fff;
        width: 100%;
        .footer{
            text-align: center;
            padding-bottom:20px;
            h2{
                margin-bottom: 20px;
                font-size: 25px;
            }
            p{
            font-size: 20px;
            letter-spacing: 2px;

            }
            .btn {
                font-size: 20px;
                display:block;
                position:relative;
                background:#1596ad;
                color:#fff;
                width:50%;
                font-family:'Ubuntu',sans-serif;
                text-decoration:none;
                border-radius:2px;
                overflow:hidden;
                -webkit-transition:all 0.15s ease-in;
                transition:all 0.15s ease-in;
                padding:8px 12px;
                margin: auto;
                margin-bottom: 30px;
            }
            .btn:hover {
                background:#046466;
            }
            .btn:before {
                content:' ';
                position:absolute;
                background:#fff;
                width:25px;
                height:50px;
                top:0;
                left:-45px;
                opacity:0.3;
                -webkit-transition:all 0.25s ease-out;
                transition:all 0.25s ease-out;
                -webkit-transform:skewX(-25deg);
                transform:skewX(-25deg);
            }
            .btn:hover:before {
                width:45px;
                left:400px;
            }
        }   
        
    }
    
</style>