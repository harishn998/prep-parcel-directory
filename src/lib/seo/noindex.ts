/**
 * Site-wide noindex toggle.
 * Controlled by NEXT_PUBLIC_SITE_NOINDEX env var.
 *
 * When 'true', the entire site is hidden from search engines via:
 * - <meta name="robots" content="noindex, nofollow"> on every page
 * - X-Robots-Tag header on every response
 * - robots.txt blanket disallow
 *
 * Defaults to false in production, allowing normal indexing.
 */
export function isSiteNoindex(): boolean {
  return process.env.NEXT_PUBLIC_SITE_NOINDEX === "true";
}

/**
 * Returns the robots metadata object for Next.js metadata API.
 * Use in page-level metadata exports.
 */
export function getRobotsMetadata() {
  if (isSiteNoindex()) {
    return {
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    };
  }

  return {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  };
}
