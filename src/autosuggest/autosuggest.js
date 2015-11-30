
function delay(milliseconds) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, milliseconds);
    });
}


class Autosuggest {
    constructor(resultSelector, sources) {
        this.sources = sources.map(AutosuggestSource.fromJSON);
        this.results = new AutosuggestResults(resultSelector);

        this._currentTerm = '';
        this._time = Date.now();
    }

    listen(inputSelector) {
        const self = this;

        const input = d3.select(inputSelector)
            .on('keydown', function() {
                self.keydown(d3.event.keyCode);
                d3.event.stopPropagation();
            })
            .on('input', function() {
                self.throttledSuggest(this.value);
            });
    }

    throttledSuggest(term) {
        delay(Constants.AUTOCOMPLETE_WAIT_MS).then(() => {
            if (term === this._currentTerm) {
                this.suggest(term);
            }
        });

        this._currentTerm = term;
    }

    suggest(term) {
        if (term === '') {
            this.results.hide();
        } else {
            const time = Date.now();
            const promises = this.sources.map(source => source.get(term));

            Promise.all(promises).then(allOptions => {
                if (time > this._time) {
                    this._time = time;
                    this.results.show(this.sources, allOptions);
                }
            });
        }
    }

    keydown(keyCode) {
        if (keyCode == 13) {
            this.enter();
        } else {
            this.results.keydown(keyCode);
        }
    }

    enter() {
        if (this.results.index < 0) {
            const path = `/search?${$.param({q: this._currentTerm})}`;
            window.location.href = path;
        } else {
            this.results.enter();
        }
    }
}

