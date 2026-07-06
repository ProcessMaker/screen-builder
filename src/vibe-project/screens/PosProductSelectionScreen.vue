<template>
  <div class="pos-product-selection" data-cy="pos-product-selection-screen">
    <example-header
      title="Punto de venta"
      subtitle="Seleccione productos y agregue al carrito"
    />

    <vibe-alert
      v-if="checkoutMessage"
      variant="success"
      title="Venta registrada"
      :message="checkoutMessage"
      dismissible
      data-cy="checkout-success"
      @dismiss="checkoutMessage = ''"
    />

    <div class="pos-product-selection__layout">
      <section class="pos-product-selection__catalog">
        <div class="pos-product-selection__toolbar">
          <vibe-input
            v-model="searchQuery"
            label="Buscar producto"
            placeholder="Nombre o categoría..."
            data-cy="product-search"
          />
          <div class="pos-product-selection__categories" role="group" aria-label="Filtrar por categoría">
            <button
              v-for="cat in categories"
              :key="cat.value"
              type="button"
              class="pos-product-selection__category"
              :class="{ 'pos-product-selection__category--active': activeCategory === cat.value }"
              :data-cy="`category-${cat.value || 'all'}`"
              @click="activeCategory = cat.value"
            >
              {{ cat.label }}
            </button>
          </div>
        </div>

        <div v-if="filteredProducts.length" class="pos-product-selection__grid">
          <vibe-product-card
            v-for="product in filteredProducts"
            :key="product.id"
            :name="product.name"
            :price="product.price"
            :description="product.description"
            :category="product.category"
            :emoji="product.emoji"
            :image-color="product.imageColor"
            :in-stock="product.inStock"
            :data-cy="`product-${product.id}`"
            @add="addToCart(product)"
          />
        </div>

        <p v-else class="pos-product-selection__no-results">
          No se encontraron productos con los filtros actuales.
        </p>
      </section>

      <vibe-pos-cart
        :items="cartItems"
        :tax-rate="21"
        @increase="increaseQuantity"
        @decrease="decreaseQuantity"
        @remove="removeFromCart"
        @clear="clearCart"
        @checkout="handleCheckout"
      />
    </div>
  </div>
</template>

<script>
import ExampleHeader from "../components/ExampleHeader.vue";
import VibeAlert from "../components/VibeAlert.vue";
import VibeInput from "../components/VibeInput.vue";
import VibePosCart from "../components/VibePosCart.vue";
import VibeProductCard from "../components/VibeProductCard.vue";

const PRODUCTS = [
  { id: 1, name: "Café Americano", price: 3.5, category: "Bebidas", emoji: "☕", imageColor: "#fef3c7", description: "Café filtrado 240 ml", inStock: true },
  { id: 2, name: "Cappuccino", price: 4.25, category: "Bebidas", emoji: "🥤", imageColor: "#fde68a", description: "Espresso con leche espumada", inStock: true },
  { id: 3, name: "Medialuna", price: 1.8, category: "Panadería", emoji: "🥐", imageColor: "#ffedd5", description: "Medialuna de manteca", inStock: true },
  { id: 4, name: "Sandwich Club", price: 7.9, category: "Comidas", emoji: "🥪", imageColor: "#dcfce7", description: "Pollo, bacon, lechuga y tomate", inStock: true },
  { id: 5, name: "Ensalada César", price: 8.5, category: "Comidas", emoji: "🥗", imageColor: "#d1fae5", description: "Lechuga, crutones y aderezo", inStock: true },
  { id: 6, name: "Agua mineral", price: 2.0, category: "Bebidas", emoji: "💧", imageColor: "#dbeafe", description: "Botella 500 ml", inStock: true },
  { id: 7, name: "Brownie", price: 3.2, category: "Panadería", emoji: "🍫", imageColor: "#fce7f3", description: "Brownie de chocolate", inStock: false },
  { id: 8, name: "Jugo natural", price: 4.0, category: "Bebidas", emoji: "🍊", imageColor: "#fed7aa", description: "Naranja recién exprimida", inStock: true },
];

export default {
  name: "PosProductSelectionScreen",
  components: {
    ExampleHeader,
    VibeAlert,
    VibeInput,
    VibePosCart,
    VibeProductCard,
  },
  data() {
    return {
      products: PRODUCTS,
      cart: {},
      searchQuery: "",
      activeCategory: "",
      checkoutMessage: "",
      categories: [
        { value: "", label: "Todos" },
        { value: "Bebidas", label: "Bebidas" },
        { value: "Panadería", label: "Panadería" },
        { value: "Comidas", label: "Comidas" },
      ],
    };
  },
  computed: {
    filteredProducts() {
      const query = this.searchQuery.trim().toLowerCase();
      return this.products.filter((product) => {
        const matchesCategory = !this.activeCategory || product.category === this.activeCategory;
        const matchesSearch =
          !query ||
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
      });
    },
    cartItems() {
      return Object.values(this.cart);
    },
  },
  methods: {
    addToCart(product) {
      if (!product.inStock) return;

      if (this.cart[product.id]) {
        this.cart[product.id].quantity += 1;
      } else {
        this.$set(this.cart, product.id, {
          id: product.id,
          name: product.name,
          price: product.price,
          emoji: product.emoji,
          quantity: 1,
        });
      }
    },
    increaseQuantity(productId) {
      if (this.cart[productId]) {
        this.cart[productId].quantity += 1;
      }
    },
    decreaseQuantity(productId) {
      if (!this.cart[productId]) return;
      if (this.cart[productId].quantity <= 1) {
        this.removeFromCart(productId);
      } else {
        this.cart[productId].quantity -= 1;
      }
    },
    removeFromCart(productId) {
      this.$delete(this.cart, productId);
    },
    clearCart() {
      this.cart = {};
    },
    handleCheckout() {
      const total = this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const count = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
      this.checkoutMessage = `Venta completada: ${count} artículo(s) por ${this.formatCurrency(total * 1.21)} (IVA incluido).`;
      this.clearCart();
    },
    formatCurrency(value) {
      return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "USD",
      }).format(value);
    },
  },
};
</script>

<style scoped>
.pos-product-selection {
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px 24px;
  font-family: Inter, system-ui, sans-serif;
}

.pos-product-selection__layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
  align-items: start;
}

.pos-product-selection__catalog {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pos-product-selection__toolbar {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.pos-product-selection__categories {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pos-product-selection__category {
  padding: 8px 16px;
  border: none;
  border-radius: 999px;
  background: rgba(15, 38, 74, 0.06);
  color: #4a5f78;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.pos-product-selection__category:hover {
  background: rgba(15, 38, 74, 0.1);
  color: #0f264a;
}

.pos-product-selection__category--active {
  background: #0f264a;
  color: #fff;
}

.pos-product-selection__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.pos-product-selection__no-results {
  margin: 0;
  padding: 40px 20px;
  text-align: center;
  font-size: 14px;
  color: #7a8fa8;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(15, 38, 74, 0.08);
}

@media (max-width: 900px) {
  .pos-product-selection__layout {
    grid-template-columns: 1fr;
  }
}
</style>
