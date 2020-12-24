let request = require('request')
const cheerio = require('cheerio')
let fs = require("fs");
let UUID = require("uuid");


/* ———————百度搜索图片下载——————— */
// 删除文件夹下文件
let deleteFiles = (path) => {
    //读取文件夹下的文件
    let files = fs.readdirSync(path);
    files.forEach(function (file, index) {
        let curpath = path + "/" + file;
        //删除文件夹下的文件
        fs.unlinkSync(curpath);
    });
}
// 保存图片
let saveImg = (data, fileName = 'images') => {
    for (let i = 0; i < data.length - 1; i++) {
        let img_src = fileName == 'images' ? data[i].middleURL : data[i];
        let ext = img_src.split(".").pop();
        let ID = UUID.v1();
        request(img_src).pipe(fs.createWriteStream(`./${fileName}/${ID}.${ext}`));
    }
}
// 根据关键字在百度搜索下载图片
let downImg = (kw, pn) => {
    deleteFiles("images");
    let keyword = encodeURIComponent(kw)
    let url = `https://image.baidu.com/search/acjson?tn=resultjson_com&ipn=rj&ct=201326592&is=&fp=result&queryWord=${keyword}&cl=2&lm=-1&ie=utf-8&oe=utf-8&adpicid=&st=-1&z=&ic=0&word=${keyword}&s=&se=&tab=&width=&height=&face=0&istype=2&qc=&nc=1&fr=&pn=${pn}&rn=30`;
    let obj = {
        url: url,
        method: "get",
    };
    request(obj, function (err, res, body) {
        let objBody = JSON.parse(body);
        saveImg(objBody.data);
    });
}
// downImg('游戏', 10)
/* ———————百度搜索图片下载——————— */



let http = (url) => {
    return new Promise((resolve, rej) => {
        request({
            url,
            method: 'get'
        }, (err, res, body) => {
            resolve(res)
        })
    })
}
http('https://pokemondb.net/sprites').then((res) => {
    // 遍历宠物名字然后收集再生成
    // const $ = cheerio.load(res.body)
    // let list = Array.from($('.infocard-list a'))
    // let name = []
    // list.forEach((item) => {
    //     name.push(item.children[2].data)
    // })
    // name = JSON.stringify(name)
    // fs.writeFile('sprites.json', name, function (err) {
    //     if (err) {
    //         return console.error(err);
    //     }
    //     console.log("数据写入成功！");
    // });

    // 遍历宠物图片然后下载
    // const $ = cheerio.load(res.body)
    // let list = Array.from($('.icon-pkmn'))
    // let srcArr = list.map((item) => item.attribs['data-src'])
    // saveImg(srcArr, 'sprites')
})

