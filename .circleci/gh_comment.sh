#!/bin/bash
comment=$1
# if $GH_COMMENT_URL is not set, then exit
if [ -z "$GH_COMMENT_URL" ]; then
  echo "GH_COMMENT_URL is not set"
  exit 1
fi

curl --location --request POST "$GH_COMMENT_URL" -u $GH_USER:$GH_TOKEN --header 'Content-Type: application/json' --data-raw '{"body": "'"$comment"'"}' -s
