
class LoadHandler {

    init() {
        document.addEventListener('DOMContentLoaded', this.onLoad);
    }

    onLoad() {
        console.log('Loaded');
    }
}

const loadHandler = new LoadHandler();
loadHandler.init();
