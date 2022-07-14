#!/usr/bin/env bash

function show_usage {
cat <<EOF
   ffpmegYTshorts:
    -s      split videos to segments
    -c      create cropped shorts 
    -l      create landscape shorts
    -p      create potrait shorts
    -b      create blurred shorts
    -h      Help - Show this menu.
    ffpmegYTshorts.sh -s <<segment_size>> -[clp] <<filename>>
    can only pick one option from c, l, or p
EOF
}

# parse options
splitVideos=0
createCroppedShorts=0
createLandscapeShorts=0
createBlurredShorts=0
createPortraitShorts=0
while getopts ":s:c:l:p:b:h:" OPTION; do
#    echo "option " $OPTION
    case $OPTION in
        b)  
            createBlurredShorts=1
            ;;
        c)
            createCroppedShorts=1
            ;;
        h)
            show_usage
            exit 0
            ;;
        l)
            createLandscapeShorts=1
            ;;
        p)
            createPortraitShorts=1
            ;;

        s)
            splitVideos=1
            ;;

        *)
            show_usage
            exit 1
            ;;
    esac
done

summed_options=0
summed_options=$((splitVideos + createCroppedShorts + createLandscapeShorts + createPortraitShorts +  createBlurredShorts))
# echo "summed options " $splitVideos $createCroppedShorts $createLandscapeShorts $createPortraitShorts $createBlurredShorts $summed_options

if (( summed_options > 2  )); then 
    echo "can only use one of cropped, blurred, potrait or landscape"
    show_usage
    exit -1
fi 

if  (( summed_options == 0)); then
    echo "number of options is zero" 
    show_usage
    exit -1 
fi 


video_filename=$4
segment_size=$2
#echo $video_filename $segment_size

hashVal=$( head -c5 < /dev/random | base64 | sed "s/[^[:alnum:]-]//g")

#echo $video_filename $segment_size
ffmpeg -i $video_filename -c copy -map 0 -segment_time $segment_size -f segment $hashVal%03d.mp4

files=($(ls $hashVal*)) # create an array from ls 
#echo "MY ARRAY is ${files[*]}" 

for i in "${files[@]}"
do

   if (( createCroppedShorts == 1)); then 
        ffmpeg -i $i -vf "crop=405:720" crop_short_$i
    fi 

    if (( createLandscapeShorts == 1)); then
        # https://stackoverflow.com/questions/61703587/proper-way-to-letterbox-with-ffmpeg
        ffmpeg -i $i -vf "scale=720x1280:force_original_aspect_ratio=decrease,pad=iw:2*trunc(ih*16/9):(ow-iw)/2:(oh-ih)/2" pad_short_$i
    fi
    
    if (( createBlurredShorts ==1 )); then 
        ffmpeg -i $i -vf 'split[original][copy];[copy]scale=-1:ih*(16/9)*(16/9),crop=w=ih*9/16,gblur=sigma=20[blurred];[blurred][original]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2' blurr_short_$i
    fi

    if (( createPortraitShorts == 1)); then
        ffmpeg -i $i -vf "transpose=1"  tranposed_$i
    fi 
done