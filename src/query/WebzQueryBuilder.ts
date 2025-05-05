export class WebzQueryBuilder {
    private queryParts: Record<string, string> = {};
  
    withSearchTerm(term: string): this {
      this.queryParts['q'] = term;
      return this;
    }
  
    withLanguage(language: string): this {
      this.queryParts['language'] = language;
      return this;
    }
  
    withSiteType(siteType: string): this {
      this.queryParts['site_type'] = siteType;
      return this;
    }
  
    withDomain(domain: string): this {
      this.queryParts['site'] = domain;
      return this;
    }
  
    withCategory(category: string): this {
      this.queryParts['category'] = category;
      return this;
    }
  
    withPublishedAfter(date: string): this {
      this.queryParts['published'] = `>${date}`;
      return this;
    }
  
    withExactPhrase(phrase: string): this {
      this.queryParts['exact_phrase'] = `"${phrase}"`;
      return this;
    }
  
    getQueryParts(): Record<string, string> {
      return { ...this.queryParts };
    }
  
    build(): string {
      return Object.entries(this.queryParts)
        .map(([key, value]) => {
          if (key === 'q' || key === 'exact_phrase') return value;
          return `${key}:${value}`;
        })
        .join(' ');
    }
  }
  