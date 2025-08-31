#!//usr/bin/env bash
#
# Generate checksum of relevant files

# TODO: differentiate ".build-hash" on $NODE_ENV!

# src scripts public base-assets index*.html i18next-parser.config.cjs vite.config.js package.json yarn.lock \
find \
  src \
  -type f -print0 \
| sort -z \
| xargs -0 sha256sum \
> .build-hash

# Check if hash changed
if cmp -s .build-hash .build-hash-last; then
  echo "✅ No changes, skipping build"
  exit 0
else
  echo "🔨 Changes detected, building..."
  yarn build-force
  mv .build-hash .build-hash-last
fi
