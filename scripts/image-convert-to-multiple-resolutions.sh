#!/usr/bin/env bash
#
# Convert images to multiple resolutions for responsive picture
#
# Example of usage in HTML (or JSX)
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


# Minimum acceptable dimensions for smallest output size
MIN_WIDTH=640
MIN_HEIGHT=480

# Calculate scaling factors for different sizes
SMALL_FACTOR=1
MEDIUM_FACTOR=2
LARGE_FACTOR=3

# Get input image
original="${1}"

# Input validation
if [ -z "$original" ]; then
  echo "Error: No input image specified"
  exit 1
fi

if [ ! -f "$original" ]; then
  echo "Error: Input image '$original' not found"
  exit 2
fi

# Get original dimensions
width=$(identify -format '%w' "$original")
height=$(identify -format '%h' "$original")

# Validate minimum dimensions
if [ $width -lt $MIN_WIDTH ] || [ $height -lt $MIN_HEIGHT ]; then
  echo "Warning: Source image ($width×$height) is smaller than recommended minimum (${MIN_WIDTH}×${MIN_HEIGHT})"
  read -p "Continue anyway? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Nn]$ ]]; then
    exit 3
  fi
fi

# Calculate target dimensions
small_width=$(($width * $SMALL_FACTOR))
small_height=$(($height * $SMALL_FACTOR))

medium_width=$(($width * $MEDIUM_FACTOR))
medium_height=$(($height * $MEDIUM_FACTOR))

large_width=$(($width * $LARGE_FACTOR))
large_height=$(($height * $LARGE_FACTOR))

# Get base filename
original_no_ext=${original%.*}

# Generate images
echo "Generating responsive images:"
echo " - Small size: ${small_width}×${small_height}"
convert "$original" -resize "${small_width}x${small_height}" "${original_no_ext}-small.jpg"
cwebp -quiet -q 80 -resize "${small_width}" "${small_height}" "$original" -o "${original_no_ext}-small.webp"

echo " - Medium size: ${medium_width}×${medium_height}"
convert "$original" -resize "${medium_width}x${medium_height}" "${original_no_ext}-medium.jpg"
cwebp -quiet -q 80 -resize "${medium_width}" "${medium_height}" "$original" -o "${original_no_ext}-medium.webp"

echo " - Large size: ${large_width}×${large_height}"
convert "$original" -resize "${large_width}x${large_height}" "${original_no_ext}-large.jpg"
cwebp -quiet -q 80 -resize "${large_width}" "${large_height}" "$original" -o "${original_no_ext}-large.webp"

echo "Done."
exit 0