<template>
  <li class="vibe-cart-item" data-cy="cart-item">
    <div class="vibe-cart-item__info">
      <span class="vibe-cart-item__emoji" aria-hidden="true">{{ emoji }}</span>
      <div class="vibe-cart-item__details">
        <span class="vibe-cart-item__name">{{ name }}</span>
        <span class="vibe-cart-item__unit-price">{{ formattedUnitPrice }}</span>
      </div>
    </div>
    <div class="vibe-cart-item__controls">
      <div class="vibe-cart-item__quantity" role="group" :aria-label="`Cantidad de ${name}`">
        <button
          type="button"
          class="vibe-cart-item__qty-btn"
          aria-label="Disminuir cantidad"
          data-cy="decrease-qty"
          @click="$emit('decrease')"
        >
          −
        </button>
        <span class="vibe-cart-item__qty-value" data-cy="item-quantity">{{ quantity }}</span>
        <button
          type="button"
          class="vibe-cart-item__qty-btn"
          aria-label="Aumentar cantidad"
          data-cy="increase-qty"
          @click="$emit('increase')"
        >
          +
        </button>
      </div>
      <span class="vibe-cart-item__line-total">{{ formattedLineTotal }}</span>
      <button
        type="button"
        class="vibe-cart-item__remove"
        aria-label="Eliminar del carrito"
        data-cy="remove-item"
        @click="$emit('remove')"
      >
        ×
      </button>
    </div>
  </li>
</template>

<script>
export default {
  name: "VibeCartItem",
  props: {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    emoji: { type: String, default: "📦" },
    currency: { type: String, default: "USD" },
  },
  computed: {
    formattedUnitPrice() {
      return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: this.currency,
      }).format(this.price);
    },
    formattedLineTotal() {
      return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: this.currency,
      }).format(this.price * this.quantity);
    },
  },
};
</script>

<style scoped>
.vibe-cart-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(15, 38, 74, 0.08);
  list-style: none;
}

.vibe-cart-item:last-child {
  border-bottom: none;
}

.vibe-cart-item__info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.vibe-cart-item__emoji {
  font-size: 24px;
  line-height: 1;
}

.vibe-cart-item__details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.vibe-cart-item__name {
  font-size: 14px;
  font-weight: 600;
  color: #0f264a;
}

.vibe-cart-item__unit-price {
  font-size: 12px;
  color: #7a8fa8;
}

.vibe-cart-item__controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.vibe-cart-item__quantity {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #f4f7fa;
  border-radius: 999px;
  padding: 2px;
}

.vibe-cart-item__qty-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: #fff;
  color: #0f264a;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}

.vibe-cart-item__qty-btn:hover {
  background: rgba(15, 38, 74, 0.08);
}

.vibe-cart-item__qty-value {
  min-width: 24px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #0f264a;
}

.vibe-cart-item__line-total {
  flex: 1;
  text-align: right;
  font-size: 14px;
  font-weight: 700;
  color: #0f264a;
}

.vibe-cart-item__remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 50%;
  background: rgba(197, 48, 48, 0.08);
  color: #c53030;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  transition: background 0.15s ease;
}

.vibe-cart-item__remove:hover {
  background: rgba(197, 48, 48, 0.15);
}
</style>
