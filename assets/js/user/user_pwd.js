$(function () {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须由6-12位且不能出现空格'],
        samePwd: (value) => {
            var pwd = $('.layui-input-block [name=oldPwd]').val()
            if (pwd === value) {
                return '新旧密码不能相同'
            }
        },
        repwd: (value) => {
            var pwd = $('.layui-input-block [name=newPwd]').val()
            if (value !== pwd) {
                return '两次密码不一样'
            }
        }
    })

    $('.layui-form').on('submit', (e) => {
        var data = {
            oldPwd:$('[name=oldPwd]').val(),
            newPwd:$('[name=newPwd]').val()
        }
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data:data,
            success:(res)=>{
                if(res.status !== 0){
                    return layer.msg('更新密码失败')
                }
                layer.msg('更新密码成功')
                //重置表单
                $('.layui-form')[0].reset()
            }
        })
    })























})