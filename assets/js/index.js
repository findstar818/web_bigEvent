$(function () {
    //调用 getUserInfo 获取用户的基本信息
    getUserInfo()
    var layer = layui.layer
    //点击按钮，实现退出功能
    $('#btnLogout').on('click', () => {
        //弹出提示消息框
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //清空本地存储token
            localStorage.removeItem('token')
            //跳转登录页面
            location.href = '/login.html'
            //关闭 confirm 询问框
            layer.close(index);
        });
    })
})

//获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //headers 就是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: (res) => {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            //调用 renderAvatar 渲染用户头像
            renderAvatar(res.data)
        },
        //不论成功还是失败 最后都会调用 complete 函数
       
    })
}
//渲染用户头像
function renderAvatar(user) {
    //获取用户昵称
    var name = user.nickname || user.username
    //设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    //按需渲染用户头像
    if (user.user_pic !== null) {
        //渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        //渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}