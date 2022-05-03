//每次调用$.get 或者 $.post 或者 $.ajax的时候
//会先调用 ajaxprefilter函数
//在这个函数中 可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter((options)=>{
    console.log('options.url=>',options.url);
    //在发起真正的 ajax 请求之前 统一拼接路径
    options.url = 'http://www.liulongbin.top:3007'+options.url
})