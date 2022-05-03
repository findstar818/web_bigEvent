$(function () {
    //注册账号
    $('#link_reg').on('click', () => {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    //登录
    $('#link_login').on('click', () => {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    //从 layUI中 获取form对象
    var form = layui.form
    var layer = layui.layer
    //通过 form.verify() 自定义校验规则
    form.verify({
        //自定义pwd校验规则
        pwd: [/^[\S]{6,12}$/, '密码长度为6-12位，且不能出现空格'],
        //校验两次密码是否一致
        repwd: function (value) {
            //通过形参拿到的是确认密码框的内容，需要拿到密码框的内容进行比较
            //判断失败 return 错误提示
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    //监听注册表单提交事件
    $('#form_reg').on('submit', (e) => {
        //阻止默认的提交行为
        e.preventDefault()
        //发起Ajax 的 POST 请求
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser',data , (res) => {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功')
            //模拟人的点击行为
            $('#link_login').click()
        })
    })

    //监听登录表单的提交事件
    $('#form_login').submit((e)=>{
        //阻止默认提交行为
        e.preventDefault()
        var data = {
            username: $('#form_login [name=username]').val(),
            password: $('#form_login [name=password]').val()
        }
        $.ajax({
            url:'/api/login',
            method:'POST',
            //快速获取表单数据
            // data:$(this).serialize(),  我报错
            data:data,
            success:(res)=>{
                if(res.status !== 0){
                    console.log('res.message=>',res.message);
                    return layer.msg('登陆失败')
                }
                layer.msg('登陆成功')
                console.log('res.token=>',res.token);
                //将得到的token 字符串保存到localStorage中
                localStorage.setItem('token',res.token)
                //跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})