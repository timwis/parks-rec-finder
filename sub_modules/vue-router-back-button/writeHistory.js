import History from './history'

export default function(to, from) {
    if (!History.visitedRecently(to.fullPath)) {
        /**
         * Save the new route
         */
        History.push(to.fullPath)
    } else {
        var amount = History.indexOfRecentHistory(to.fullPath)

        History.back(amount)
    }
}
