#!/bin/zsh
# Build every presentation and assemble the shared site in _site/: the home page at /, each presentation
# folder (any folder with a package.json) at /<folder>/. Deploy with: fly deploy --ha=false --remote-only
# Each presentation's video must already be rendered (npm run render && npm run still in its folder).
set -eu
cd "${0:A:h}"
rm -rf _site && mkdir -p _site
cp home/index.html _site/
for dir in */package.json(N:h); do
  [[ $dir == home ]] && continue
  echo "== $dir"
  (cd "$dir" && { [[ -d node_modules ]] || npm ci; } && npm run build --silent)
  cp -R "$dir/dist" "_site/$dir"
  grep -q "href=\"$dir/\"" home/index.html || echo "WARN: home/index.html has no card for $dir/"
  grep -q "\"$dir\":" share.json || echo "WARN: share.json has no link-preview texts for $dir"
done
python3 share_meta.py  # link previews per language: index.html (en) and index.es.html (es) in every page
echo "site: $(du -sh _site | cut -f1) in _site/"
