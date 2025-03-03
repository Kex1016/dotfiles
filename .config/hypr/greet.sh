#!/bin/sh

# A list of greetings to choose from
GREETINGS=(
  "welcome, god's silliest lock screen"
  "more blur. MORE BLUR!"
  "how do i exit this screen"
  "erm."
  "just make sure to never look under the hood"
  "stop locking your screen"
)

# Choose a random greeting
GREETING=${GREETINGS[$RANDOM % ${#GREETINGS[@]}]}
echo $GREETING