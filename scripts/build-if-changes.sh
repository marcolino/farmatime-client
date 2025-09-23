#!/usr/bin/env bash
#
# Generate checksum of relevant files

case "$NODE_ENV" in
  "production")
    build_file_name="dev/build-hash/production"
    ;;
  "staging")
    build_file_name="dev/build-hash/staging"
    ;;
  *)
    # The asterisk (*) is a wildcard that catches any other value
    build_file_name="dev/build-hash/development"
    ;;
esac
 
find \
  src scripts base-assets index-template.html i18next-parser.config.cjs vite.config.js package.json yarn.lock \
  public/flags public/videos public/logo-email-header.png \
  -type f -print0 \
| sort -z \
| xargs -0 sha256sum \
> "$build_file_name"

# Check if hash changed
if cmp -s "$build_file_name" "$build_file_name.last"; then
  echo "✅ No changes in $NODE_ENV mode, skipping build"
  exit 0
else
  echo "🔨 Changes detected in $NODE_ENV mode, building..."
  yarn build-force
  exitval=$?
  mv "$build_file_name" "$build_file_name.last"
  exit $exitval
fi
