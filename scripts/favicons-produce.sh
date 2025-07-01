#!/usr/bin/env bash
# 
# Script to create a favicon images from specified source png image.
# Source png image size should be at least 512x512 pixels.
# Imagemagick (http://www.imagemagick.org) is required.

sourceImage="${1:-Logo.png}"
minSize=512
publicFavicon="public/favicon.ico"
publicFavicon16x16="public/favicon-16x16.png"
publicFavicon32x32="public/favicon-32x32.png"
publicFavicon64x64="public/favicon-64x64.png"
publicAppleTouchIcon="public/apple-touch-icon.png"
publicMsTileImage="public/ms-tile.png"
publicLogoMailHeader="public/logo-main-header.png"
#srcLogoMain="src/assets/images/LogoMain.png"
srcLogoMain="base-assets/LogoMain.png"

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
  echo "Source image \"$sourceImage\" should be at least $minSize pixels wide"
  exit 4;
fi
if [ $height -lt $minSize ]; then
  echo "Source image \"$sourceImage\" should be at least $minSize pixels high"
  exit 5;
fi

convert "$sourceImage" -resize 16x16 "$publicFavicon16x16"
convert "$sourceImage" -resize 32x32 "$publicFavicon32x32"
convert "$sourceImage" -resize 64x64 "$publicFavicon64x64"
convert "$sourceImage" -resize 512x512 "$publicAppleTouchIcon"
convert "$publicFavicon64x64" -define icon:auto-resize=64,48,32,16 "$publicFavicon"
convert "$sourceImage" -resize 144x144 "$publicMsTileImage"
cp "$sourceImage" "$publicLogoMailHeader"
cp "$sourceImage" "$srcLogoMain"

exit 0
