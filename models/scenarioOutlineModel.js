class ScenarioOutlineModel {
    scenario_outline_name = '';
    scenario_outline_headers = [];
    scenario_outline_data = [{}];
    scenario_outline_steps = [];

    isEmpty() {
        return (
            this.scenario_outline_name === '' &&
            this.scenario_outline_headers.length === 0 &&
            this.scenario_outline_steps.length === 0 &&
            this.scenario_outline_data.length === 1 && // Assuming there's always one empty object
            Object.keys(this.scenario_outline_data[0]).length === 0
        );
    }
}

module.exports = ScenarioOutlineModel;
