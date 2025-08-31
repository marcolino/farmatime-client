# Generate checksum of relevant files
find src scripts public base-assets vite.config.js package.json -type f -print0 | sort -z | xargs -0 sha256sum > .build-hash

# Check if hash changed
if cmp -s .build-hash .build-hash-last; then
  echo "✅ No changes, skipping build"
  exit 0
else
  echo "🔨 Changes detected, building..."
  yarn build
  mv .build-hash .build-hash-last
fi
