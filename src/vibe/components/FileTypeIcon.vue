<template>
  <span
    class="file-type-icon"
    :class="`file-type-icon--${iconType}`"
    aria-hidden="true"
  >
    <!-- folder -->
    <svg v-if="iconType === 'folder'" viewBox="0 0 16 16" fill="none">
      <path
        d="M1.5 4.75C1.5 3.78 2.28 3 3.25 3h3.06l1.19 1.38H12.75c.97 0 1.75.78 1.75 1.75v5.62c0 .97-.78 1.75-1.75 1.75H3.25c-.97 0-1.75-.78-1.75-1.75V4.75Z"
        fill="currentColor"
      />
    </svg>

    <!-- folder open -->
    <svg v-else-if="iconType === 'folder-open'" viewBox="0 0 16 16" fill="none">
      <path
        d="M1 6.25 2.15 4.5h2.85L6.2 3h6.05c.69 0 1.25.56 1.25 1.25V5H2.5c-.55 0-1.02.36-1.17.88L1 6.25Z"
        fill="currentColor"
      />
      <path
        d="M1.35 6.75h13.3c.69 0 1.24.58 1.17 1.27l-.72 6.48c-.06.55-.54.97-1.1.97H3.3c-.56 0-1.04-.42-1.1-.97l-.85-7.75Z"
        fill="currentColor"
        opacity="0.82"
      />
    </svg>

    <!-- vue -->
    <svg v-else-if="iconType === 'vue'" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5 1.5 13h3.75l2.75-4.75L10.75 13H14.5L8 1.5Z" fill="#42b883" />
      <path d="M8 4.75 9.9 8.25H6.1L8 4.75Z" fill="#35495e" />
    </svg>

    <!-- javascript -->
    <svg v-else-if="iconType === 'js'" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="12" height="12" rx="2" fill="#f7df1e" />
      <path
        d="M10.35 9.55c.2.35.42.6.88.6.45 0 .72-.22.72-.52 0-.36-.28-.48-.75-.7l-.27-.12c-.75-.32-1.24-.72-1.24-1.58 0-.8.6-1.4 1.52-1.4.66 0 1.14.23 1.48.83l-.78.5c-.18-.31-.36-.44-.7-.44-.32 0-.5.2-.5.44 0 .3.24.42.78.6l.27.12c.88.37 1.38.75 1.38 1.6 0 .94-.7 1.45-1.64 1.45-.93 0-1.52-.43-1.8-1.08l.75-.56Z"
        fill="#323330"
      />
      <path
        d="M6.45 9.62V6.05h1.02v3.05c0 .52.27.77.67.77.4 0 .67-.25.67-.77V6.05h1.02v3.52c0 1.07-.62 1.65-1.68 1.65-1.06 0-1.68-.58-1.68-1.65Z"
        fill="#323330"
      />
    </svg>

    <!-- yaml -->
    <svg v-else-if="iconType === 'yaml'" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="1.5" width="10" height="13" rx="1.5" fill="#cb171e" />
      <path
        d="M5.25 4.75 6.75 7.5 5.25 10.25M10.75 4.75 9.25 7.5l1.5 2.75M7.35 10.25h1.3"
        stroke="#fff"
        stroke-width="1.15"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>

    <!-- json -->
    <svg v-else-if="iconType === 'json'" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="1.5" width="10" height="13" rx="1.5" fill="#f59e0b" />
      <path
        d="M6.35 5.35c-.58 0-1 .27-1.2.76-.16.37-.22.82-.22 1.34H4.4c0-.65.08-1.17.3-1.58.32-.6.86-.92 1.6-.92 1 0 1.58.55 1.58 1.42 0 .47-.16.86-.48 1.17-.2.2-.45.37-.86.58l-.37.2c-.58.3-.9.58-1.1 1-.2.37-.27.82-.27 1.32v.05h-.78v-.08c0-.62.1-1.1.37-1.48.23-.34.6-.62 1.2-.92l.37-.2c.37-.18.58-.34.72-.5.24-.26.35-.58.35-.96 0-.75-.5-1.2-1.28-1.2Z"
        fill="#fff"
      />
      <path
        d="M9.65 10.65c.58 0 1-.27 1.2-.76.16-.37.22-.82.22-1.34h.53c0 .65-.08 1.17-.3 1.58-.32.6-.86.92-1.6.92-1 0-1.58-.55-1.58-1.42 0-.47.16-.86.48-1.17.2-.2.45-.37.86-.58l.37-.2c.58-.3.9-.58 1.1-1 .2-.37.27-.82.27-1.32v-.05h.78v.08c0 .62-.1 1.1-.37 1.48-.23.34-.6.62-1.2.92l-.37.2c-.37.18-.58.34-.72.5-.24.26-.35.58-.35.96 0 .75.5 1.2 1.28 1.2Z"
        fill="#fff"
      />
    </svg>

    <!-- css -->
    <svg v-else-if="iconType === 'css'" viewBox="0 0 16 16" fill="none">
      <path d="M2 2h12l-1.05 10.45L8 15l-4.95-2.55L2 2Z" fill="#264de4" />
      <path
        d="M8 12.35 10.85 11.4 11.4 7.1H5.95l.18 1.45h3.72l-.2 1.75-1.85.55-.92-.27v-.92l.5.14h.92V9.65H6.55L6.15 4.85h5.45l-.35 2.85H8v1.15Z"
        fill="#fff"
      />
    </svg>

    <!-- generic file -->
    <svg v-else viewBox="0 0 16 16" fill="none">
      <path
        d="M4.25 1.75h5.84c.2 0 .39.08.53.22l2.66 2.66c.14.14.22.33.22.53V13.25c0 .83-.67 1.5-1.5 1.5h-7c-.83 0-1.5-.67-1.5-1.5V3.25c0-.83.67-1.5 1.5-1.5Z"
        fill="currentColor"
      />
      <path
        d="M10.25 1.75v2.75c0 .55.45 1 1 1h2.75"
        fill="currentColor"
        opacity="0.45"
      />
    </svg>
  </span>
</template>

<script>
export default {
  name: "FileTypeIcon",
  props: {
    iconType: {
      type: String,
      default: "file",
    },
  },
};
</script>

<style scoped>
.file-type-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.file-type-icon svg {
  width: 16px;
  height: 16px;
  display: block;
}

.file-type-icon--folder,
.file-type-icon--folder-open {
  color: var(--vibe-accent-soft);
}

.file-type-icon--file {
  color: #94a3b8;
}
</style>
