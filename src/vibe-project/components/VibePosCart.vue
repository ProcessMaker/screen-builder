<template>
  <aside class="vibe-pos-cart" data-cy="pos-cart">
    <header class="vibe-pos-cart__header">
      <div>
        <h2 class="vibe-pos-cart__title">{{ title }}</h2>
        <p class="vibe-pos-cart__subtitle">{{ itemCount }} {{ itemCount === 1 ? "artículo" : "artículos" }}</p>
      </div>
      <vibe-button
        v-if="items.length"
        label="Vaciar"
        variant="ghost"
        size="sm"
        data-cy="clear-cart"
        @click="$emit('clear')"
      />
    </header>

    <div v-if="!items.length" class="vibe-pos-cart__empty">
      <span class="vibe-pos-cart__empty-icon" aria-hidden="true">🛒</span>
      <p class="vibe-pos-cart__empty-text">{{ emptyMessage }}</p>
    </div>

    <ul v-else class="vibe-pos-cart__items">
      <vibe-cart-item
        v-for="item in items"
        :key="item.id"
        :name="item.name"
        :price="item.price"
        :quantity="item.quantity"
        :emoji="item.emoji"
        :currency="currency"
        @increase="$emit('increase', item.id)"
        @decrease="$emit('decrease', item.id)"
        @remove="$emit('remove', item.id)"
      />
    </ul>

    <footer v-if="items.length" class="vibe-pos-cart__footer">
      <div class="vibe-pos-cart__totals">
        <div class="vibe-pos-cart__row">
          <span>Subtotal</span>
          <span data-cy="cart-subtotal">{{ formattedSubtotal }}</span>
        </div>
        <div class="vibe-pos-cart__row">
          <span>IVA ({{ taxRate }}%)</span>
          <span data-cy="cart-tax">{{ formattedTax }}</span>
        </div>
        <div class="vibe-pos-cart__row vibe-pos-cart__row--total">
          <span>Total</span>
          <span data-cy="cart-total">{{ formattedTotal }}</span>
        </div>
      </div>
      <vibe-button
        label="Cobrar"
        variant="primary"
        block
        size="lg"
        data-cy="checkout"
        @click="$emit('checkout')"
      />
    </footer>
  </aside>
</template>

<script>
import VibeButton from "./VibeButton.vue";
import VibeCartItem from "./VibeCartItem.vue";

export default {
  name: "VibePosCart",
  components: { VibeButton, VibeCartItem },
  props: {
    items: { type: Array, default: () => [] },
    title: { type: String, default: "Carrito" },
    emptyMessage: { type: String, default: "Agregue productos desde el catálogo" },
    taxRate: { type: Number, default: 21 },
    currency: { type: String, default: "USD" },
  },
  computed: {
    itemCount() {
      return this.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    subtotal() {
      return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    tax() {
      return this.subtotal * (this.taxRate / 100);
    },
    total() {
      return this.subtotal + this.tax;
    },
    formattedSubtotal() {
      return this.formatCurrency(this.subtotal);
    },
    formattedTax() {
      return this.formatCurrency(this.tax);
    },
    formattedTotal() {
      return this.formatCurrency(this.total);
    },
  },
  methods: {
    formatCurrency(value) {
      return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: this.currency,
      }).format(value);
    },
  },
};
</script>

<style scoped>
.vibe-pos-cart {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(15, 38, 74, 0.08);
  height: 100%;
  min-height: 400px;
}

.vibe-pos-cart__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 20px 16px;
  border-bottom: 1px solid rgba(15, 38, 74, 0.08);
}

.vibe-pos-cart__title {
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 700;
  color: #0f264a;
  letter-spacing: -0.02em;
}

.vibe-pos-cart__subtitle {
  margin: 0;
  font-size: 13px;
  color: #7a8fa8;
}

.vibe-pos-cart__empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px 24px;
  text-align: center;
}

.vibe-pos-cart__empty-icon {
  font-size: 48px;
  line-height: 1;
  opacity: 0.5;
}

.vibe-pos-cart__empty-text {
  margin: 0;
  font-size: 14px;
  color: #7a8fa8;
  line-height: 1.5;
}

.vibe-pos-cart__items {
  flex: 1;
  overflow-y: auto;
  margin: 0;
  padding: 8px 20px;
}

.vibe-pos-cart__footer {
  padding: 16px 20px 20px;
  border-top: 1px solid rgba(15, 38, 74, 0.08);
}

.vibe-pos-cart__totals {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.vibe-pos-cart__row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #4a5f78;
}

.vibe-pos-cart__row--total {
  margin-top: 4px;
  padding-top: 12px;
  border-top: 1px solid rgba(15, 38, 74, 0.08);
  font-size: 16px;
  font-weight: 700;
  color: #0f264a;
}
</style>
