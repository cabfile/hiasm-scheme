const { parse } = require("../index.js");

async function main() {
	if(!process.argv[2]) {
		console.log("Provide a .sha as an argument.");
	}
	console.log(await parse(process.argv[2]));
}
main();