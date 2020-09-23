#!/bin/bash

START_MONTH=9
END_MONTH=9
START_DAY=1
END_DAY=22
YEAR=2020

for (( month=$START_MONTH; month<=$END_MONTH; month++ ))
do  
   echo "Month -> $month"

	for (( day=$START_DAY; day<=$END_DAY; day++ ))
	do  
	   echo "Day -> $day"

		node api/lib/archive.js 2020 $month $day
		npx @11ty/eleventy

	done

done
