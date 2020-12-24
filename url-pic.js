const rp = require("request-promise")
const fs = require('fs')
const cheerio = require("cheerio");

async function getPage(url) {
	const data = {
		url,
		res: await rp(
			url
		)
	}

	return data;
}

async function use() {
	const result = await getPage('http://chd.sdo.com/web6/index/index.htm')
	const $ = cheerio.load(result.res)
	fs.mkdir("./2", async (err) => {
		if (err) {
			console.log(err)
		}
		for (let i = 0; i < $('img').length; i++) {
			let imgSrc = $("img")[i].attribs.src
			if (imgSrc.match('http')) {
				let houZhui = imgSrc.slice(imgSrc.lastIndexOf('.') + 1).toLowerCase()
				if (houZhui == 'png' || houZhui == 'jpg' || houZhui == 'jpeg') {
					await rp({
						url: imgSrc
					}).pipe(fs.createWriteStream(`./2/${i}.${houZhui}`))
				}
			}
		}
	})
}
use()