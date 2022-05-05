$(function () {

    var layer = layui.layer
    var form = layui.form
    initArtCateList()
    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: (res) => {
                var htmlStr = template('tpl-table', res)
                console.log('res', res);
                $('tbody').html(htmlStr)
            }
        })
    }

    //为添加类别按钮绑定点击事件
    var indexAdd = null
    $('#btnAddCate').on('click', () => {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    //通过代理的形式 为form-add表单 绑定 submit 事件
    $('body').on('submit', '#form-add', (e) => {
        e.preventDefault();
        var data = {
            name: $('body [name=name]').val(),
            alias: $('body [name=alias]').val()
        }
        // console.log('data=>',data);
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: data,
            success: (res) => {
                if (res.status !== 0) {
                    return layui.layer.msg('新增分类失败')
                }
                initArtCateList()
                layui.layer.msg('新增分类成功')
                //根据索引 关闭对应的弹出层
                layer.close(indexAdd)
            }
        })

    })

    //代理 为 编辑 按钮 绑定 点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', (e) => {
        //弹出一个修改文章分类的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html(),
        })

        //获取当前点击的文章分类的id
        var id = $(e.target).attr('data-id')
        console.log('id=>', id);
        //根据id获取文章分类的信息


        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: (res) => {
                form.val('form-edit', res.data)
            }
        })
    })

    // 代理 监听修改表单的submit 事件
    $('body').on('submit', '#form-edit', (e) => {
        //阻止表单的提交行为
        e.preventDefault()
        var data = {
            Id: $('body [name=Id]').val(),
            name: $('body [name=name]').val(),
            alias: $('body [name=alias]').val()
        }
        // console.log('data=>',data);
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: data,
            success: (res) => {
                if (res.status !== 0) {
                    console.log('res.message=>', res.message);
                    return layer.msg('修改失败')
                }
                initArtCateList()
                layer.close(indexEdit)
                layer.msg('修改成功')

            }
        })
    })

    //代理 为 删除 绑定 点击事件
    $('tbody').on('click', '.btn-delete', (e) => {
        var id = $(e.target).attr('data-id')
        //提示用户是否要删除
        layer.confirm('确认删除', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: (res) => {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    initArtCateList()
                    layer.msg('删除成功')
                    layer.close(index);
                }
            })
        });
    })
})