<template>
    <div class="message">
        <span class="username">Username</span>
        <span class="text">
            <p>
                Message
            </p>
            <p>
                Message
            </p>
            <p>
                Message
            </p>
        </span>
        <span  class="votes">X</span>

    </div>
</template>
<script setup lang="ts">

</script>
<style lang="css">
.message{
    border:2px solid black;
    border-radius: 5px;
}
.message > .username{
    position:absolute;
    top:0px;
    left:0px
}
.message > .text{
    font-weight: bold;
    line-height: 1.2rem;
}
.message > .votes{
    position:absolute;
    bottom:0px;
    right:0px;
}
</style>