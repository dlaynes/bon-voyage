import { observable, action } from 'mobx';

class CommandList {
    
    @observable active_button = 'begin';

    @observable buttons = {
        begin: false,
        reset: false,
        ready: false,
        continue: false,
        take: false,
        skip: false,
        attack: false,
        flee: false,
        negotiate: false,
        return: false,
        play_again: false,
        share: false
    };
    @observable disabled = {
        begin: false,
        reset: false,
        ready: false,
        continue: false,
        take: false,
        skip: false,
        attack: false,
        flee: false,
        negotiate: false,
        return: false,
        play_again: false,
        share: false,
        planet_port: false,
        planet_shipyard: false,
        planet_market: false,
        planet_trader: false,
        planet_lab: false,
        planet_leave: false
    };
    actions = {
        begin : function(){},
        reset : function(){},
        ready : function(){},
        continue : function(){},
        take : function(){},
        skip : function(){},
        attack : function(){},
        flee : function(){},
        negotiate : function(){},
        return : function(){},
        play_again : function(){},
        share : function(){},
        planet_port: function(){},
        planet_shipyard: function(){},
        planet_market: function(){},
        planet_trader: function(){},
        planet_lab: function(){},
        planet_leave: function(){}
    };

    @observable active_list = [];

    @action setButtons(list, enable_first=false){

        this.resetPreviousButtons();
        let active, button, active_list = [];

        for(let i=0; i<list.length;i++){
            active = i==0 && enable_first;
            button = list[i];

            this.buttons[button.id] = true;
            this.buttons[button.id].active = active;
            if(button.action){
                this.buttons[button.id].action = button.action;
            }
            if(active){
                this.active_button = button.id
            }
            active_list.push(button.id);
        }
        this.active_list = active_list;
    }

    @action resetPreviousButtons(){
        for(var id in this.actions){
            if(!this.actions.hasOwnProperty(id)) continue;

            this.actions[id] = function(){};
            this.buttons[id] = false;
            this.disabled = false;
        }
    }

    @action toggleActiveButton(direction){

    }

    triggerActiveButton(){
        if(!this.buttons[this.active_button]){
            console.warn("Action",this.active_button,"is not enabled");
            return;
        }
        this.runAction(this.active_button);
    }

    triggerButton(id){
        if(!this.buttons[id]){
            console.warn("Button",id,"is not active");
            return;
        }
        this.runAction(id);
    }

    runAction(id){
        if(typeof this.buttons[id] !== 'function'){
            console.warn("Action",id,"has an invalid function attached",
                this.buttons[id] );
            return;
        }
        this.actions[id]();
    }
}

export default CommandList;