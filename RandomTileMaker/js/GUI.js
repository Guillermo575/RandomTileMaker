var posX = 0;
var posY = 0;
var tiles = null;
CreateTile_Click();
CreateTileMap_Click();
function getLayoutConfig()
{
	const width = parseInt(document.getElementById('width').value);
	const height = parseInt(document.getElementById('height').value);
	const TileWidth = parseInt(document.getElementById('TileWidth').value);
	const TileWidthFactor = parseFloat(document.getElementById('TileWidthFactor').value);
	const TileHeight = parseInt(document.getElementById('TileHeight').value);
	const TileHeightFactor = parseFloat(document.getElementById('TileHeightFactor').value);
	const layoutConfig = LayoutOptionConfig(width, height, TileWidth, TileWidthFactor, TileHeight, TileHeightFactor);
	return layoutConfig;
}
function getColorConfig()
{
	const ColorBase = document.getElementById('ColorBase').value;
	const ColorShade = document.getElementById('ColorShade').value;
	const WidthShade = parseInt(document.getElementById('WidthShade').value);
	const ColorDarkerShade = document.getElementById('ColorDarkerShade').value;
	const WidthDarkerShade = parseInt(document.getElementById('WidthDarkerShade').value);
	const ColorTint = document.getElementById('ColorTint').value;
	const WidthTint = parseInt(document.getElementById('WidthTint').value);
	const ColorCrack = document.getElementById('ColorCrack').value;
	const ColorConfig = TileColorConfig(ColorBase, ColorShade, WidthShade, ColorDarkerShade, WidthDarkerShade, ColorTint, WidthTint, ColorCrack);
	return ColorConfig;
}
function getBuildConfig()
{
	const BuildBase = document.getElementById('BuildBase').checked ? 1 : 0;
	const BuildShade = document.getElementById('BuildShade').checked ? 1 : 0;
	const BuildDarkerShade = document.getElementById('BuildDarkerShade').checked ? 1 : 0;
	const BuildLighting = document.getElementById('BuildLighting').checked ? 1 : 0;
	const BuildShadeDistort = document.getElementById('BuildShadeDistort').checked ? 1 : 0;
	const BuildDarkerShadeDistort = document.getElementById('BuildDarkerShadeDistort').checked ? 1 : 0;
	const BuildTint = document.getElementById('BuildTint').checked ? 1 : 0;
	const BuildCracks = document.getElementById('BuildCracks').checked ? 1 : 0;
	const BuildConfig = BuildTileConfig(BuildBase, BuildShade, BuildDarkerShade, BuildLighting, BuildShadeDistort, BuildDarkerShadeDistort, BuildTint, BuildCracks);
	return BuildConfig;
}
function CreateTile_Click()
{
	tiles = getLayout(getLayoutConfig());
	GenerateTile(tiles, getLayoutConfig(), getColorConfig(), getBuildConfig());
}
function ReloadTile_Click()
{
	GenerateTile(tiles, getLayoutConfig(), getColorConfig(), getBuildConfig());
}
function AddTile_Click()
{
	const tmap = document.getElementById("TileMap");
	const ctx = tmap.getContext("2d");
	const img = document.getElementById("canvas");
	ctx.drawImage(img, posX, posY);
	posX += img.width;
	if (posX >= tmap.width)
	{
		posX = 0;
		posY += img.height;
	}
}
function CreateTileMap_Click()
{
	posX = 0;
	posY = 0;
	const TileMapWidth = parseInt(document.getElementById('TileMapWidth').value);
	const TileMapHeight = parseInt(document.getElementById('TileMapHeight').value);
	const canvas = document.getElementById('TileMap');
	canvas.width = TileMapWidth;
	canvas.height = TileMapHeight;
}
function LayoutOptionConfig(width, height, TileWidth, TileWidthFactor, TileHeight, TileHeightFactor)
{
	let layoutOptions =
	{
		totalWidth: width,
		totalHeight: height,
		TileWidth: TileWidth,
		TileWidthFactor: TileWidthFactor > 1 ? 1 : TileWidthFactor,
		TileHeight: TileHeight,
		TileHeightFactor: TileHeightFactor > 1 ? 1 : TileHeightFactor
	};
	return layoutOptions;
}
function TileColorConfig(baseColor, shadeColor, shadeWidth, darkerShadeColor, darkerShadeWidth, tintColor, tintWidth, crackColor)
{
	let tileOptions =
	{
		base: { color: baseColor },
		shade: { color: shadeColor, width: shadeWidth },
		darkerShade: { color: darkerShadeColor, width: darkerShadeWidth },
		tint: { color: tintColor, width: tintWidth },
		crack: { color: crackColor } 
	};
	return tileOptions;
}
function DefaultTileColorConfig()
{
	let tileOptions = 
	{
		base: { color: '#575935' },
		shade: { color: '#484024', width: 5 },
		darkerShade: { color: '#2F2419', width: 3 },
		tint: { color: '#70744C', width: 5 },
		crack:{ color: '#4c4428'}
	}
	return tileOptions;
}
function BuildTileConfig(base, shade, darkershade, lighting, ShadeDistort, DarkerShadeDistort, tint, cracks)
{
	let BuildTileConfig =
	{
		base: base,
		shade: shade,
		darkershade: darkershade,
		lighting: lighting,
		ShadeDistort: ShadeDistort,
		DarkerShadeDistort: DarkerShadeDistort,
		tint: tint,
		cracks: cracks // 1 = yes
	};
	return BuildTileConfig;
}