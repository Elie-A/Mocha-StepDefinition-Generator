class ScenarioModel {
    scenario_name = '';
    scenario_data = {};
    scenario_steps = [];

    isEmpty() {
        return (
            this.scenario_name === '' &&
            this.scenario_steps.length === 0 &&
            Object.keys(this.scenario_data).length === 0
        );
    }
}

module.exports = ScenarioModel;
