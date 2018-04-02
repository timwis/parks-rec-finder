<template>
  <ul class="tab-switcher">
    <li
      :class="{'is-active': activeTab === 'activities'}"
      data-testid="activitiesTab"
    >
      <slot name="activities"/>
    </li>
    <li
      :class="{'is-active': activeTab === 'locations'}"
      data-testid="locationsTab"
    >
      <slot name="locations"/>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    activeTab: String,
    activitiesCount: Number,
    locationsCount: Number
  }
}
</script>

<style lang="sass" scoped>
.tab-switcher
  margin-left: 0

  li
    display: inline

    a
      font-weight: normal
      padding-bottom: 5px

  li.is-active
    a
      font-weight: bold
      border-bottom: 2px #0f4d90 solid

  li:not(:first-child):before
    content: " | "
</style>
