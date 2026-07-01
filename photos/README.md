# 照片放这里 / Put your photos here

把你要展示的照片直接复制到这个 photos 文件夹里就行。

建议:
- 文件名尽量用英文 + 数字,别带空格,例如 sunrise-01.jpg、mountain-fog.jpg
- 格式 jpg / png / webp 都行
- 每张控制在 1~2MB 以内、长边约 2000px,网页打开更快(手机导出/相册"中等尺寸"即可)

放好后告诉我一声,我来把它们接进网站。

## 生成网页展示用的压缩图

网站不会直接加载原图,而是用 `photos/web/` 里的压缩版:
- 相册缩略图用 `xxx-thumb.jpg`(长边 1400px)
- 点开大图用 `xxx-display.jpg`(长边 2000px)
- 只有点「查看原图」时才加载 `photos/` 里的原图

加了新照片后,在项目根目录跑一下(零依赖,用 Windows 自带的 .NET):

```
powershell -File make-web-images.ps1
```

默认只补齐缺的压缩图,不动已有的。想全部重做就加 `-Force`,想更小就加 `-Quality 80`。
