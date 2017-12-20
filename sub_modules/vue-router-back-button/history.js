var History = {
    /**
     * Key to set in sessionStorage
     * @type {String}
     */
    storageKey: 'vue.router.back.button.history',

    /**
     * Fallback if sessionStorage is not available
     * @type {Array}
     */
    history: [],

    /**
     * Check if sessionStorage is available
     */
    useSession: window.sessionStorage ? 1 : 0,

    /**
     * Install global property $routerHistory
     */
    install: function install(Vue) {
        Object.defineProperty(Vue.prototype, '$routerHistory', {
            get: function get() {
                return History;
            }
        });
    },


    /**
     * Get full history list
     * @method
     * @return {Array}
     */
    get: function get() {
        if (!this.useSession) {
            return this.history;
        }

        var history = sessionStorage.getItem(this.storageKey);

        if (!history) {
            return [];
        } else {
            history = JSON.parse(history);
        }

        return history;
    },


    /**
     * Save new history list
     */
    save: function save(history) {
        if (!this.useSession) {
            this.history = history;
        } else {
            history = JSON.stringify(history);
            sessionStorage.setItem(this.storageKey, history);
        }
    },


    /**
     * Get the previous path
     */
    previous: function previous() {
        var history = this.get();

        if (history.length > 1 && history.slice(-2)[0]) {
            return { path: history.slice(-2)[0] };
        }

        return { path: null };
    },
    hasHistory: function hasHistory() {
        var history = this.get();

        return history.length > 1 && history.slice(-2)[0];
    },


    /**
     * Add new route to the history
     */
    push: function push(path) {
        var history = this.get();
        history.push(path);

        this.save(history);
    },


    /**
     * User went back in history
     */
    back: function back(amount) {
        var history = this.get();
        history.splice(-amount, amount);

        this.save(history);
    },


    /**
     * Get the index of recently visited route
     */
    indexOfRecentHistory: function indexOfRecentHistory(path) {
        var recentHistory = this.get().slice(-4).reverse();
        return recentHistory.indexOf(path);
    },


    /**
     * Check if user visited a path recently
     * If so, the user must go back
     */
    visitedRecently: function visitedRecently(path) {
        var index = this.indexOfRecentHistory(path);

        if (index === -1) {
            return false;
        }

        return true;
    }
};

export default History
