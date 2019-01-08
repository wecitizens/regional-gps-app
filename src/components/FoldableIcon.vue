<template>
    <span>
        <span v-if="folded">+</span>
        <span v-else>-</span>
    </span>
</template>

<script>
  export default {
    name: "foldable-icon",
    props: {
      folded : {
        type: Boolean,
        default: true
      }
    }
  }
</script>