#!/usr/bin/env python3
"""Static check of vercel.json routing. Runs offline; proves the ruleset is
internally sound. It cannot prove the deploy is live - use verify-redirects.sh
from a machine with network access for that."""
import json, os, re, sys, glob

cfg = json.load(open('vercel.json'))
rules = cfg['redirects']
trailing = cfg.get('trailingSlash')

def to_regex(src):
    # only forms used here: literal paths, and /:path*
    if src == '/:path*':
        return re.compile(r'^/(?P<path>.*)$')
    return re.compile('^' + re.escape(src) + '$')

host_rules = [r for r in rules if 'has' in r]
path_rules = [(to_regex(r['source']), r) for r in rules if 'has' not in r]

def resolve(p):
    for rx, r in path_rules:
        if rx.match(p):
            return r
    return None

real = set()
for f in glob.glob('index.html') + glob.glob('*/index.html') + glob.glob('*/*/index.html'):
    d = os.path.dirname(f)
    real.add('/' + (d + '/' if d else ''))

fail = []
print("=" * 72)
print(f"vercel.json: {len(rules)} rules ({len(host_rules)} host, {len(path_rules)} path), "
      f"trailingSlash={trailing}")
print("=" * 72)

# 1. every path rule resolves to a target that exists, in one hop
print("\n[1] Destination exists, and is reached in ONE hop")
chains = 0
for rx, r in path_rules:
    dst = r['destination']
    tgt = os.path.join(dst.strip('/'), 'index.html') if dst.strip('/') else 'index.html'
    if not os.path.isfile(tgt):
        fail.append(f"{r['source']} -> {dst}: target missing on disk"); continue
    nxt = resolve(dst)
    if nxt:
        chains += 1
        fail.append(f"CHAIN: {r['source']} -> {dst} -> {nxt['destination']}")
    if r['source'] == dst:
        fail.append(f"LOOP: {r['source']} -> itself")
print(f"    {len(path_rules)} rules, {chains} chains, all targets present"
      if not chains else f"    {chains} CHAINS FOUND")

# 2. trailingSlash consistency: destinations must end in / or be a file
print("\n[2] trailingSlash consistency")
bad_slash = [r['source'] for _, r in path_rules
             if not r['destination'].endswith('/') and '.' not in os.path.basename(r['destination'])]
print(f"    destinations not ending in '/': {bad_slash or 'none'}")
fail += [f"{s}: destination lacks trailing slash, will cost an extra hop" for s in bad_slash]

# 3. both slash forms covered for each legacy path
print("\n[3] Both /path and /path/ covered")
srcs = {r['source'] for _, r in path_rules}
missing_pair = []
for s in sorted(srcs):
    if s.endswith('/') or '.' in os.path.basename(s):
        continue
    if s + '/' not in srcs:
        missing_pair.append(s)
print(f"    sources lacking a trailing-slash twin: {missing_pair or 'none'}")
fail += [f"{s}: no trailing-slash variant; trailingSlash normalisation may bypass the rule"
         for s in missing_pair]

# 4. no rule shadows a real page
print("\n[4] No redirect shadows a real page")
shadow = [s for s in srcs if (s if s.endswith('/') else s + '/') in real]
print(f"    shadowed pages: {shadow or 'none'}")
fail += [f"{s}: shadows a real page" for s in shadow]

# 5. every real page survives the ruleset
print("\n[5] All 16 real pages reachable (not caught by a redirect)")
caught = [p for p in sorted(real) if resolve(p)]
print(f"    pages caught by a redirect: {caught or 'none'} ({len(real)} pages checked)")
fail += [f"{p}: real page is intercepted by a redirect" for p in caught]

# 6. host rules
print("\n[6] Host rules (apex and retired domains -> www)")
for r in host_rules:
    h = r['has'][0]['value']
    ok = r['destination'].startswith('https://www.alokskumar.com/') and h != 'www.alokskumar.com'
    print(f"    {h:28s} -> {r['destination']}  {'OK' if ok else 'PROBLEM'}")
    if not ok: fail.append(f"host rule for {h} is wrong")

# 7. the GST 301 specifically
print("\n[7] The GST consolidation 301")
for p in ['/blog/gst-return-filing-guide-delhi', '/blog/gst-return-filing-guide-delhi/']:
    r = resolve(p)
    live = os.path.isdir('blog/gst-return-filing-guide-delhi')
    print(f"    {p:40s} -> {r['destination'] if r else 'NO RULE'} "
          f"[{r['statusCode'] if r else '-'}]")
    if not r: fail.append(f"{p}: no redirect, and the source file is deleted -> hard 404")
print(f"    source directory deleted: {not os.path.isdir('blog/gst-return-filing-guide-delhi')}")

# 8. no catch-all that would swallow real pages
print("\n[8] No catch-all redirect")
ca = [r['source'] for _, r in path_rules if r['source'] in ('/(.*)', '/:path*', '/*')]
print(f"    catch-all path rules: {ca or 'none'} (Vercel serves 404.html natively)")
fail += [f"catch-all {s} would match real pages" for s in ca]

print("\n" + "=" * 72)
if fail:
    print(f"FAILED: {len(fail)} issue(s)")
    for f_ in fail: print("  -", f_)
    sys.exit(1)
print("PASSED: ruleset is internally consistent.")
print("This does NOT prove the deploy is live. Run docs/seo/verify-redirects.sh")
print("from a machine with network access to confirm response codes.")
