<template>
  <article
    class="vibe-product-card"
    :class="{ 'vibe-product-card--out-of-stock': !inStock }"
    data-cy="product-card"
  >
    <div class="vibe-product-card__image" :style="{ background: imageColor }">
      <span class="vibe-product-card__emoji" aria-hidden="true">{{ emoji }}</span>
    </div>
    <div class="vibe-product-card__body">
      <div class="vibe-product-card__meta">
        <vibe-badge v-if="category" :label="category" variant="neutral" />
        <vibe-badge v-if="!inStock" label="Agotado" variant="danger" />
      </div>
      <h3 class="vibe-product-card__name">{{ name }}</h3>
      <p v-if="description" class="vibe-product-card__description">{{ description }}</p>
      <div class="vibe-product-card__footer">
        <span class="vibe-product-card__price">{{ formattedPrice }}</span>
        <vibe-button
          label="Agregar"
          variant="secondary"
          size="sm"
          icon="+"
          :disabled="!inStock"
          data-cy="add-product"
          @click="$emit('add')"
        />
      </div>
    </div>
  </article>
</template>

<script>
import VibeBadge from "./VibeBadge.vue";
import VibeButton from "./VibeButton.vue";

export default {
  name: "VibeProductCard",
  components: { VibeBadge, VibeButton },
  props: {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, default: "" },
    category: { type: String, default: "" },
    emoji: { type: String, default: "📦" },
    imageColor: { type: String, default: "#f4f7fa" },
    inStock: { type: Boolean, default: true },
    currency: { type: String, default: "USD" },
  },
  computed: {
    formattedPrice() {
      return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: this.currency,
      }).format(this.price);
    },
  },
};
</script>

<style scoped>
.vibe-product-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(15, 38, 74, 0.08);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.vibe-product-card:not(.vibe-product-card--out-of-stock):hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 48px rgba(15, 38, 74, 0.12);
}

.vibe-product-card--out-of-stock {
  opacity: 0.72;
}

.vibe-product-card__image {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
}

.vibe-product-card__emoji {
  font-size: 48px;
  line-height: 1;
}

.vibe-product-card__body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
}

.vibe-product-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.vibe-product-card__name {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #0f264a;
  letter-spacing: -0.02em;
}

.vibe-product-card__description {
  margin: 0;
  font-size: 12px;
  color: #7a8fa8;
  line-height: 1.5;
}

.vibe-product-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 4px;
}

.vibe-product-card__price {
  font-size: 16px;
  font-weight: 700;
  color: #0f264a;
}
</style>
