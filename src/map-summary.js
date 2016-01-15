
class MapSummary {

    static getSummaryString(regions, data, variable, year, filter) {

        const rg = regions.map((region, index) => {

            const datum = _.filter(data[index], filter)[0]; // should be only one

            return "The {0} in {1} for {2} was {3}.".format(
                variable.name.toLowerCase(),
                year,
                region.name,
                this.formatValue(variable.column, datum[variable.column]));
        })

        return rg.join(' ');
    }

    static getCostOfLivingSummaryString(regions, data, variable, year, filter) {

        const rg = regions.map((region, index) => {

            const datum = _.filter(data[index], filter)[0]; // should be only one

            if (variable.name.toLowerCase() == 'all') {

                return "The cost of living index in {0} for {1} was {2}.".format(
                    year,
                    region.name,
                    this.formatValue(variable.column, datum[variable.column]));
            }
            else {

                return "The cost of living index for {0} in {1} for {2} was {3}.".format(
                    variable.name.toLowerCase(),
                    year,
                    region.name,
                    this.formatValue(variable.column, datum[variable.column]));
            }
        })

        return rg.join(' ');
    }

    static getOccupationsSummaryString(regions, data, variable, year, filter) {

        const rg = regions.map((region, index) => {

            const datum = _.filter(data[index], filter)[0]; // should be only one

            return "The percent working in {0} in {1} for {2} was {3}.".format(
                variable.name.toLowerCase(),
                year,
                region.name,
                this.formatValue(variable.column, datum[variable.column]));
        })

        return rg.join(' ');
    }

    static formatValue(variableName, value) {

        if (variableName in MapSummaryFormatters) {

            const formatter = MapSummaryFormatters[variableName];
            return numeral(value).format(formatter.format) + formatter.suffix;
        }

        return value;
    }
}