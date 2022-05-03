//每次调用$.get 或者 $.post 或者 $.ajax的时候
//会先调用 ajaxprefilter函数
//在这个函数中 可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter((options) => {
    //在发起真正的 ajax 请求之前 统一拼接路径
    options.url = 'http://www.liulongbin.top:3007' + options.url

    //统一为有权限的接口设置 headers 请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    //全局统一挂载 complete 回调函数
    options.complete = (res) => {
        //在 complete 回调函数中 可以使用res.responseJSON
        // 拿到服务器响应回来的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //强制清空 token 
            localStorage.removeItem('token')
            // 强制跳转到登录页面
            location.href = '/login.html'
        }
    }

})