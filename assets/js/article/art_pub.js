$(function () {
    var layer = layui.layer
    var form = layui.form


    initCate()
    //初始化富文本编译器
    initEditor()


    //定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: (res) => {
                if (res.status !== 0) {
                    return layui.layer.msg('获取分类失败')
                }
                //调用模板引擎渲染分类的下拉菜单     
                console.log('res=>', res);
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //调用 form.render()方法重新渲染下拉菜单
                form.render()
            }
        })
    }

    // 图片裁剪区域开始

    //初始化图片裁剪器
    var $image = $('#image')

    //裁剪选项
    var options = {
        aspectRatio: 400 / 200,
        preview: '.img-preview'
    }

    //初始化裁剪区域
    $image.cropper(options)



    // 图片裁剪区域结束


    //选择封面按钮绑定点击事件处理函数
    $('#btnChooseImage').on('click', (e) => {
        $('#coverFile').click()
    })

    //为文件选择框绑定 Change 事件
    $('#coverFile').on('change', (e) => {
        //获取用户选择的图片
        var files = e.target.files
        //判断是否选择了文件
        if (files.length === 0) {
            return
        }
        //根据文件创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        //为裁剪区域重新设置图片
        $image
            .cropper('destroy') //销毁旧的裁剪区域
            .attr('src', newImgURL) //重新设置图片路径
            .cropper(options) //重新初始化裁剪区域
    })


    //定义文章发布状态
    var art_state = '已发布'

    $('#btnSave2').on('click', () => {
        art_state = '草稿'
    })

    //为表单绑定 submit 提交事件
    $('#form-pub').on('submit', (e) => {
        //阻止表单默认提交行为
        e.preventDefault()
        //基于form表单 快速创建FormDate 对象
        var fd = new FormData($('#form-pub')[0])

        //向 FormData中追加发布状态
        fd.append('state', art_state)

        //将封面裁剪过后的图片  输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                //创建一个 Canvas 画布
                width: 400,
                height: 200
            })
            .toBlob((blob) => {
                //将 Canvas 画布上的内容 转化为文件对象
                //得到文件对象后，进行追加到 FormData
                fd.append('cover_img', blob)

                //发起 ajax 请求
                publishArticle(fd)
            })
    })
    //定义 发布文章 方法
    function publishArticle(fd){
        $.ajax({
            method:'POST',
            url:'/my/article/add',
            data:fd,
            //注意 如果向服务器 提交的是 FormData 格式的数据
            //必须添加以下两个配置项
            contentType:false,
            processData:false,
            success:(res)=>{
                if(res.status !== 0){
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功')
                //发布文章成功后跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }

})