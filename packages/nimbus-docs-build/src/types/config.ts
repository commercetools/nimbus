/**
 * Configuration types for the documentation build system
 */
import type { PropItem } from "react-docgen-typescript";

export interface DocsBuilderConfig {
  /**
   * Source configuration - where to find content
   */
  sources: {
    /** Root directory containing packages to scan for MDX files */
    packagesDir: string;
    /** Path to component index file for type extraction */
    componentIndexPath?: string;
  };

  /**
   * Output configuration - where to write generated files
   */
  output: {
    /** Directory for per-route JSON files */
    routesDir: string;
    /** Path for route manifest JSON file */
    manifestPath: string;
    /** Path for search index JSON file */
    searchIndexPath: string;
    /** Directory for component type JSON files */
    typesDir: string;
    /** Directory for optimized assets (optional) */
    assetsDir?: string;
    /** Path for robots.txt file (optional) */
    robotsPath?: string;
    /** Path for sitemap.xml file (optional) */
    sitemapPath?: string;
  };

  /**
   * Build cache configuration
   */
  cache?: {
    /** Enable incremental builds with caching */
    enabled: boolean;
    /** Custom cache directory (optional, defaults to .cache) */
    cacheDir?: string;
  };

  /**
   * SEO file generation
   */
  seo?: {
    /** Base URL for sitemap generation */
    baseUrl: string;
    /** Generate robots.txt */
    generateRobots?: boolean;
    /** Generate sitemap.xml */
    generateSitemap?: boolean;
  };

  /**
   * Custom prop filtering function
   * Return true to keep the prop, false to filter it out
   */
  propFilter?: (prop: PropItem) => boolean;

  /**
   * Content validation options
   */
  validation?: {
    /** Enable content validation */
    enabled: boolean;
    /** Strict mode - fail on warnings */
    strict?: boolean;
  };

  /**
   * Asset optimization options
   */
  assets?: {
    /** Enable asset optimization */
    enabled: boolean;
    /** Image extensions to process */
    imageExtensions?: string[];
  };
}

export interface BuildResult {
  /** Number of routes generated */
  routeCount: number;
  /** Number of components with types extracted */
  componentCount: number;
  /** Build duration in milliseconds */
  duration: number;
  /** Whether cache was used */
  cacheUsed: boolean;
  /** Number of files rebuilt */
  filesRebuilt: number;
  /** Number of files served from cache */
  filesCached: number;
}

export interface ValidationError {
  file: string;
  message: string;
  severity: "error" | "warning";
}

export interface CacheEntry {
  hash: string;
  timestamp: number;
  outputPath: string;
}

export interface BuildCache {
  version: string;
  files: Map<string, CacheEntry>;
}
