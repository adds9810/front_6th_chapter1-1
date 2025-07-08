import { getProducts } from "../api/productApi.js";
import SearchFilter from "../components/list/SearchFilter.js";

const Home = {
  el: null,
  state: {
    products: [],
    pagination: {},
    loading: true,
    filters: {
      page: 1,
      limit: 20,
      sort: "price_asc",
      search: "",
    },
  },

  handleFilterChange(newFilters) {
    const updatedFilters = { ...this.state.filters, ...newFilters, page: 1 };

    this.setState({
      filters: updatedFilters,
      loading: true,
    });

    this.fetchProducts();
  },
  async fetchProducts() {
    try {
      const data = await getProducts(this.state.filters);
      this.setState({ products: data.products, loading: false, pagination: data.pagination });
    } catch (error) {
      console.error("상품 목록 불러오기 실패:", error);
      this.setState({ loading: false });
    }
  },

  setState(newState) {
    this.state = { ...this.state, ...newState };
    if (this.el) {
      const newEl = this.render();
      this.el.replaceWith(newEl);
      this.el = newEl;
    }
  },

  template() {
    return `
       <div class="home-page">
         <div id="search-filter-container"></div>
         <div id="product-list-container">
           ${this.templateProducts()}
         </div>
       </div>
     `;
  },

  templateProducts() {
    const totalCount = (this.state.pagination || {}).total || 0;

    if (this.state.loading) {
      return ` <!-- 상품 목록 -->
        <div class="mb-6">
          <div>
            <!-- 상품 그리드 -->
            <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">
              <!-- 로딩 스켈레톤 -->
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                <div class="aspect-square bg-gray-200"></div>
                <div class="p-3">
                  <div class="h-4 bg-gray-200 rounded mb-2"></div>
                  <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div class="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                <div class="aspect-square bg-gray-200"></div>
                <div class="p-3">
                  <div class="h-4 bg-gray-200 rounded mb-2"></div>
                  <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div class="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                <div class="aspect-square bg-gray-200"></div>
                <div class="p-3">
                  <div class="h-4 bg-gray-200 rounded mb-2"></div>
                  <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div class="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                <div class="aspect-square bg-gray-200"></div>
                <div class="p-3">
                  <div class="h-4 bg-gray-200 rounded mb-2"></div>
                  <div class="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div class="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
                  <div class="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
            
            <div class="text-center py-4">
              <div class="inline-flex items-center">
                <svg class="animate-spin h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-sm text-gray-600">상품을 불러오는 중...</span>
              </div>
            </div>
          </div>
        </div>`;
    }
    if (!this.state.products || !this.state.products.length) {
      return `  
        <div class="text-center py-4">
            <div class="inline-flex items-center">
                <span class="text-sm text-gray-600">불러올 상품이 없습니다.</span>
            </div>
        </div>`;
    }
    return `
<div class="mb-6">
    <div>
    <!-- 상품 개수 정보 -->
    <div class="mb-4 text-sm text-gray-600">
        총 <span class="font-medium text-gray-900">${totalCount}개</span>의 상품
    </div>

    <!-- 상품 그리드 -->
    <div class="grid grid-cols-2 gap-4 mb-6" id="products-grid">

         ${this.state.products
           .map(
             (item) => `
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden product-card"
            data-product-id="85067212996">
        <!-- 상품 이미지 -->
        <div class="aspect-square bg-gray-100 overflow-hidden cursor-pointer product-image">
            <img src="${item.image}"
                alt="${item.title}"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                loading="lazy">
        </div>
        <!-- 상품 정보 -->
        <div class="p-3">
            <div class="cursor-pointer product-info mb-3">
            <h3 class="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
           ${item.title}
            </h3>
            <p class="text-xs text-gray-500 mb-2"></p>
            <p class="text-lg font-bold text-gray-900">
               ${parseInt(item.lprice).toLocaleString()}원
            </p>
            </div>
            <!-- 장바구니 버튼 -->
            <button class="w-full bg-blue-600 text-white text-sm py-2 px-3 rounded-md
                    hover:bg-blue-700 transition-colors add-to-cart-btn" data-product-id="85067212996">
            장바구니 담기
            </button>
        </div>
        </div>                                    
         `,
           )
           .join("")}       
     `;
  },

  render() {
    if (!this.el) {
      this.el = document.createElement("main");
      this.el.className = "max-w-md mx-auto px-4 py-4";
    }

    this.el.innerHTML = this.template();

    const searchFilterContainer = this.el.querySelector("#search-filter-container");
    if (SearchFilter.el && !searchFilterContainer.contains(SearchFilter.el)) {
      searchFilterContainer.appendChild(SearchFilter.el);
    }

    return this.el;
  },

  init() {
    const searchFilterEl = SearchFilter.init(this.handleFilterChange.bind(this));

    this.render();
    this.el.querySelector("#search-filter-container").appendChild(searchFilterEl);

    this.fetchProducts();

    return this.el;
  },
};

export default Home;
