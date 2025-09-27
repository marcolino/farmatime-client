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
 
( \
  find \
    package.json index*.html *config* *lock* \
    -maxdepth 1 -type f -print0;
  find \
    . \
    -maxdepth 1 -type f -name ".*" -print0;
  find \
    src scripts base-assets index-template.html i18next-parser.config.cjs vite.config.js package.json yarn.lock \
  public/flags public/videos public/logo-email-header.png \
    -type f -print0;
) \
| sort -u -z \
| xargs -0 sha256sum \
> "$build_file_name"

# Check if hash changed
if cmp -s "$build_file_name" "$build_file_name.last"; then
  echo "✅ No changes on client in $NODE_ENV mode, skipping build"
  exit 0
else
  #echo "🔨 Changes detected on client in $NODE_ENV mode, building..."
  echo "🔨 Changes detected on client in $NODE_ENV mode"
  #echo "differences:"; diff --brief "$build_file_name" "$build_file_name.last"s
  #echo "differences:"; comm -3 <(sort $build_file_name) <(sort $build_file_name.last) | cut -f 2 -d ' ' 
  grep -Fvx -f "$build_file_name" "$build_file_name.last" | tr -s ' ' | cut -d ' ' -f 2; echo
  echo "Building client..."
  yarn build-force
  exitval=$?
  mv "$build_file_name" "$build_file_name.last"
  exit $exitval
fi
