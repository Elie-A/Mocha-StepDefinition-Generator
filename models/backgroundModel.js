class BackgroundModel {
    background_name = '';
    background_data = {};
    background_steps = [];

    isEmpty() {
        return (
            this.background_name === '' &&
            this.background_steps.length === 0 &&
            Object.keys(this.background_data).length === 0
        );
    }
}

module.exports = BackgroundModel;
