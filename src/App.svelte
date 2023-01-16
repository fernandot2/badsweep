<script>
  import Minefield from './lib/Minefield.svelte'

  let difficulty = 'hard';
</script>


<main>
  {#if difficulty}
    <Minefield bind:difficulty={difficulty} />
  {/if}
</main>

<style>

</style>