export interface BreadcrumbItem {
  label: string;
  /** Absent for a group without a page of its own. */
  href?: string;
}
