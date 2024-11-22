#!/usr/bin/env bash
#
# Update sitemap to main search engines

sitemapUrl="https://acme-server-lingering-brook-4120.fly.dev/sitemap.xml"
googleSuccess="Your Sitemap has been successfully added to our list of Sitemaps to crawl."
bingSuccess="Grazie per avere inviato la sitemap."

out="/tmp/`basename $0`-$$.txt"
error=0

# Google
wget -q -O- "http://www.google.com/ping?sitemap=$sitemapUrl" #&> $out
if ! grep -q "$googleSuccess" "$out"; then
  echo "error updating Google for sitemap"
  error=1
fi

# Bing
wget -q -O- "http://www.bing.com/ping?sitemap=$sitemapUrl" #&> $out
if ! grep -q "$bingSuccess" "$out"; then
  echo "error updating Bing for sitemap"
  error=2
fi

rm -rf "$out"

exit $error