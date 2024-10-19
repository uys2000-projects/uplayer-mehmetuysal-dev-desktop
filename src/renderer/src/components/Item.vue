<template>
  <div class=" overflow-hidden"
    :style="{ backgroundColor: item.color, height: itemHeight + 'px', width: (100 / columnCount) + '%' }">
    {{ item }}
  </div>
</template>
<script lang="ts">
export default {
  props: ['item', 'columnCount', 'itemHeight']
}
</script>