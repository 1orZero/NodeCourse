const http = require("http");
const fs = require("fs");
const replaceTemplate = require("./modules/replaceTemplate");

const tempOverview = fs.readFileSync(
	`${__dirname}/templates/template-overview.html`,
	"utf-8"
);
const tempCard = fs.readFileSync(
	`${__dirname}/templates/template-card.html`,
	"utf-8"
);
const tempProduct = fs.readFileSync(
	`${__dirname}/templates/template-product.html`,
	"utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

////////////////////////////////////////////
// Server Config
const server = http.createServer((req, res) => {
	const baseURL = "http://" + req.headers.host + "/";
	const urlInfo = new URL(req.url, baseURL);
	const pathname = urlInfo.pathname;
	const query = urlInfo.searchParams;

	// Overview Page
	if (pathname === "/" || pathname === "/overview") {
		res.writeHead(200, {
			"Content-type": "text/html",
		});

		const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el));
		const result = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);

		res.end(result);

		// Product Page
	} else if (pathname === "/product") {
		const id = query.get("id");
		const selectedProduct =
			dataObj.find((product) => product.id == id) || null;

		let output = "";
		if (selectedProduct) {
			output = replaceTemplate(tempProduct, selectedProduct);
			res.end(output);
		} else {
			res.end(tempOverview);
		}

		// API
	} else if (pathname === "/api") {
		res.writeHead(200, {
			"Content-type": "application/json",
		});
		res.end(data);

		// Not found
	} else {
		res.writeHead(404);
		res.end("Page not found");
	}
});

server.listen(8000, "127.0.0.1", () => {
	console.log("Listening on request on port 8000......");
});
