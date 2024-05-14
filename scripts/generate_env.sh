#!/bin/sh

# Generate the .env.local file
cat <<EOF > .env.local
REACT_APP_GATEWAY_SERVER_URL=$REACT_APP_GATEWAY_SERVER_URL
EOF
