$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    //定义一个查询的参数对象，将来请求对象的时候
    //需要将请求对象提交到服务器
    var q = {
        pagenum: 1, //页码值 默认第一页
        pagesize: 2, // 每页显示几条数据 默认两条
        cate_id: '', //文章分类的 Id
        state: '',  //文章的发布状态
    }

    initTable()
    initCate()

    //定义美化事件的过滤器
    template.defaults.imports.dataFormat = function (data) {
        var dt = new Date(data)

        var Y = dt.getFullYear()
        var M = padZero(dt.getMonth() + 1)
        var D = padZero(dt.getDate())

        var h = padZero(dt.getHours())
        var m = padZero(dt.getMinutes())
        var s = padZero(dt.getSeconds())

        return Y + '-' + M + '-' + D + '' + h + ':' + m + ':' + s
    }

    //定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    //获取文章列表数据的方法
    function initTable() {
        console.log('q',q);
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: (res) => {
                if (res.status !== 0) {
                    console.log('res.message=>',res.message);
                    return layui.layer.msg('获取文章列表失败')
                }
                //使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                //调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    //初始化文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: (res) => {
                if (res.status !== 0) {
                    return layui.layer.msg('获取分类数据失败')
                }
                //调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    //为筛选表单绑定 submit 事件
    $('#form-search').on('submit', (e) => {
        e.preventDefault()
        //获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        //为查询对象 q 对应属性赋值
        q.cate_id = cate_id
        q.state = state
        
        //根据最新的筛选条件重新渲染表单数据
        initTable()
    })

    //定义渲染分页的方法
    function renderPage(total) {
        //调用laypage。render()方法来渲染分页的结构

        /**
         *      注意 本web 中 接口数据错误 total=0
         *      造假 手动title = 20 
         */
        // var total = 20

        laypage.render({
            elem: 'pageBox', //分页容器的 Id
            count: total,    //总数据条数
            limit: q.pagesize,   //每页显示几条数据
            curr: q.pagenum,  //设置默认选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //分页发生切换时触发 jump 回调
            //触发 jump 回调条件:
            //  --点击页码时触发
            //  --调用laypage.render()方法
            jump: (obj, first) => {
                //可以通过 first 的值 判断是那种方法触发的jump
                //first = true 方式二
                //first = undefined 方式一
                //最新页码值赋值给 q 查询参数
                q.pagenum = obj.curr
                //把最新的条目数赋值到 q 的pagesize
                q.pagesize = obj.pagesize
                //根据最新的 q 获取对应的数据列表，并开始渲染
                if (!first) {
                    initTable()
                }
            }
        })
    }

    //代理 为删除按钮 绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', (e) => {
        console.log('OK');
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        //询问用户是否删除
        var id = $(e.target).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: (res) => {
                    if (res.status !== 0) {
                        console.log('res.message=>',res.message);
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    //当数据删除完成后，需要判断当前页是否还有剩余的数据
                    //如果没有 则页码值 -1 之后
                    //再调用 initTable()
                    if (len === 1) {
                        //如果 len 的值 =1 证明删除后页面上没有数据了
                        //页码值最小必须是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })
})