$(function () {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: (value) => {
            if (value.length > 6) {
                return layui.layer.msg('昵称长度必须在 1~6个字符之间')
            }
        }
    })

    initUserInfo()

    //初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: (res) => {
                if (res.status !== 0) {
                    layer.msg('获取用户信息失败')
                }
                //调用 form.val()快速为表单赋值
                form.val('formUserInfo', res.data)
                console.log('res.data=>',res.data);
            }
        })
    }
    //重置表单数据
    $('#btnReset').on('click', (e) => {
        //阻止表单的默认重置行为
        e.preventDefault()
        initUserInfo()
    })

    //监听表单的提交事件
    $('.layui-form').on('submit', (e) => {
        //阻止表单默认提交行为
        e.preventDefault()
        var data ={
            id:$('#id').val(),
            nickname:$('.layui-input-block [name=nickname]').val(),
            email:$('.layui-input-block [name=email]').val()
        }
        // 发起Ajax数据请求

        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            // data: $(this).serialize(), 我为啥用不了这个啊？

            data:data,
            success: (res) => {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功')

                //调用父页面中的方法，重新渲染用户的头像与信息
                window.parent.getUserInfo()
            }
        })
    })
})