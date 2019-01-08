<template>
    <span>
        <a class="btn" v-if="folded">
            <slot></slot>
        </a>
        <a class="btn" v-else><slot name="unfolded">-</slot></a>
    </span>
</template>

<script>
  export default {
    name: "foldable-button",
    props: {
      folded : {
        type: Boolean,
        default: true
      }
    }
  }
</script>