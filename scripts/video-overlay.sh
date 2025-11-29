ffmpeg -y -i input.mp4 -filter_complex "\
color=c=#b3c6d6:s=36x21:r=55:d=1.6[box1];\
color=c=#e4eef5:s=52x38:r=25:d=1.6[box2];\
color=c=#e3eff8:s=30x20:r=25:d=1.6[box3];\
color=c=#1d0905:s=100x70:r=25:d=1.6[box4];\
[0][box1]overlay=500:1138[v1];\
[v1][box2]overlay=500:1160[v2];\
[v2][box3]overlay=536:1148[v3];\
[v3][box4]overlay=569:1130" \
-c:a copy output1.mp4

ffmpeg -y -i output1.mp4 -vf "crop=720:1200:0:0" -c:a copy output2.mp4

ffplay output2.mp4


