# Favicon 设置说明

## 当前状态
- ✅ HTML 文件已配置 favicon 链接
- ⚠️ 需要添加实际的 favicon.ico 文件

## 如何添加你的图片作为 favicon

### 方法 1：使用在线转换工具（推荐）
1. 访问 https://favicon.io/
2. 上传你的图片
3. 下载生成的 favicon.ico 文件
4. 替换 `public/favicon.ico` 文件

### 方法 2：手动转换
1. 将你的图片调整为 16x16 或 32x32 像素
2. 转换为 .ico 格式
3. 放置在 `public/` 目录下

### 方法 3：使用 PNG 格式（现代浏览器支持）
1. 将图片调整为 32x32 像素
2. 保存为 favicon.png
3. 修改 index.html 中的链接：
   ```html
   <link rel="icon" type="image/png" href="/favicon.png" />
   ```

## 部署后生效
重新部署项目后，favicon 将在浏览器标签页中显示：
```bash
./deploy-simple.sh
```

## 注意事项
- 图片应该简洁、清晰
- 建议使用正方形图片
- 文件名必须为 favicon.ico（如果使用 .ico 格式）
- 清除浏览器缓存可能需要一些时间才能看到新图标
