// Proof of concept

const WorldLoadedTick = createCustomTrigger("atomx:worldloadedtick")
register("tick", () => { if (World.isLoaded()) WorldLoadedTick.trigger() })