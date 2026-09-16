#!/usr/bin/env bash
# Verify the Vercel redirect config after deploying. Run from any machine with network access.
# Expected column shows what a correct deploy returns.
B=https://www.alokskumar.com
chk () { printf '%-52s ' "$1"; curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}\n' -I "$1"; }

echo "--- legacy paths: expect 301 -> the service page ---"
chk $B/gst
chk $B/about-us
chk $B/trust-registration
chk $B/resources

echo
echo "--- merged GST guide: expect 301 -> /services/gst/ ---"
chk $B/blog/gst-return-filing-guide-delhi
chk $B/blog/gst-return-filing-guide-delhi/

echo
echo "--- apex and retired domains: expect 301 -> www ---"
chk https://alokskumar.com/
chk https://alokskumarandco.com/

echo
echo "--- trailing slash: expect 308 -> /about/ then 200 ---"
chk $B/about
chk $B/about/

echo
echo "--- new locality pages: expect 200 ---"
chk $B/ca-in-rohini/
chk $B/ca-in-chandni-chowk/

echo
echo "--- headers on a page and on an asset ---"
curl -sI $B/services/gst/ | grep -i 'cache-control\|x-frame\|referrer-policy\|x-content-type\|permissions-policy'
curl -sI $B/assets/css/styles.css | grep -i 'cache-control'
