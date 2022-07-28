mp.events.add('chaMessage', (message: string) => {
    mp.gui.chat.push(message);
});
