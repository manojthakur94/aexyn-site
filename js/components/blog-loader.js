/**
 * Blog Loader Component
 * Handles loading and displaying blog posts with filtering and pagination
 */
class BlogLoader {
    constructor(config = {}) {
        this.jsonPath = config.jsonPath || 'js/blogs.json';
        this.postsPerPage = config.postsPerPage || 9;
        this.basePath = config.basePath || '';
        this.allPosts = [];
        this.filteredPosts = [];
        this.currentTag = null;
        this.currentPage = 1;
        
        this.selectors = {
            blogList: '#blog-list',
            pagination: '#pagination',
            tagFilter: '.tag-filter',
            loader: '#blog-loader',
            ...config.selectors
        };
        
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.loadBlogs());
        } else {
            this.loadBlogs();
        }
    }

    showLoader() {
        const loader = document.querySelector(this.selectors.loader);
        if (loader) loader.style.display = '';
    }

    hideLoader() {
        const loader = document.querySelector(this.selectors.loader);
        if (loader) loader.style.display = 'none';
    }

    async loadBlogs() {
        this.showLoader();
        try {
            const response = await fetch(this.jsonPath);
            const posts = await response.json();
            
            posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            this.allPosts = posts;
            this.filteredPosts = posts.slice();
            
            this.renderPosts(this.filteredPosts, this.currentPage);
            this.renderPagination(this.filteredPosts, this.currentPage);
            this.renderTags(this.allPosts);
            this.bindEvents();
            this.checkUrlParams();
            
        } catch (error) {
            this.hideLoader();
            this.showError('Failed to load posts.');
            console.error('Blog loader error:', error);
        }
    }

    createPostCard(post) {
        const formatted = new Date(post.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        const tagsHTML = post.tags.map(tag => 
            `<span class="tag-link" data-tag="${encodeURIComponent(tag)}">${tag}</span><span class="tag-separator">,</span>`
        ).join(' ');
        
        return `
            <article class="custom-col-4 blogItem">
                <div class="blog-card">
                    <div class="blog-thumb">
                        <a href="${post.url}">
                            <img src="${this.basePath}${post.featured_image}" alt="${post.title}">
                        </a>
                    </div>
                    <div class="blog-content">
                        <div class="blog-byline">
                            <div class="tags_holder">${tagsHTML}</div>
                        </div>
                        <h4 class="title">
                            <a href="${post.url}">${post.title}</a>
                        </h4>
                        <div class="summary">${post.summary}</div>
                        <div class="byline">
                            <span class="authorName">${post.author}</span>
                            <span class="postDate">${formatted}</span>
                        </div>
                    </div>
                    <div class="readMoreHolder">
                        <a href="${post.url}" class="cm-btn read-more-btn">
                            <span class="btn-text">Read&nbsp;More</span>
                            <span class="btn-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25">
                                    <path style="fill:currentColor" d="m17.5 5.999-.707.707 5.293 5.293H1v1h21.086l-5.294 5.295.707.707L24 12.499l-6.5-6.5z"/>
                                </svg>
                            </span>
                        </a>
                    </div>
                </div>
            </article>
        `;
    }

    renderPosts(posts, page) {
        this.showLoader();
        setTimeout(() => {
            const start = (page - 1) * this.postsPerPage;
            const end = start + this.postsPerPage;
            const pagePosts = posts.slice(start, end);
            const html = pagePosts.map(post => this.createPostCard(post)).join('');
            
            const blogList = document.querySelector(this.selectors.blogList);
            if (blogList) {
                blogList.innerHTML = html || '<p class="no-posts">No posts found.</p>';
            }
            this.hideLoader();
        }, 300); // Reduced delay for better UX
    }

    renderPagination(posts, page) {
        const totalPages = Math.ceil(posts.length / this.postsPerPage);
        let pagination = '';
        
        if (totalPages > 1) {
            // Previous button
            if (page > 1) {
                pagination += `<button class="page-btn prev" data-page="${page - 1}">‹ Previous</button>`;
            }
            
            // Page numbers
            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= page - 2 && i <= page + 2)) {
                    pagination += `<button class="page-btn${i === page ? ' active' : ''}" data-page="${i}">${i}</button>`;
                } else if (i === page - 3 || i === page + 3) {
                    pagination += '<span class="page-ellipsis">...</span>';
                }
            }
            
            // Next button
            if (page < totalPages) {
                pagination += `<button class="page-btn next" data-page="${page + 1}">Next ›</button>`;
            }
        }
        
        const paginationEl = document.querySelector(this.selectors.pagination);
        if (paginationEl) {
            paginationEl.innerHTML = pagination;
        }
    }

    renderTags(posts) {
        const tagCounts = {};
        let totalCount = 0;

        posts.forEach(post => {
            totalCount++;
            (post.tags || []).forEach(tag => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });

        const tags = Object.keys(tagCounts).sort();
        let html = `<button class="tag-btn${this.currentTag === null ? ' active' : ''}" data-tag="">All (${totalCount})</button>`;

        tags.forEach(tag => {
            const count = tagCounts[tag];
            html += `<button class="tag-btn${this.currentTag === tag ? ' active' : ''}" data-tag="${encodeURIComponent(tag)}">${tag} (${count})</button>`;
        });

        const tagFilter = document.querySelector(this.selectors.tagFilter);
        if (tagFilter) {
            tagFilter.innerHTML = html;
        }
    }

    filterPostsByTag(tag) {
        if (!tag) {
            this.filteredPosts = this.allPosts.slice();
            this.currentTag = null;
        } else {
            this.filteredPosts = this.allPosts.filter(post => post.tags.includes(tag));
            this.currentTag = tag;
        }
        
        this.currentPage = 1;
        this.renderPosts(this.filteredPosts, this.currentPage);
        this.renderPagination(this.filteredPosts, this.currentPage);
        this.renderTags(this.allPosts);
        
        // Update URL without refresh
        const url = new URL(window.location);
        if (tag) {
            url.searchParams.set('tag', tag);
        } else {
            url.searchParams.delete('tag');
        }
        window.history.replaceState({}, '', url);
    }

    bindEvents() {
        // Pagination events
        const pagination = document.querySelector(this.selectors.pagination);
        if (pagination) {
            pagination.addEventListener('click', (e) => {
                if (e.target.classList.contains('page-btn')) {
                    this.currentPage = parseInt(e.target.getAttribute('data-page'));
                    this.renderPosts(this.filteredPosts, this.currentPage);
                    this.renderPagination(this.filteredPosts, this.currentPage);
                    document.querySelector('.layout')?.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // Tag filter events
        const tagFilter = document.querySelector(this.selectors.tagFilter);
        if (tagFilter) {
            tagFilter.addEventListener('click', (e) => {
                if (e.target.classList.contains('tag-btn')) {
                    const tag = decodeURIComponent(e.target.getAttribute('data-tag'));
                    this.filterPostsByTag(tag);
                }
            });
        }

        // Tag link events in blog cards
        const blogList = document.querySelector(this.selectors.blogList);
        if (blogList) {
            blogList.addEventListener('click', (e) => {
                if (e.target.classList.contains('tag-link')) {
                    e.preventDefault();
                    const tag = decodeURIComponent(e.target.getAttribute('data-tag'));
                    this.filterPostsByTag(tag);
                }
            });
        }
    }

    checkUrlParams() {
        const params = new URLSearchParams(window.location.search);
        const tagParam = params.get('tag');
        if (tagParam) {
            setTimeout(() => {
                const tagBtn = document.querySelector(`.tag-filter .tag-btn[data-tag="${encodeURIComponent(tagParam)}"]`);
                if (tagBtn) {
                    tagBtn.click();
                }
            }, 100);
        }
    }

    showError(message) {
        const blogList = document.querySelector(this.selectors.blogList);
        if (blogList) {
            blogList.innerHTML = `<p class="error-message">${message}</p>`;
        }
    }
}

// Auto-initialize for pages with blog-list element
if (document.querySelector('#blog-list')) {
    // Extract base path from the current page depth
    const depth = window.location.pathname.split('/').length - 2;
    const basePath = depth === 0 ? '' : '../'.repeat(depth);
    
    new BlogLoader({
        basePath: basePath,
        jsonPath: `${basePath}js/blogs.json`
    });
}

// Export for manual initialization
window.BlogLoader = BlogLoader; 