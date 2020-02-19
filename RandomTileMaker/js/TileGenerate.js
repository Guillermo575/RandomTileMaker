function getLayout(options = {})
{
	const 
	{
		totalWidth = 512,
		totalHeight = 512,
		TileWidth = 128,
		TileWidthFactor = .5,
		TileHeight = 128,
		TileHeightFactor = .5 
	} = options;
	const baseWidth = TileWidth;
	const variationWidth = baseWidth * TileWidthFactor;
	const minSizeWidth = baseWidth - variationWidth;
	const maxSizeWidth = baseWidth + variationWidth;
	const baseHeight = TileHeight;
	const variationHeight = baseHeight * TileHeightFactor;
	const minSizeHeight = baseHeight - variationHeight;
	const maxSizeHeight = baseHeight + variationHeight;
	const tiles = [];
	while (true)
	{
		const emptySpot = getEmptySpot(totalWidth, totalHeight, tiles);
		if (!emptySpot) break;
		const [x, y] = emptySpot;
		//Tile Width
		const varyWidth = Math.random() >= .8 ? minSizeWidth : Math.random() >= .66 ? maxSizeWidth : baseWidth;
		let width = varyWidth;
		let tileEndX = x + width;
		width = tileEndX > totalWidth ? (x + baseWidth <= totalWidth) ? x + baseWidth : (x + minSizeWidth <= totalWidth) ? x + minSizeWidth : width - (tileEndX - totalWidth) : width;		
		let neighbourIndex = 0;
		let lim = 1000;
		o: while (lim-- > 0 && neighbourIndex < tiles.length)
		{
			let neighbour = tiles[neighbourIndex];
			if (isTileHere(tileEndX, y, neighbour))
			{
				width = neighbour.x - 1 - x;
				break o;
			}
			neighbourIndex++;
		}
		//Tile Height
		const varyHeight = Math.random() >= .8 ? minSizeHeight : Math.random() >= .75 ? maxSizeHeight : baseHeight;
		let height = varyHeight;
		let tileEndY = y + height;
		const gap = totalHeight - tileEndY;
		height = (gap > 0 && gap < minSizeHeight) ? gap : height;		
		height -= (tileEndY > totalHeight) ? (tileEndY - totalHeight) : 0;		
		let lastTile = tiles[tiles.length - 1];
		height = (lastTile && y < lastTile.y && tileEndY > lastTile.y) ? lastTile.y - y : height;
		width = (x + width > totalWidth) ? totalWidth - x : width;
		height = (y + height > totalHeight) ? totalHeight - y : height;
		tiles.push({ x, y, width, height });
  }
  return tiles;
}
function isTileHere(x, y, tile)
{
	return x >= tile.x && x <= (tile.x + tile.width) && y >= tile.y && y <= (tile.y + tile.height);
}
function getEmptySpot(width = 1, height = 1, tiles = [])
{
	let x = 0;
	let y = 0;
	if (!tiles.length) return [x, y];
	for(let limit = width * height; limit > 0; limit--)
	{
		let tileIndex = 0;
		let isBlocked = false;
		o: while (tileIndex < tiles.length)
		{
			let tile = tiles[tileIndex];
			if (isTileHere(x, y, tile))
			{
				isBlocked = true;
				break o;
			}
			tileIndex++;
		}
		if (!isBlocked) return [x, y];
		y = x < width ? y : y + 1;		
		x = x < width ? x + 1 : 0;
	}
	return null;
}
function TileBaseColor(ctx, tileOptions, tile)
{
	ctx.fillStyle = tileOptions.base.color;
	ctx.fillRect(tile.x, tile.y, tile.width, tile.height);
}
function TileDarkerShade(ctx, tileOptions, tile)
{
	ctx.beginPath();
	ctx.strokeStyle = tileOptions.darkerShade.color;
	ctx.lineWidth = tileOptions.darkerShade.width;
	ctx.moveTo(tile.x, tile.y);
	ctx.lineTo(tile.x, tile.y + tile.height);
	ctx.lineTo(tile.x + tile.width, tile.y + tile.height);
	ctx.stroke();
}
function TileShade(ctx, tileOptions, tile)
{
	let shadeWidth = tileOptions.shade.width;
	ctx.beginPath();
	ctx.strokeStyle = tileOptions.shade.color;
	ctx.lineWidth = tileOptions.shade.width;
	ctx.moveTo(tile.x + shadeWidth, tile.y);
	ctx.lineTo(tile.x + shadeWidth, tile.y + tile.height - shadeWidth);
	ctx.lineTo(tile.x + tile.width, tile.y + tile.height - shadeWidth);
	ctx.stroke();
}
function TileLighting(ctx, tileOptions, tile)
{
	let shadeWidth = tileOptions.shade.width + tileOptions.tint.width / 2;
	let tintWidth = tileOptions.tint.width / 2;
	ctx.beginPath();
	ctx.strokeStyle = tileOptions.tint.color;
	ctx.lineWidth = tileOptions.tint.width;
	ctx.moveTo(tile.x + shadeWidth, tile.y + tintWidth);
	ctx.lineTo(tile.x + tile.width - tintWidth, tile.y + tintWidth);
	ctx.lineTo(tile.x + tile.width - tintWidth, tile.y + tile.height - shadeWidth);
	ctx.stroke();
}
function ShadeDistort(ctx, tileOptions, tile, horizontal, vertical)
{
	let noiseX = 0;
	let noiseY = 500 + Math.round(Math.random() * 25000);
	let distortionX = tile.x;
	let distortionY = tile.y + tile.height;
	if(horizontal == 1)
	{
		while (distortionX < tile.x + tile.width)
		{
			distortionX += 1;
			distortionY = tile.y + tile.height - tileOptions.shade.width * 2 - noise.simplex2(noiseX += .05, noiseY += .05) * tileOptions.shade.width;
			if (Math.random() >= .5)
			{
				ctx.fillStyle = Math.random() >= .5 ? tileOptions.shade.color : tileOptions.base.color;
				ctx.fillRect(distortionX, distortionY, tileOptions.shade.width / 1.25, tileOptions.shade.width / 1.25);
			}
		}
	}
	if(vertical == 1)
	{
		noise.seed(Math.random());
		noiseX = 0;
		noiseY = 500 + Math.round(Math.random() * 20500);
		distortionX = tile.x;
		distortionY = tile.y;
		while (distortionY < tile.y + tile.height)
		{
			distortionY += 1;
			distortionX = tile.x + tileOptions.shade.width - noise.simplex2(noiseX += .05, noiseY += .05) * tileOptions.shade.width;
			if (Math.random() >= .5)
			{
				ctx.fillStyle = tileOptions.shade.color;
				ctx.fillRect(distortionX, distortionY, tileOptions.shade.width / 1.25, tileOptions.shade.width / 1.25);
			}
		}
	}
}
function DarkShadeDistort(ctx, tileOptions, tile, horizontal, vertical)
{
	let noiseX = 0;
	let noiseY = 500 + Math.round(Math.random() * 25000);
	let distortionX = tile.x;
	let distortionY = tile.y + tile.height;
	if(horizontal == 1)
	{
		while (distortionX < tile.x + tile.width)
		{
			distortionX += tileOptions.darkerShade.width / 1.25;
			distortionY = tile.y + tile.height - tileOptions.darkerShade.width - noise.simplex2(noiseX += .01, noiseY += .01) * tileOptions.darkerShade.width;
			if (Math.random() >= .25)
			{
				if (Math.random() >= .4)
				{
					ctx.fillStyle = tileOptions.darkerShade.color;
					if (Math.random() >= .5)
					{
						ctx.fillRect(distortionX, distortionY, tileOptions.darkerShade.width / 1.5, tile.y + tile.height - distortionY);
					}
				} else
				{
					ctx.fillStyle = tileOptions.shade.color;
				}
				ctx.fillRect(distortionX, distortionY, tileOptions.darkerShade.width / 1.25, tileOptions.darkerShade.width / 1.25);
			}
		}
	}
	if(vertical == 1)
	{
		noiseY = noiseY;
		distortionX = tile.x;
		distortionY = tile.y;
		while (distortionY < tile.y + tile.height)
		{
			distortionY += tileOptions.darkerShade.width / 2;
			distortionX = tile.x + tileOptions.darkerShade.width / 2 - noise.simplex2(noiseX += .05, noiseY += .05) * tileOptions.darkerShade.width / 2;
			if (Math.random() >= .125)
			{
				if (Math.random() >= .5)
				{
					ctx.fillStyle = tileOptions.darkerShade.color;
					ctx.fillRect(tile.x, distortionY, distortionX - tile.x, tileOptions.darkerShade.width);
				} else
				{
					ctx.fillStyle = tileOptions.shade.color;
				}
				ctx.fillRect(distortionX, distortionY, tileOptions.darkerShade.width / 1.25, tileOptions.darkerShade.width / 1.25);
			}
		}
	}
}
function TileTint(ctx, tileOptions, tile, horizontal, vertical)
{
	noise.seed(Math.random());
	var noiseX = 0;
	var noiseY = 500 + Math.round(Math.random() * 25000);
	var distortionX = tile.x;
	var distortionY = tile.y;
	if(horizontal == 1)
	{
		while (distortionX < tile.x + tile.width)
		{
			distortionX += 1;
			distortionY = tile.y + tileOptions.tint.width / 2 - noise.simplex2(noiseX += .05, noiseY += .05) * tileOptions.tint.width;
			if (Math.random() >= .5)
			{
				if (Math.random() >= .5)
				{
					ctx.fillStyle = tileOptions.tint.color;
					ctx.fillRect(distortionX, distortionY, tileOptions.tint.width / 1.5, tileOptions.tint.width / 1.5);
				} else
				{
					ctx.fillStyle = tileOptions.base.color;
					ctx.fillRect(distortionX, distortionY, tileOptions.base.width / 1.75, tileOptions.base.width / 1.75);
				}
			}
		}
	}
	if(vertical == 1)
	{
		noise.seed(Math.random());
		var noiseX = 0;
		var noiseY = 500 + Math.round(Math.random() * 20500);
		var distortionX = tile.x + tile.width;
		var distortionY = tile.y;
		while (distortionY < tile.y + tile.height)
		{
			distortionY += 1;
			distortionX = tile.x + tile.width - tileOptions.tint.width - noise.simplex2(noiseX += .05, noiseY += .05) * tileOptions.tint.width;
			if (Math.random() >= .5)
			{
				ctx.fillStyle = tileOptions.tint.color;
				ctx.fillRect(distortionX, distortionY, tileOptions.tint.width / 1.5, tileOptions.tint.width / 1.5);
			}
		}
	}
}
function TileCrack(ctx, tileOptions, tile)
{
	if (Math.random() >= .75)
	{
		drawCrack
		(
			{
				ctx,
				x: tile.width / 5 + tile.x + Math.random() * (tile.width - tile.width / 5),
				y: Math.random() >= .5 ? tile.y : tile.y + tile.height - 40,
				fillStyle: tileOptions.crack === undefined || tileOptions.crack === null ? '#4c4428' : tileOptions.shade.color,
				crack: generateCrack({ deepness: 2, segments: 4 }),
				segmentLength: 10,
				variation: 5
			}
		);
	}
	if (Math.random() >= .75)
	{
		drawCrack
		(
			{
				ctx,
				x: tile.width / 5 + tile.x + Math.random() * (tile.width - tile.width / 5),
				y: tile.height / 5 + tile.y + Math.random() * (tile.height - tile.height / 5),
				fillStyle: tileOptions.crack === undefined || tileOptions.crack === null ? '#4c4428' : tileOptions.shade.color,
				crack: generateCrack({ deepness: 2, segments: 4 }),
				segmentLength: 5,
				variation: 3 
			}
		);
	}
	if (Math.random() >= .25)
	{
		var i = Math.round(Math.random() * 4);
		while (i-- > 0)
		{
			drawCrack
			(
				{
					ctx,
					x: tile.width / 5 + tile.x + Math.random() * (tile.width - tile.width / 5),
					y: tile.y + Math.random() * tile.height,
					fillStyle: tileOptions.crack === undefined || tileOptions.crack === null ? '#4c4428' : tileOptions.crack.color,
					crack: generateCrack({ deepness: 1, segments: 3 }),
					segmentLength: 1,
					segmentWidth: 3,
					variation: 2
				}
			);
		}
	}
}
function generateCrack(options = {})
{
	function generateChild(segments, children, deepness)
	{
		var crackAt = Math.floor(Math.random() * segments / 2);
		return new Array(segments).join(' ').split(' ').map((segment, index) => {return children + 1 >= deepness ? [] : crackAt !== index ? [] : [generateChild(segments / 2, children + 1, deepness)];});
	}
	var { deepness, segments } = options;
	return generateChild(segments, 0, deepness);
}
function drawCrack(options)
{
	var { crack, ctx, x, y, fillStyle, segmentLength, segmentWidth, variation } = options;
	ctx.strokeStyle = fillStyle;
	ctx.lineWidth = segmentWidth || 2;
	crack.forEach
	(
		segment =>
		{
			var xVariation = (Math.random() >= .5 ? 1 : -1) * (Math.random() * variation);
			ctx.beginPath();
			ctx.moveTo(x, y);
			x += xVariation;
			y += xVariation + segmentLength;
			ctx.lineTo(x, y);
			ctx.stroke();
			if (segment.length)
			{
				drawCrack
				(
					{
						crack: segment,
						ctx, x, y, fillStyle,
						segmentLength: segmentLength / 2,
						variation: variation * 1.6
					}
				);
			}
		}
	);
}
function GenerateTile(objTiles, layoutOptions, tileOptions, BuildTileConfig)
{
	const canvas = document.getElementById('canvas');
	canvas.width = layoutOptions.totalWidth;
	canvas.height = layoutOptions.totalHeight;
	const ctx = canvas.getContext('2d');
	noise.seed(Math.random());
	objTiles.forEach
	(
		(tile, index) =>
		{
			if (BuildTileConfig.base == 1)
				TileBaseColor(ctx, tileOptions, tile);
			if (BuildTileConfig.darkershade == 1)
				TileDarkerShade(ctx, tileOptions, tile);
			if (BuildTileConfig.shade == 1)
				TileShade(ctx, tileOptions, tile);
			if (BuildTileConfig.lighting == 1)
				TileLighting(ctx, tileOptions, tile);
			if (BuildTileConfig.ShadeDistort == 1)
				ShadeDistort(ctx, tileOptions, tile, 1, 1);
			if (BuildTileConfig.DarkerShadeDistort == 1)
				DarkShadeDistort(ctx, tileOptions, tile, 1, 1);
			if (BuildTileConfig.tint == 1)
				TileTint(ctx, tileOptions, tile, 1, 1);
			if (BuildTileConfig.cracks == 1)
				TileCrack(ctx, tileOptions, tile);
		}
	);
}