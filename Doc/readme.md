我想用express写一个用于检查机器学习中是有的测试数据集中的图片标注是否正确的网站.
功能
1 图片准备
raw_path raw图片目录:  public/images/originals
mask_path mask图片目录: public/images/masks 
1) 读取本地的raw图片目录,
2) 根据这个目录下的图片,去读取对应的mask图片,
读取规则,
读取一张raw图片, 图片文件名 name
4长mask 的图片都图片
 mask_path + name + `/kp_01.png`
 mask_path + name + `/kp_02.png`
 mask_path + name + `/kp_21.png`
 mask_path + name + `/kp_03.png`

2. 标注数据库
1) 根据原始图片文件列表, 生成一个数据库
2) 4个字表: 
   文件名、
   isRight(null 默认,未标注,true 正确,false错误), 
   isMask(默认 true 没有错误,false 存在错误)
   update 最后一次修改时间

3. 网页显示
1) 每一页用table显示100套图片
2) 页面header
   ‘图片标注检查工具’, 大标题,居左
   统计数据,从数据库取, 总的原始图片数, 正确数,错误数
2)  一行只显示一套图, 一套图包含, 
   标题: 原图名,在套图顶部,居左显示
   1张原始图片,
   4张mask+原图的拼接图片
   [错误]、[正确] 按钮, 和标题在一行, 居右显示
   点击错误按钮, 
       就将数据库中,该原始图片的文件名对应的那一行数据中的isRight 改为false,并跟新update时间.
       在标题后面,增加一个黑色底, 白色字都文案‘错误’,
   点击正确按钮, 
       就将数据库中,该原始图片的文件名对应的那一行数据中的isRight 改为true,并跟新update时间.
       在标题后面,增加一个淡蓝色底, 白色字都文案‘正确’

3) 图片
   5张图片都224*224的尺寸显示
   每一张mask图片都和raw叠加在一起. mask图片在上面,raw图片在下面
   图片拉伸修改, 不是等比例拉伸, 不用保持图片比例,  直接把长宽拉伸到224px × 224px   