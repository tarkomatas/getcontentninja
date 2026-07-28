<?xml version="1.0" encoding="UTF-8"?>
<!--
  Ember által olvasható nézet a public/sitemap.xml-hez.
  Tisztán kozmetikai: a keresőrobotok a stíluslapot figyelmen kívül hagyják,
  a sitemap tartalma (a <loc> és <xhtml:link> elemek) számít csak.
-->
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  exclude-result-prefixes="s xhtml">

  <xsl:output method="html" encoding="UTF-8" indent="yes" />

  <xsl:template match="/">
    <html lang="hu">
      <head>
        <meta charset="utf-8" />
        <title>Sitemap – Content Ninja</title>
        <meta name="robots" content="noindex" />
        <style>
          :root { --primary:#6c5ce7; --dark:#1e1e2f; --body:#4a4a68; --line:#e8e8f0; }
          * { box-sizing:border-box; }
          body { margin:0; padding:2.5rem 1.5rem; background:#f7f7fb; color:var(--body);
                 font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif; font-size:15px; }
          .wrap { max-width:1080px; margin:0 auto; }
          h1 { color:var(--dark); font-size:1.6rem; margin:0 0 .35rem; letter-spacing:-.02em; }
          .sub { margin:0 0 1.75rem; font-size:.95rem; }
          .count { display:inline-block; background:var(--primary); color:#fff; font-weight:600;
                   border-radius:999px; padding:.15rem .7rem; font-size:.85rem; }
          .card { background:#fff; border:1px solid var(--line); border-radius:14px; overflow:hidden;
                  box-shadow:0 4px 16px rgba(30,30,47,.05); }
          .scroll { overflow-x:auto; }
          table { border-collapse:collapse; width:100%; min-width:640px; }
          th { text-align:left; font-size:.72rem; text-transform:uppercase; letter-spacing:.06em;
               color:#8a8aa3; font-weight:600; padding:.9rem 1rem; border-bottom:1px solid var(--line);
               background:#fbfbfe; white-space:nowrap; }
          td { padding:.75rem 1rem; border-bottom:1px solid #f2f2f7; vertical-align:middle; }
          tr:last-child td { border-bottom:0; }
          tr:hover td { background:#fbfaff; }
          a { color:var(--primary); text-decoration:none; word-break:break-all; }
          a:hover { text-decoration:underline; }
          .lang { display:inline-block; border:1px solid var(--line); border-radius:6px;
                  padding:.05rem .4rem; margin-right:.25rem; font-size:.72rem; color:#6b6b85;
                  text-transform:uppercase; letter-spacing:.03em; }
          .num { font-variant-numeric:tabular-nums; color:var(--dark); font-weight:600; }
          .muted { color:#8a8aa3; }
          footer { margin-top:1.25rem; font-size:.8rem; color:#8a8aa3; }
          @media (max-width:640px) { body { padding:1.5rem .75rem; } h1 { font-size:1.3rem; } }
        </style>
      </head>
      <body>
        <div class="wrap">
          <h1>Content Ninja – webhelytérkép</h1>
          <p class="sub">
            <span class="count"><xsl:value-of select="count(s:urlset/s:url)" /> URL</span>
            <xsl:text> </xsl:text>
            Ez a fájl a keresőknek szól; a stíluslap csak az olvashatóság miatt van.
          </p>
          <div class="card">
            <div class="scroll">
              <table>
                <tr>
                  <th>URL</th>
                  <th>Nyelvi változatok</th>
                  <th>Frissítés</th>
                  <th>Prioritás</th>
                </tr>
                <xsl:for-each select="s:urlset/s:url">
                  <tr>
                    <td>
                      <a href="{s:loc}"><xsl:value-of select="s:loc" /></a>
                    </td>
                    <td>
                      <xsl:choose>
                        <xsl:when test="xhtml:link">
                          <xsl:for-each select="xhtml:link">
                            <span class="lang"><xsl:value-of select="@hreflang" /></span>
                          </xsl:for-each>
                        </xsl:when>
                        <xsl:otherwise><span class="muted">–</span></xsl:otherwise>
                      </xsl:choose>
                    </td>
                    <td class="muted"><xsl:value-of select="s:changefreq" /></td>
                    <td class="num"><xsl:value-of select="s:priority" /></td>
                  </tr>
                </xsl:for-each>
              </table>
            </div>
          </div>
          <footer>getcontentninja.com/sitemap.xml</footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
