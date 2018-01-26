http://ask.dcloud.net.cn/article/114


视频拍摄能不能限制拍摄时间和微信小视频一样
原文 http://ask.dcloud.net.cn/question/45756

可以通过 Native.js 实现，通过设置 android.intent.extra.durationLimit 来限定录像时间。
<button id="btn" type="button" class="mui-btn mui-btn-blue mui-btn-block">按钮</button>
<script type="text/javascript">
    document.querySelector('#btn').addEventListener('click',function () {
        // 调用原生android摄像头
        var VIDEOZOOM = 200;
        var MediaStore = plus.android.importClass("android.provider.MediaStore");
        var Intent = plus.android.importClass("android.content.Intent");
        // 导入后可以使用new方法创建类的示例对象
        var intent = new Intent("android.media.action.VIDEO_CAPTURE");
        intent.putExtra("android.intent.extra.videoQuality", 1);//0 means low quality, 1 means high quality
        //intent.putExtra("android.provider.MediaStore.EXTRA_OUTPUT", url);
        intent.putExtra("android.intent.extra.durationLimit", 3);//设置录像时间

        var main = plus.android.runtimeMainActivity();
        main.startActivityForResult(intent,VIDEOZOOM);
        //获取返回参数
        main.onActivityResult = function(requestCode, resultCode, data) {
            var context = main;
            plus.android.importClass(data);
            var uri = data.getData();
            var resolver = context.getContentResolver();
            plus.android.importClass(resolver);
            var cursor = resolver.query(uri, null, null, null, null);
            plus.android.importClass(cursor);
            cursor.moveToFirst();
            var column = cursor.getColumnIndexOrThrow(MediaStore.Video.Media.DATA);
            // 获取录制的视频路径
            var filePath = cursor.getString(column);

            // 解析视频文件的属性
            plus.io.resolveLocalFileSystemURL(filePath,function(entry) {
                entry.file(function(file){
                    console.log("size=="+file.size); 
                    console.log("name=="+file.name);
                });
            }, function (e) {
                console.log("Resolve file URL failed: " + e.message);
            });
        };
    })
</script>
