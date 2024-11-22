#!/usr/bin/env bash
# 
# Script to create a favicon images from specified source png image.
# Source png image size should be at least 512x512 pixels.
# Imagemagick (http://www.imagemagick.org) is required.

sourceImage="${1:-Logo.png}"
minSize=512
favicon="public/favicon.ico"
favicon16x16="public/favicon-16x16.png"
favicon32x32="public/favicon-32x32.png"
favicon64x64="public/favicon-64x64.png"
appleTouchIcon="public/apple-touch-icon.png"
logoMain="src/assets/images/LogoMain.png"
msTileImage="public/ms-tile.png"

if [ ! -f "$sourceImage" ]; then
  echo "Source image \"$sourceImage\" not found"
  exit 1;
fi
if ! command -v identify &> /dev/null; then
  echo "Command \"identify\" should be installed to check image size"
  exit 2;
fi
if ! command -v convert &> /dev/null; then
  echo "Command \"identify\" must be installed to convert image"
  exit 3;
fi
width=`identify -format '%w' "$sourceImage"`
height=`identify -format '%h' "$sourceImage"`
if [ $width -lt $minSize ]; then
  echo "Source image \"$sourceImage\" should be at least \$minSize pixels wide"
  exit 4;
fi
if [ $height -lt $minSize ]; then
  echo "Source image \"$sourceImage\" should be at least \$minSize pixels high"
  exit 5;
fi

convert "$sourceImage" -resize 16x16 "$favicon16x16"
convert "$sourceImage" -resize 32x32 "$favicon32x32"
convert "$sourceImage" -resize 64x64 "$favicon64x64"
convert "$sourceImage" -resize 512x512 "$appleTouchIcon"
convert "$favicon64x64" -define icon:auto-resize=64,48,32,16 "$favicon"
convert "$sourceImage" -resize 144x144 "$msTileImage"
cp "$sourceImage" "$logoMain"

exit 0
