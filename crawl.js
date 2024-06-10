"use strict"

import { JSDOM } from "jsdom";

function normalizeURL(urlString) {
  const urlObj = new URL(urlString);
  const hostname = urlObj.hostname;
  const pathname = urlObj.pathname;
  const normalizedUrl = `${hostname}${pathname.replace(/\/$/, "")}`;

  return normalizedUrl;
}

function getURLsFromHTML(htmlBody, baseURL) {
  const dom = new JSDOM(htmlBody);
  const anchorElements = dom.window.document.querySelectorAll("a");
  const urls = []

  anchorElements.forEach((anchor) => {
    if (anchor.hasAttribute("href")) {
      const href = anchor.getAttribute("href");
      try {
        const url = new URL(href, baseURL);
        urls.push(url.href);
      } catch(err) {
        console.log(`Error getURLsFromHTML: ${err.message} - ${href}`);
      }
    }
  });

  return urls;
}

async function crawlPage(rootURL, currentURL=rootURL, pages={}) {
  const rootURLDomain = getURLDomain(rootURL);
  const currentURLDomain = getURLDomain(currentURL);
  if (rootURLDomain !== currentURLDomain) {
    return pages;
  }

  const currentURLNormalized = normalizeURL(currentURL);
  if (currentURLNormalized in pages) {
    pages[currentURLNormalized]++;
    return pages;
  }
  pages[currentURLNormalized] = 1;

  const html = await fetchPageHTML(currentURL);
  if (html !== null) {
    console.log(`Crawling ${currentURL}`);
    const urls = getURLsFromHTML(html, currentURL);
    for (const url of urls) {
      await crawlPage(rootURL, url, pages); 
    }
  }

  return pages;
}

async function fetchPageHTML(rootURL) {
  let response = null;
  try {
    response = await fetch(rootURL);
  } catch(err) {
    console.log(`Error fetchPageHTML: ${err.message} - ${rootURL}`);
    return null
  }
  
  if (response.status >= 400) {
    console.log(`Failed to fetch ${rootURL}`);
    return null
  } 

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("text/html")) {
    console.log(`Content is not HMTL: ${rootURL} - ${contentType}`);
    return null
  }

  return await response.text();
}

function getURLDomain(url) {
  if (!url) {
    return null
  }

  const urlObj = new URL(url);
  const hostname = urlObj.hostname;
  const parts = hostname.split(".");
  const domain = parts.slice(parts.length-2).join(".");

  return domain;
}

export { normalizeURL, getURLsFromHTML, crawlPage };
