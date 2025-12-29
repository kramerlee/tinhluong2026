<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { RouterView } from 'vue-router'

const siteUrl = 'https://kramerlee.github.io/tinhluong'

useHead({
  htmlAttrs: {
    lang: 'vi'
  },
  titleTemplate: '%s | Tính Lương NET',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes' },
    { name: 'theme-color', content: '#1e3a5f' },
    { name: 'author', content: 'Tính Lương NET 2026' },
    { name: 'robots', content: 'index, follow' },
    { name: 'googlebot', content: 'index, follow' },
    
    // Keywords
    { name: 'keywords', content: 'tính lương, lương net, lương gross, thuế thu nhập cá nhân, TNCN, giảm trừ gia cảnh, 2026, tính thuế, bảo hiểm xã hội, BHXH, calculator, Vietnam salary' },
    
    // Open Graph
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Tính Lương NET 2026' },
    { property: 'og:locale', content: 'vi_VN' },
    { property: 'og:url', content: siteUrl },
    { property: 'og:title', content: 'Tính Lương NET 2026 - Công cụ tính lương online miễn phí' },
    { property: 'og:description', content: 'Công cụ tính lương NET từ GROSS theo mức giảm trừ gia cảnh 2026. Hỗ trợ biểu thuế mới 5 bậc từ 01/07/2026. Tính thuế TNCN, BHXH, BHYT, BHTN tự động.' },
    { property: 'og:image', content: `${siteUrl}/og-image.png` },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Tính Lương NET 2026 - Công cụ tính lương online miễn phí' },
    { name: 'twitter:description', content: 'Công cụ tính lương NET từ GROSS theo mức giảm trừ gia cảnh 2026. Hỗ trợ biểu thuế mới 5 bậc từ 01/07/2026.' },
    { name: 'twitter:image', content: `${siteUrl}/og-image.png` },
    
    // Apple
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
    { name: 'apple-mobile-web-app-title', content: 'Tính Lương NET' }
  ],
  link: [
    { rel: 'canonical', href: siteUrl },
    { rel: 'alternate', hreflang: 'vi', href: siteUrl },
    { rel: 'alternate', hreflang: 'x-default', href: siteUrl },
    { rel: 'icon', type: 'image/svg+xml', href: '/tinhluong/vite.svg' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'Tính Lương NET 2026',
        'description': 'Công cụ tính lương NET từ GROSS theo mức giảm trừ gia cảnh 2026. Hỗ trợ biểu thuế mới 5 bậc từ 01/07/2026.',
        'url': siteUrl,
        'applicationCategory': 'FinanceApplication',
        'operatingSystem': 'All',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'VND'
        },
        'author': {
          '@type': 'Organization',
          'name': 'Tính Lương NET 2026'
        },
        'inLanguage': 'vi',
        'isAccessibleForFree': true
      })
    }
  ]
})
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
