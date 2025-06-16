#!/usr/bin/env bash
#
# Convert images to multiple resolutions for responsive picture
#
# Usage in HTML:
#
# <picture>
#   <source media="(min-width: 1200px)"
#     srcset="large-image.jpg 1920w, large-image-2x.jpg 3840w"
#     sizes="(min-width: 1200px) 1920px, (max-width: 1199px) 1280px, (max-width: 767px) 640px"
#   >
#   <source media="(min-width: 768px)"
#     srcset="medium-image.jpg 1280w, medium-image-2x.jpg 2560w"
#     sizes="(max-width: 1199px) 1280px, (max-width: 767px) 640px"
#   >
#   <source media="(max-width: 767px)"
#     srcset="small-image.jpg 640w, small-image-2x.jpg 1280w"
#     sizes="100vw"
#   >
#   <img src="small-image.jpg"
#     alt="Description"
#     width="640"
#     height="480"
#   >
# </picture>

original="{$1}"
minWidth=1920
minHeight=1440

if [ -z "$original"]; then
  echo "Please specify an original image name"
  exit 1
fi

if [ ! -f "$original"]; then
  echo "Please specify an existing original image name"
  exit 1
fi

width=`identify -format '%w' "$original"`
height=`identify -format '%h' "$original"`
if [ $width -lt $minWidth ]; then
  echo "Source image \"$original\" should be at least $minWidth pixels wide"
  exit 2;
fi
if [ $height -lt $minHeight ]; then
  echo "Source image \"$original\" should be at least $minHeight pixels high"
  exit 3;
fi

original_no_ext=`echo "$original" | sed "s/\..*$//"`

# JPEG images
convert "$original" -resize 640x480 "${original_no_ext}-small.jpg"
convert "$original" -resize 1280x960 "${original_no_ext}-medium.jpg"
convert "$original" -resize 1920x1440 "${original_no_ext}-large.jpg"

# WebP format (with resizing)
cwebp -q 80 -resize 640 480   "$original" -o "${original_no_ext}-small.webp"
cwebp -q 80 -resize 1280 960  "$original" -o "${original_no_ext}-medium.webp"
cwebp -q 80 -resize 1920 1440 "$original" -o "${original_no_ext}-large.webp"

exit 0