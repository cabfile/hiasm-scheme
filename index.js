const fs = require("fs/promises");
const rec = require('iconv-lite');

async function readFile_win1251(filename) {
    let raw = await fs.readFile(filename);
	let reconverted = rec.encode(rec.decode(raw, 'win1251'), 'utf8').toString();
    return reconverted;
}
if(!String.prototype.replaceAll) {
	String.prototype.replaceAll = function(fromstr,tostr) {
		var str = this;
		while(str.indexOf(fromstr) != -1) {
			str = str.replace(fromstr,tostr);
		}
		return str;
	};
} // fucking node.js v14.x

exports.parse = async function(schm, prettyPrint) {
	var scheme = {};
	var regex = /Add\((.+),(\d+),(\d+),(\d+)\)/;
	var regexPoint = /Point\((.+)\)/;
	var regexLink = /link\((.+),(\d+):(.+),\[(.+)\]\)/;
	let file = await readFile_win1251(schm);
	let lines = file.split("\r\n");
	let pack = lines.splice(0,1)[0];
	let ver = lines.splice(0,1)[0];
	scheme.pack = pack.substring(5,pack.length - 1);
	scheme.hiasmVersion = ver.substring(4,ver.length - 1);
	scheme.elements = [];
	let curelem = null;
	let containerelem = [];
	lines.forEach((lineraw,index)=>{
		var line = lineraw.trimStart();
		if(line.startsWith('Add')) {
			let match = regex.exec(line);
			if(match) {
				curelem = {
					name: match[1],
					id: parseInt(match[2]),
					x: parseInt(match[3]),
					y: parseInt(match[4]),
					props: {},
					points: [],
					links: []
				}
			} else throw new TypeError("No match found for line #"+index+". Make sure you didnt edit the file with an external editor.");
		} else if(line == '}') {
			if(lines[index+1]) {
				if(lines[index+1].trimStart() == 'BEGIN_SDK') {
					containerelem.push(curelem);
					containerelem[containerelem.length-1].elements = [];
				} else if(containerelem.length > 0) {
					containerelem[containerelem.length-1].elements.push(curelem);
					curelem = null;
				} else {
					scheme.elements.push(curelem);
					curelem = null;
				}
			} else {
				scheme.elements.push(curelem);
				curelem = null;
			}
		} else if(line == 'END_SDK') {
			if(containerelem.length == 1) {
				scheme.elements.push(containerelem[0]);
				containerelem = [];
			} else if(containerelem.length > 1) {
				containerelem[containerelem.length-2].elements.push(containerelem.pop());
			} else {
				throw new TypeError("Found a END_SDK, yet no container to be seen.");
			}
		} else if(curelem != null && line != '{') {
			let el = line;
			let prop = el.split("=");
			let point = regexPoint.exec(el);
			let link = regexLink.exec(el);
			if(point) {
				curelem.points.push(point[1]);
			} else if(link) {
				let coordsbefore = link[4].toString().replaceAll('(','[').replaceAll(')','],');
				let coords = JSON.parse('['+coordsbefore.substring(0,coordsbefore.length - 1)+']');
				curelem.links.push({
					point: link[1],
					to: {
						id: link[2],
						name: link[3],
					},
					coords
				});
			} else if(prop) {
				curelem.props[prop[0]] = prop[1];
			}
		}
	});
	/*for(let i = 0; i < elems.length; i++) {
		scheme.elements.push({
			name: elems[i][1],
			id: elems[i][2],
			x: elems[i][3],
			y: elems[i][4],
			props: elems[i][5]
		});
	}*/
	return JSON.stringify(scheme,null,prettyPrint?'  ':null);
};