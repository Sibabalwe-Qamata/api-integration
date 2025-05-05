export class InMemoryCache<T> {
    private cache: T | null = null;

    set(data: T) {
        this.cache = data;
    }

    get(): T | null {
        return this.cache;
    }

    clear() {
        this.cache = null;
    }
}
