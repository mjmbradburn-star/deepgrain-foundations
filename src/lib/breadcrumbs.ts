/**
 * Builds a schema.org BreadcrumbList object for JSON-LD injection.
 * Pass items in order from root → current page. Each item's `url` should be
 * an absolute URL so Google can render breadcrumb rich results correctly.
 */
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export const buildBreadcrumbLd = (items: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: item.url,
  })),
});
