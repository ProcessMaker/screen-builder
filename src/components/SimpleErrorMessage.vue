<template>
    <div class="simple-error-message-main">
        <p>
            <img src="../assets/icons/ErrorMessage.svg" class="simple-error-message-icon"/>
        </p>
        <p>
            <span class="simple-error-message-title"> {{ $t(title) }} </span>
        </p>
        <p>
            <span class="simple-error-message-message">{{ $t(message) }}</span>
        </p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title: "We're Sorry",
            message:
                "An error has occurred. Please try again. If the problem persists, please contact your administrator."
        };
    }
};
</script>

<style>
.simple-error-message-main {
    text-align: center;
}
.simple-error-message-icon {
    color: var(--warning);
    font-size: 144px;
}
.simple-error-message-title {
    font-size: 24px;
}
.simple-error-message-message {
    display: inline-block;
    width: 400px;
}
</style>
