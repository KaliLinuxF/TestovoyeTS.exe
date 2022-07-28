'use strict';

mp.events.add('chaMessage', (message)=>{
    mp.gui.chat.push(message);
});
